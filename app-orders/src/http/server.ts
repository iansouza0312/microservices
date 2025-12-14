import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { channels } from "../broker/channels/index.ts";
import { schema } from "../database/schema/index.ts";
import { db } from "../database/client.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, { origin: "*" });

// Escalonamento horizontal de microsserviços
// Deploy: Blue-Green Deployment

app.get("/health", () => {
  return "OK";
});

app.post(
  "/orders",
  {
    schema: {
      body: z.object({
        amount: z.coerce.number(),
      }),
    },
  },
  async (request, reply) => {
    const { amount } = request.body;

    console.log("[ORDERS] New order received:", amount);

    channels.orders.sendToQueue(
      "orders",
      Buffer.from(JSON.stringify({ amount }))
    );

    await db.insert(schema.orders).values({
      id: randomUUID(),
      customerId: "5c04c63f-e3ab-4b3d-aefe-3d8781063047",
      amount,
    });

    return reply.status(201).send();
  }
);

app.listen({ host: "0.0.0.0", port: 3333 }).then(() => {
  console.log("[ORDERS] HTTP server running");
});

import "@opentelemetry/auto-instrumentations-node/register";

import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { randomUUID } from "node:crypto";
import { setTimeout } from "node:timers/promises";
import { trace } from "@opentelemetry/api";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { schema } from "../database/schema/index.ts";
import { db } from "../database/client.ts";
import { dispatchOrderCreated } from "../broker/messages/orders-created.ts";
import { tracer } from "../tracer/tracer.ts";

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

    const orderId = randomUUID();

    await db.insert(schema.orders).values({
      id: orderId,
      customerId: "edd18e21-4807-468f-826c-4a929a0f905d",
      amount,
    });

    const span = tracer.startSpan(
      "O código parecer estar demorando muito para rodar aqui "
    );
    span.setAttribute("Teste", "Hello World");

    setTimeout(2000);

    span.end();

    trace.getActiveSpan()?.setAttribute("order_id", orderId);

    dispatchOrderCreated({
      orderId,
      amount,
      customer: {
        id: "edd18e21-4807-468f-826c-4a929a0f905d",
      },
    });

    return reply.status(201).send();
  }
);

app.listen({ host: "0.0.0.0", port: 3333 }).then(() => {
  console.log("[ORDERS] HTTP server running");
});

import "@opentelemetry/auto-instrumentations-node/register";

import "../broker/subscriber.ts";

import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, { origin: "*" });

// Escalonamento horizontal de microsserviços
// Deploy: Blue-Green Deployment

app.get("/health", () => {
  return "OK";
});

app.listen({ host: "0.0.0.0", port: 3334 }).then(() => {
  console.log("[INVOICES] HTTP server running");
});

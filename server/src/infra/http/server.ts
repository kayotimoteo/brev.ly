import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import scalarUI from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createShortenedLinkRoute } from "./routes/create-shortened-link";
import { deleteShortenedLinkRoute } from "./routes/delete-shortened-link";
import { exportShortenedLinksRoute } from "./routes/export-shortened-links";
import { getOriginalLinkRoute } from "./routes/get-original-link";
import { getShortenedLinksRoute } from "./routes/get-shortened-links";
import { updateAccessQuantityRoute } from "./routes/update-access-quantity";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply
      .status(400)
      .send({ message: "Validation error", issues: error.validation });
  }

  console.log(error);

  return reply.status(500).send({ message: "Internal server error" });
});

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Brev.ly",
      description: "API para criar e gerenciar links encurtados.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

server.register(scalarUI, {
  routePrefix: "/docs",
  configuration: {
    layout: "classic",
  },
});

server.register(createShortenedLinkRoute);
server.register(deleteShortenedLinkRoute);
server.register(getShortenedLinksRoute);
server.register(getOriginalLinkRoute);
server.register(updateAccessQuantityRoute);
server.register(exportShortenedLinksRoute);

server.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running on http://localhost:3333");
});

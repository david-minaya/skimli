import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import Container from "typedi";
import { validateInput } from "./format-error";
import { HelloResolver } from "./hello.resolver";

export const schema = buildSchemaSync({
  resolvers: [HelloResolver],
  container: Container,
  validate: validateInput,
});

import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3001/api/graphql",
  generates: {
    "src/graphqls/schema/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;

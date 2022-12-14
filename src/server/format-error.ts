import { validate, ValidationError } from "class-validator";
import { GraphQLError } from "graphql";

interface Error {
  field: string;
  message: string[];
}

function formatError(errors: ValidationError[]) {
  let formattedErros: Error[] = [];

  for (const e of errors) {
    formattedErros.push({
      field: e.property,
      message: Object.values({ ...e.constraints }),
    });
  }

  return formattedErros;
}

export async function validateInput(input: any) {
  const errors: ValidationError[] = await validate(input);
  if (errors?.length > 0) {
    throw new GraphQLError("Validation Error", {
      extensions: {
        code: 400,
        validationErrors: formatError(errors),
      },
    });
  }
}

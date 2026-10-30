/** Small builders so the path files stay short and readable. */

export const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

export const jsonBody = (schemaName: string, required = true) => ({
  required,
  content: { "application/json": { schema: ref(schemaName) } },
});

export const jsonResponse = (description: string, schema: object) => ({
  description,
  content: { "application/json": { schema } },
});

export const errorResponse = (description: string) => jsonResponse(description, ref("Error"));

/** Shared error responses, reusable via spread in `responses`. */
export const commonErrors = {
  400: errorResponse("Validation failed"),
  401: errorResponse("Missing, invalid or expired token"),
  403: errorResponse("Not allowed for this role / assignment"),
};

export const secured = [{ bearerAuth: [] }];

export const uuidParam = (name: string, description: string) => ({
  name,
  in: "path",
  required: true,
  description,
  schema: { type: "string", format: "uuid" },
});

export const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);


// Copies only whitelisted keys from an untrusted object (like req.body).
// This prevents clients from setting fields such as owner, members, board, createdBy.
export const pick = <T>(
  source: unknown,
  keys: readonly (keyof T & string)[],
): Partial<T> => {
  const out: Record<string, unknown> = {};
  if (!source || typeof source !== "object") return out as Partial<T>;

  for (const key of keys) {
    const value = (source as Record<string, unknown>)[key];
    if (value !== undefined) out[key] = value;
  }
  return out as Partial<T>;
};

export const toJSONOptions = {
  versionKey: false,
  transform: (_doc: unknown, ret: Record<string, any>) => {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  },
};

import { Schema, model, Document } from "mongoose";

export interface ISchema extends Document {}

const schema = new Schema<ISchema>({}, { timestamps: true });

export default model<ISchema>("example", schema);

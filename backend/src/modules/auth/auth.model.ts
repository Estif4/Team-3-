import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRefreshTokenDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
  },
  {
    timestamps: true,
  }
);

export const RefreshTokenModel = mongoose.model<IRefreshTokenDocument>('RefreshToken', RefreshTokenSchema);
export { UserModel } from '../users/user.model.js';

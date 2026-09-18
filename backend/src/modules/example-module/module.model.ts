import mongoose, { Schema } from 'mongoose';
import { IExampleDocument } from './module.types.js';

const ExampleSchema = new Schema<IExampleDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ExampleModel = mongoose.model<IExampleDocument>('Example', ExampleSchema);

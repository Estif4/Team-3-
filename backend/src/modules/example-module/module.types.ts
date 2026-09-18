import { Document, Types } from 'mongoose';

export interface IExample {
  title: string;
  description: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExampleDocument extends IExample, Document {
  _id: Types.ObjectId;
}

export type CreateExampleInput = Pick<IExample, 'title' | 'description' | 'category'> & {
  tags?: string[];
  isPublished?: boolean;
  createdBy: string;
};

export type UpdateExampleInput = Partial<Pick<IExample, 'title' | 'description' | 'category' | 'tags' | 'isPublished'>>;

export interface ExampleFilterOptions {
  category?: string;
  isPublished?: boolean;
  search?: string;
}

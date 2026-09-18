export interface ExampleItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ExampleFilters {
  search?: string;
  category?: string;
  isPublished?: boolean;
}

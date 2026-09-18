export type { User } from '../../../types/index.js';

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
}

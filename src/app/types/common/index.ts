// Basic shared types (e.g., ApiResponse, Pagination)
/**
 * Common types used across the application
 * These are basic types that don't fit into other categories
 */

export type ID = string | number;

export interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
}

export type SortDirection = 'asc' | 'desc';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
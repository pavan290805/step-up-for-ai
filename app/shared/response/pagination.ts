export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function buildPaginatedResult<T extends { _id: unknown }>(
  records: T[],
  limit: number
): PaginatedResult<T> {
  const hasMore = records.length > limit;
  const items = records.slice(0, limit);
  const lastItem = items.at(-1);

  return {
    items,
    nextCursor: hasMore && lastItem ? String(lastItem._id) : null,
    hasMore,
  };
}

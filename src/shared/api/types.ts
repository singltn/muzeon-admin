export type ApiErrorBody = {
  code: string;
  message: string;
  request_id?: string;
};

/** Стандартный список с пагинацией */
export type ListResponse<T> = {
  items: T[];
  total: number;
};

/** Алиас для совместимости */
export type PaginatedResponse<T> = ListResponse<T>;

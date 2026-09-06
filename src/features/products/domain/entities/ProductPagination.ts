
import { Product } from './Product';

export interface ProductPagination {
  data: Product[];

  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
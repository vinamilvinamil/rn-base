import { apiClient } from "@/infrastructure/api";
import { CategoryDto, ProductDetailDto, ProductListResponseDto, ShippingMethodDto, UpdateProductRequestDto } from "../dto/ProductDto";

export const productApi = {
    async getProducts(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<ProductListResponseDto> {
    const response =
      await apiClient.get<ProductListResponseDto>(
        '/products',
        {
          params,
        },
      );

    return response.data;
  },
  
    getDetail: async (id: string) => {
        const response = await apiClient.get<ProductDetailDto>(`/products/${id}`)
        return response.data
    },
    getCategories: async () => {
        const response =
            await apiClient.get<CategoryDto[]>(
                '/master-data/categories',
            );

        return response.data;
    },

    getShippingMethods: async () => {
        const response =
            await apiClient.get<ShippingMethodDto[]>(
                '/master-data/shipping-methods',
            );

        return response.data;
    },
    update: async (
        productId: string,
        data: UpdateProductRequestDto,
    ) => {
        const response =
            await apiClient.put<ProductDetailDto>(
                `/products/${productId}`,
                data,
            );

        return response.data;
    },

}
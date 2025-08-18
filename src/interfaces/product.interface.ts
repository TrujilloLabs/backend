export interface IProductDto {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    priceCop: number;
    priceUsd?: number | null;
    imageUrl?: string;
    storeId: string;
    categoryId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
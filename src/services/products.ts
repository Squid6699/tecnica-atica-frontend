import { Delete, Get, Post, Put } from "../plugins/axios";


export interface Product {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    disponible: boolean;
}

export interface NewProduct {
    codigo: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
}

export interface PaginatedProducts {
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const ProductosServices = {

    getAllProducts: async (): Promise<Product[]> => {
        const response = await Get("products");
        return response.data;
    },

    getPaginatedProducts: async (page: number): Promise<PaginatedProducts> => {
        const response = await Get(`products/paginated?page=${page}`);
        return response.data;
    },

    getProductById: async (productId: number): Promise<Product> => {
        const response = await Get(`products/${productId}`);
        return response.data;
    },

    createProduct: async (product: Omit<Product, "id" | "disponible">): Promise<Product> => {
        const response = await Post("products", product);
        return response.data;
    },

    updateProduct: async (productId: number, product: Omit<Product, "id" | "disponible">): Promise<Product> => {
        const response = await Put(`products/${productId}`, product);
        return response.data;
    },

    deleteProduct: async (productId: number): Promise<Product> => {
        const response = await Delete(`products/${productId}`);
        return response.data;
    }
}
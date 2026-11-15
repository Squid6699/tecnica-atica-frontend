import { Get, Post } from "../plugins/axios";


export interface Product {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    disponible: boolean;
}

export const ProductosServices = {

    getAllProducts: async (): Promise<Product[]> => {
        const response = await Get("products");
        return response.data;
    },

    createProduct: async (product: Omit<Product, "id" | "disponible">): Promise<Product> => {
        const response = await Post("products", product);
        return response.data;
    }
}
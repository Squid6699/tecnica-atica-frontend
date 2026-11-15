import { Get } from "../plugins/axios";

const API_URL = 'http://localhost:3000/api/products';

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
        const response = await Get(API_URL);
        return response.data;
    }
}
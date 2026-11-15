import { Get } from "../plugins/axios";


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
    }
}
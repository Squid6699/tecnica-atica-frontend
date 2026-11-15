import axios from "axios";

const HOST = import.meta.env.VITE_HOST;

export const api = axios.create({
    baseURL: `${HOST}`,
    withCredentials: true,
});

export const Post = (url: string, data?: any) => {
    return api.post(url, data);
}

export const Get = (url: string, params?: any) => {
    return api.get(url, { params });
}

export const Put = (url: string, data: any) => {
    return api.put(url, data);
}

export const Delete = (url: string) => {
    return api.delete(url);
}
import { useEffect, useState } from "react";
import { ProductosServices } from "../services/products.ts";
import { type Product as ProductType } from "../services/products.ts";
import { Card } from "../components/Card.tsx";
import { Loading } from "../components/UI/Loading.tsx";
import { formatCurrency } from "../utils/formatPrice.tsx";

export const Product = () => {
    interface State {
        products: ProductType[];
        loading: boolean;
        error: string | null;
    }

    const [state, setState] = useState<State>({
        products: [],
        loading: false,
        error: null,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setState((currentState) => ({ ...currentState, loading: true, error: null }));

            try {
                const products = await ProductosServices.getAllProducts();
                setState({ products, loading: false, error: null });
            } catch {
                setState({
                    products: [],
                    loading: false,
                    error: "No se pudieron cargar los productos.",
                });
            }
        }

        void fetchProducts();
    }, []);

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">

            {state.loading && <Loading />}

            {state.error && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
                    {state.error}
                </p>
            )}

            {!state.loading && !state.error && state.products.length === 0 && (
                <p className="text-primary">No hay productos disponibles.</p>
            )}

            {!state.loading && !state.error && state.products.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {state.products.map((product) => (
                        <Card key={product.id} className="flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-primary/70">
                                        {product.codigo}
                                    </p>
                                    <h3 className="mt-1 text-xl font-bold text-primary">
                                        {product.nombre}
                                    </h3>
                                </div>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        product.disponible
                                            ? "bg-primary text-secondary"
                                            : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    {product.disponible ? "Disponible" : "Agotado"}
                                </span>
                            </div>

                            <p className="flex-1 text-gray-600">{product.descripcion}</p>

                            <div className="flex items-end justify-between border-t border-primary/20 pt-4">
                                <div>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatCurrency(product.precio)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Stock: {product.stock}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    )
}
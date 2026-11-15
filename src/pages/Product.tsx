import { useEffect, useState, type FormEvent } from "react";
import { ProductosServices } from "../services/products.ts";
import { type Product as ProductType } from "../services/products.ts";
import { Card } from "../components/Card.tsx";
import { Loading } from "../components/UI/Loading.tsx";
import { formatCurrency } from "../utils/formatPrice.tsx";
import { Button } from "../components/UI/Button.tsx";
import { Input } from "../components/Input.tsx";
import { Modal } from "../components/Modal.tsx";

export const Product = () => {

    interface State {
        products: ProductType[];
        loading: boolean;
        error: string | null;
        modalCrearAbierto: boolean;
        errorCreando: {
            codigo: string | null;
            nombre: string | null;
            descripcion: string | null;
            precio: string | null;
            stock: string | null;
        };
        nuevoProducto: {
            codigo: string;
            nombre: string;
            descripcion: string;
            precio: number;
            stock: number;
        }
    }

    const [state, setState] = useState<State>({
        products: [],
        loading: false,
        error: null,
        modalCrearAbierto: false,
        errorCreando: {
            codigo: null,
            nombre: null,
            descripcion: null,
            precio: null,
            stock: null,
        },
        nuevoProducto: {
            codigo: "",
            nombre: "",
            descripcion: "",
            precio: 0,
            stock: 0,
        }
    });

    const {products, loading, error, modalCrearAbierto, errorCreando, nuevoProducto} = state;

    useEffect(() => {
        const fetchProducts = async () => {
            setState((currentState) => ({ ...currentState, loading: true, error: null }));

            try {
                const products = await ProductosServices.getAllProducts();
                setState({ ...state, products, loading: false, error: null });
            } catch {
                setState({
                    ...state,
                    products: [],
                    loading: false,
                    error: "No se pudieron cargar los productos.",
                });
            }
        }

        fetchProducts();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setState({
            ...state,
            nuevoProducto: {
                ...nuevoProducto,
                [name]: name === "precio" || name === "stock" ? parseFloat(value) : value,
            }
        });
    }

    const closeAddModal = () => {
        setState({ ...state, modalCrearAbierto: false, errorCreando: { codigo: null, nombre: null, descripcion: null, precio: null, stock: null }, nuevoProducto: { codigo: "", nombre: "", descripcion: "", precio: 0, stock: 0 } });
    };

    const handleAddProduct = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (nuevoProducto.codigo.trim() === "") {
            setState({
                ...state,
                errorCreando: { ...errorCreando, codigo: "El código es obligatorio." },
            });
            return;
        }

        if (nuevoProducto.nombre.trim() === "") {
            setState({
                ...state,
                errorCreando: { ...errorCreando, nombre: "El nombre es obligatorio." },
            });
            return;
        }

        if (nuevoProducto.precio <= 0) {
            setState({
                ...state,
                errorCreando: { ...errorCreando, precio: "El precio debe ser mayor que cero." },
            });
            return;
        }

        if (nuevoProducto.stock < 0) {
            setState({
                ...state,
                errorCreando: { ...errorCreando, stock: "El stock no puede ser negativo." },
            });
            return;
        }
    };

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                        Catálogo
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-primary">Productos</h2>
                </div>
                <Button onClick={() => setState({ ...state, modalCrearAbierto: true })}>
                    Agregar producto
                </Button>
            </div>

            {loading && <Loading />}

            {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
                    {error}
                </p>
            )}

            {!loading && !error && products.length === 0 && (
                <p className="text-primary">No hay productos disponibles.</p>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
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

            <Modal
                open={modalCrearAbierto}
                title="Agregar producto"
                onClose={closeAddModal}
            >
                <form className="flex flex-col gap-4" onSubmit={handleAddProduct}>
                    <Input label="Código" name="codigo" placeholder="Ej. ACA-001" error={errorCreando.codigo} onChange={handleInputChange} />
                    <Input label="Nombre" name="nombre" placeholder="Nombre del producto" error={errorCreando.nombre} onChange={handleInputChange} />
                    <Input
                        label="Descripción"
                        name="descripcion"
                        placeholder="Describe el producto"
                        error= {errorCreando.descripcion}
                        onChange={handleInputChange}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                            label="Precio"
                            name="precio"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            error={errorCreando.precio}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Stock"
                            name="stock"
                            type="number"
                            min="0"
                            placeholder="0"
                            error={errorCreando.stock}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={closeAddModal}>
                            Cancelar
                        </Button>
                        <Button type="submit">Guardar producto</Button>
                    </div>
                </form>
            </Modal>
        </main>
    )
}
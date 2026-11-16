import { useEffect, useState, type FormEvent } from "react";
import { ProductosServices, type NewProduct } from "../../services/products.ts";
import { type Product as ProductType } from "../../services/products.ts";
import { Card } from "../../components/Card.tsx";
import { Loading } from "../../components/UI/Loading.tsx";
import { formatCurrency } from "../../utils/formatPrice.tsx";
import { Button } from "../../components/UI/Button.tsx";
import { AxiosError } from "axios";
import { ModalCrear, type ProductFormErrors } from "./ModalCrear.tsx";
import { ModalEliminar } from "./ModalEliminar.tsx";
import { ModalEditar } from "./ModalEditar.tsx";
import { ModalDetalles } from "./ModalDetalles.tsx";

export const Product = () => {

    interface State {
        products: ProductType[];
        loading: boolean;
        guardando: boolean;
        error: string | null;
        modalCrearAbierto: boolean;
        modalEliminarAbierto: boolean;
        productoAEliminar: number | null;
        modalEditarAbierto: boolean;
        productoEditando: (NewProduct & { id: number }) | null;
        errorEditando: ProductFormErrors;
        editando: boolean;
        modalDetallesAbierto: boolean;
        productoDetalles: ProductType | null;
        cargandoDetalles: boolean;
        errorCreando: ProductFormErrors;
        nuevoProducto: NewProduct;
    }

    const [state, setState] = useState<State>({
        products: [],
        loading: false,
        guardando: false,
        error: null,
        modalCrearAbierto: false,
        modalEliminarAbierto: false,
        productoAEliminar: null,
        modalEditarAbierto: false,
        productoEditando: null,
        errorEditando: {
            errorGeneral: null,
            codigo: null,
            nombre: null,
            descripcion: null,
            precio: null,
            stock: null,
        },
        editando: false,
        modalDetallesAbierto: false,
        productoDetalles: null,
        cargandoDetalles: false,
        errorCreando: {
            errorGeneral: null,
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

    const {
        products,
        loading,
        error,
        modalCrearAbierto,
        errorCreando,
        nuevoProducto,
        guardando,
        modalEliminarAbierto,
        productoAEliminar,
        modalEditarAbierto,
        productoEditando,
        errorEditando,
        editando,
        modalDetallesAbierto,
        productoDetalles,
        cargandoDetalles,
    } = state;

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

        setState((prev) => ({
            ...prev,
            nuevoProducto: {
                ...prev.nuevoProducto,
                [name]: name === "precio" || name === "stock"
                    ? parseFloat(value)
                    : value,
            },
            errorCreando: {
                ...prev.errorCreando,
                [name]: null,
            },
        }));
    };

    const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setState((prev) => ({
            ...prev,
            productoEditando: prev.productoEditando
                ? {
                    ...prev.productoEditando,
                    [name]: name === "precio" || name === "stock"
                        ? parseFloat(value)
                        : value,
                }
                : null,
            errorEditando: {
                ...prev.errorEditando,
                [name]: null,
            },
        }));
    };

    const closeAddModal = () => {
        setState({ ...state, modalCrearAbierto: false, errorCreando: { errorGeneral: null, codigo: null, nombre: null, descripcion: null, precio: null, stock: null }, nuevoProducto: { codigo: "", nombre: "", descripcion: "", precio: 0, stock: 0 } });
    };

    const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setState((prev) => ({
            ...prev,
            guardando: true
        }));

        setState((prev) => ({
            ...prev,
            errorCreando: {
                errorGeneral: null,
                codigo: null,
                nombre: null,
                descripcion: null,
                precio: null,
                stock: null
            }
        }));

        if (nuevoProducto.codigo.trim() === "") {
            setState((prev) => ({
                ...prev,
                errorCreando: {
                    ...prev.errorCreando,
                    codigo: "El código es obligatorio."
                }
            }));
            return;
        }

        if (nuevoProducto.nombre.trim() === "") {
            setState((prev) => ({
                ...prev,
                errorCreando: { ...prev.errorCreando, nombre: "El nombre es obligatorio." },
            }));
            return;
        }

        if (nuevoProducto.precio <= 0) {
            setState((prev) => ({
                ...prev,
                errorCreando: { ...prev.errorCreando, precio: "El precio debe ser mayor que cero." },
            }));
            return;
        }

        if (nuevoProducto.stock < 0) {
            setState((prev) => ({
                ...prev,
                errorCreando: { ...prev.errorCreando, stock: "El stock no puede ser negativo." },
            }));
            return;
        }

        try {
            const createProduct = await ProductosServices.createProduct(nuevoProducto);
            if (createProduct) {
                setState((prev) => ({
                    ...prev,
                    products: [...prev.products, createProduct],
                    modalCrearAbierto: false,
                    guardando: false,
                    errorCreando: { errorGeneral: null, codigo: null, nombre: null, descripcion: null, precio: null, stock: null },
                    nuevoProducto: { codigo: "", nombre: "", descripcion: "", precio: 0, stock: 0 }
                }));
            }
        } catch (error) {

            setState((prev) => ({
                ...prev,
                guardando: false
            }));

            if (error instanceof AxiosError) {

                const status = error.response?.status;
                const response = error.response?.data;

                // Error de validación DTO
                if (status === 400 && response.errors) {

                    const validationErrors: Record<string, string> = {};

                    response.errors.forEach((item: any) => {
                        validationErrors[item.property] = item.message;
                    });

                    setState((prev) => ({
                        ...prev,
                        errorCreando: {
                            ...prev.errorCreando,
                            ...validationErrors
                        }
                    }));
                } else {
                    setState((prev) => ({
                        ...prev,
                        errorCreando: {
                            ...prev.errorCreando,
                            errorGeneral: response.message || 'Ocurrió un error al crear el producto.'
                        }
                    }));
                }
            }
        }
    };

    const handleDeleteProduct = async () => {
        if (productoAEliminar === null) return;

        try {
            const deletedProduct = await ProductosServices.deleteProduct(productoAEliminar);
            setState((prev) => ({
                ...prev,
                products: prev.products.filter(product => product.id !== deletedProduct.id),
                modalEliminarAbierto: false,
                productoAEliminar: null
            }));
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    }

    const openDeleteModal = (productId: number) => {
        setState((prev) => ({
            ...prev,
            modalEliminarAbierto: true,
            productoAEliminar: productId
        }));
    };

    const closeDeleteModal = () => {
        setState((prev) => ({
            ...prev,
            modalEliminarAbierto: false,
            productoAEliminar: null
        }));
    }

    const openDetailsModal = async (productId: number) => {
        setState((prev) => ({
            ...prev,
            modalDetallesAbierto: true,
            productoDetalles: null,
            cargandoDetalles: true,
        }));

        try {
            const product = await ProductosServices.getProductById(productId);
            setState((prev) => ({
                ...prev,
                productoDetalles: product,
                cargandoDetalles: false,
            }));
        } catch {
            setState((prev) => ({
                ...prev,
                cargandoDetalles: false,
            }));
        }
    };

    const closeDetailsModal = () => {
        setState((prev) => ({
            ...prev,
            modalDetallesAbierto: false,
            productoDetalles: null,
        }));
    };

    const openEditModal = async (productId: number) => {
        setState((prev) => ({
            ...prev, editando: true,
            errorEditando: {
                errorGeneral: null, codigo: null, nombre: null, descripcion: null, precio: null, stock: null,
            },
            modalEditarAbierto: true,
            productoEditando: null
        }));

        try {
            const product = await ProductosServices.getProductById(productId);
            setState((prev) => ({
                ...prev,
                modalEditarAbierto: true,
                editando: false,
                productoEditando: product,
            }));
        } catch {
            setState((prev) => ({
                ...prev,
                editando: false,
                errorEditando: {
                    ...prev.errorEditando,
                    errorGeneral: "No se pudo cargar el producto para editarlo.",
                },
            }));
        }
    };

    const closeEditModal = () => {
        setState((prev) => ({
            ...prev,
            modalEditarAbierto: false,
            productoEditando: null,
            errorEditando: {
                errorGeneral: null, codigo: null, nombre: null, descripcion: null, precio: null, stock: null,
            },
        }));
    };

    const handleEditProduct = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!productoEditando) return;

        setState((prev) => ({
            ...prev,
            errorEditando: {
                errorGeneral: null,
                codigo: null,
                nombre: null,
                descripcion: null,
                precio: null,
                stock: null
            }
        }));

        if (!productoEditando.codigo.trim()) {
            setState((prev) => ({
                ...prev,
                errorEditando: { ...prev.errorEditando, codigo: "El código es obligatorio." }
            }));
            return;
        }
        if (!productoEditando.nombre.trim()) {
            setState((prev) => ({
                ...prev,
                errorEditando: { ...prev.errorEditando, nombre: "El nombre es obligatorio." }
            }));
            return;
        }
        if (productoEditando.precio <= 0) {
            setState((prev) => ({
                ...prev,
                errorEditando: { ...prev.errorEditando, precio: "El precio debe ser mayor que cero." }
            }));
            return;
        }
        if (productoEditando.stock < 0) {
            setState((prev) => ({
                ...prev,
                errorEditando: { ...prev.errorEditando, stock: "El stock no puede ser negativo." }
            }));
            return;
        }

        setState((prev) => ({
            ...prev,
            editando: true,
            errorEditando: {
                errorGeneral: null,
                codigo: null,
                nombre: null,
                descripcion: null,
                precio: null,
                stock: null
            }
        }));

        try {
            const productData = {
                ...productoEditando,
                precio: Number(productoEditando.precio),
                stock: Number(productoEditando.stock)
            }
            
            const updatedProduct = await ProductosServices.updateProduct(productoEditando.id, productData);
            setState((prev) => ({
                ...prev,
                products: prev.products.map((product) =>
                    product.id === updatedProduct.id ? updatedProduct : product
                ),
                modalEditarAbierto: false,
                productoEditando: null,
                editando: false,
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                editando: false
            }));

            if (error instanceof AxiosError) {
                const status = error.response?.status;
                const response = error.response?.data;

                if (status === 400 && response.errors) {
                    const validationErrors: Record<string, string> = {};

                    response.errors.forEach((item: any) => {
                        validationErrors[item.property] = item.message;
                    });

                    setState((prev) => ({
                        ...prev,
                        errorEditando: {
                            ...prev.errorEditando,
                            ...validationErrors
                        }
                    }));
                } else {
                    setState((prev) => ({
                        ...prev,
                        errorEditando: {
                            ...prev.errorEditando,
                            errorGeneral: response.message || "Ocurrió un error al editar el producto."
                        }
                    }));
                }
            }
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
                        <Card
                            key={product.id}
                            className="flex flex-col gap-4"
                            footer={
                                <>
                                    <Button
                                        variant="secondary"
                                        className="flex-1 px-3 py-2 text-sm"
                                        onClick={() => openDetailsModal(product.id)}
                                    >
                                        Detalles
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="flex-1 px-3 py-2 text-sm"
                                        onClick={() => openEditModal(product.id)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="flex-1 px-3 py-2 text-sm"
                                        onClick={() => openDeleteModal(product.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </>
                            }
                        >
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
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${product.disponible
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

            <ModalCrear
                open={modalCrearAbierto}
                onClose={closeAddModal}
                onSubmit={handleAddProduct}
                onChange={handleInputChange}
                errors={errorCreando}
                saving={guardando}
            />

            <ModalEliminar
                open={modalEliminarAbierto}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteProduct}
            />

            <ModalEditar
                open={modalEditarAbierto}
                product={productoEditando}
                onClose={closeEditModal}
                onSubmit={handleEditProduct}
                onChange={handleEditInputChange}
                errors={errorEditando}
                saving={editando}
                loading={editando && productoEditando === null}
            />

            <ModalDetalles
                open={modalDetallesAbierto}
                product={productoDetalles}
                loading={cargandoDetalles}
                onClose={closeDetailsModal}
            />
        </main>
    )
}
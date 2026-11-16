import { Modal } from "../../components/Modal.tsx";
import { Loading } from "../../components/UI/Loading.tsx";
import type { Product } from "../../services/products.ts";
import { formatCurrency } from "../../utils/formatPrice.tsx";

interface ModalDetallesProps {
    open: boolean;
    product: Product | null;
    loading: boolean;
    onClose: () => void;
}

export const ModalDetalles = ({
    open,
    product,
    loading,
    onClose,
}: ModalDetallesProps) => {
    return (
        <Modal open={open} title="Detalles del producto" onClose={onClose}>
            {loading ? (
                <Loading />
            ) : product ? (
                <div className="flex flex-col gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-gray-500">Código</p>
                            <p className="font-semibold text-primary">{product.codigo}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Nombre</p>
                            <p className="font-semibold text-primary">{product.nombre}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Descripción</p>
                        <p className="text-gray-700">{product.descripcion || "Sin descripción"}</p>
                    </div>

                    <div className="grid gap-4 border-t border-primary/20 pt-4 sm:grid-cols-3">
                        <div>
                            <p className="text-sm text-gray-500">Precio</p>
                            <p className="text-xl font-bold text-primary">
                                {formatCurrency(product.precio)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Stock</p>
                            <p className="font-semibold text-primary">{product.stock}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Estado</p>
                            <p className="font-semibold text-primary">
                                {product.disponible ? "Disponible" : "Agotado"}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-red-700" role="alert">
                    No se pudo cargar el producto.
                </p>
            )}
        </Modal>
    );
};

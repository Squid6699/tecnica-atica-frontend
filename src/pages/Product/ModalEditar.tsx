import type { ChangeEvent, FormEvent } from "react";
import { Button } from "../../components/UI/Button.tsx";
import { Input } from "../../components/Input.tsx";
import { Modal } from "../../components/Modal.tsx";
import { Loading } from "../../components/UI/Loading.tsx";
import type { ProductFormErrors } from "./ModalCrear.tsx";
import type { NewProduct } from "../../services/products.ts";

interface ModalEditarProps {
    open: boolean;
    product: NewProduct | null;
    onClose: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    errors: ProductFormErrors;
    saving: boolean;
    loading: boolean;
}

export const ModalEditar = ({
    open,
    product,
    onClose,
    onSubmit,
    onChange,
    errors,
    saving,
    loading,
}: ModalEditarProps) => {
    return (
        <Modal open={open} title="Editar producto" onClose={onClose}>
            {loading ? (
                <Loading />
            ) : !product ? (
                <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
                    {errors.errorGeneral || "No se pudo cargar el producto."}
                </p>
            ) : (
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    {errors.errorGeneral && (
                        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
                            {errors.errorGeneral}
                        </p>
                    )}
                    <Input label="Código" name="codigo" value={product.codigo} error={errors.codigo} onChange={onChange} />
                    <Input label="Nombre" name="nombre" value={product.nombre} error={errors.nombre} onChange={onChange} />
                    <Input label="Descripción" name="descripcion" value={product.descripcion} error={errors.descripcion} onChange={onChange} />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                            label="Precio"
                            name="precio"
                            type="number"
                            min="0"
                            step="0.01"
                            value={product.precio}
                            error={errors.precio}
                            onChange={onChange}
                        />
                        <Input
                            label="Stock"
                            name="stock"
                            type="number"
                            min="0"
                            value={product.stock}
                            error={errors.stock}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

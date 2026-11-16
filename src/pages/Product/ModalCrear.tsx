import type { ChangeEvent, FormEvent } from "react";
import { Button } from "../../components/UI/Button.tsx";
import { Input } from "../../components/Input.tsx";
import { Modal } from "../../components/Modal.tsx";

export interface ProductFormErrors {
    errorGeneral?: string | null;
    codigo: string | null;
    nombre: string | null;
    descripcion: string | null;
    precio: string | null;
    stock: string | null;
}

interface ModalCrearProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    errors: ProductFormErrors;
    saving: boolean;
}

export const ModalCrear = ({
    open,
    onClose,
    onSubmit,
    onChange,
    errors,
    saving,
}: ModalCrearProps) => {
    return (
        <Modal open={open} title="Agregar producto" onClose={onClose}>
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                {errors.errorGeneral && (
                    <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
                        {errors.errorGeneral}
                    </p>
                )}
                <Input
                    label="Código"
                    name="codigo"
                    placeholder="Ej. ACA-001"
                    error={errors.codigo}
                    onChange={onChange}
                />
                <Input
                    label="Nombre"
                    name="nombre"
                    placeholder="Nombre del producto"
                    error={errors.nombre}
                    onChange={onChange}
                />
                <Input
                    label="Descripción"
                    name="descripcion"
                    placeholder="Describe el producto"
                    error={errors.descripcion}
                    onChange={onChange}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        label="Precio"
                        name="precio"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        error={errors.precio}
                        onChange={onChange}
                    />
                    <Input
                        label="Stock"
                        name="stock"
                        type="number"
                        min="0"
                        placeholder="0"
                        error={errors.stock}
                        onChange={onChange}
                    />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

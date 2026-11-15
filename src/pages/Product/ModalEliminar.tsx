import { Modal } from "../../components/Modal"


interface ModalEliminarProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ModalEliminar = ({
    open,
    onClose,
    onConfirm,
}: ModalEliminarProps) => {

    return (
        <Modal open={open} title="Eliminar producto" onClose={onClose}>

            <p className="text-gray-700">¿Está seguro que desea eliminar este producto?</p>

            <div className="flex justify-end space-x-2 mt-4">
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={onConfirm}
                >
                    Eliminar
                </button>
            </div>
        </Modal>
    )
}
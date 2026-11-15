import { useEffect, type ReactNode } from "react"

type ModalProps = {
    open: boolean
    title: string
    children: ReactNode
    onClose: () => void
}

export const Modal = ({ open, title, children, onClose }: ModalProps) => {
    useEffect(() => {
        if (!open) {
            return
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [onClose, open])

    if (!open) {
        return null
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose()
                }
            }}
        >
            <section
                className="bg-secondary w-full max-w-lg rounded-xl border border-primary/30 p-6 shadow-xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="mb-5 flex items-center justify-between gap-4">
                    <h2 id="modal-title" className="text-xl font-bold text-primary">
                        {title}
                    </h2>
                    <button
                        type="button"
                        className="rounded-full p-2 text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        onClick={onClose}
                        aria-label="Cerrar modal"
                    >
                        <span aria-hidden="true" className="text-xl leading-none">
                            ×
                        </span>
                    </button>
                </div>
                {children}
            </section>
        </div>
    )
}
import { Button } from "./UI/Button.tsx";

interface FooterPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export const FooterPagination = ({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
}: FooterPaginationProps) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <footer className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
                variant="secondary"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={disabled || currentPage === 1}
                aria-label="Página anterior"
            >
                Anterior
            </Button>

            <span className="text-sm font-semibold text-primary" aria-live="polite">
                Página {currentPage} de {totalPages}
            </span>

            <Button
                variant="secondary"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={disabled || currentPage === totalPages}
                aria-label="Página siguiente"
            >
                Siguiente
            </Button>
        </footer>
    );
};

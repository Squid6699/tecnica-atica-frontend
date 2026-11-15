import type { HTMLAttributes, ReactNode } from "react"

type CardProps = HTMLAttributes<HTMLDivElement> & {
    footer?: ReactNode
}

export const Card = ({ children, className = "", footer, ...props }: CardProps) => {
    return (
        <article
            className={`border-primary bg-secondary rounded-xl border p-5 shadow-sm ${className}`}
            {...props}
        >
            {children}
            {footer && (
                <footer className="mt-5 flex flex-wrap gap-2 border-t border-primary/20 pt-4">
                    {footer}
                </footer>
            )}
        </article>
    )
}
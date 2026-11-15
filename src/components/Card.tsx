import type { HTMLAttributes } from "react"

type CardProps = HTMLAttributes<HTMLDivElement>

export const Card = ({ children, className = "", ...props }: CardProps) => {
    return (
        <article
            className={`border-primary bg-secondary rounded-xl border p-5 shadow-sm ${className}`}
            {...props}
        >
            {children}
        </article>
    )
}
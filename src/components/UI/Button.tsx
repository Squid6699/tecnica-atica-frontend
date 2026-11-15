import type { ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary"
}

export const Button = ({
    children,
    className = "",
    type = "button",
    variant = "primary",
    ...props
}: ButtonProps) => {
    const variantStyles = {
        primary: "bg-primary text-secondary hover:brightness-95",
        secondary: "border-primary text-primary bg-secondary border hover:bg-primary hover:text-secondary",
    }

    return (
        <button
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${className}`}
            type={type}
            {...props}
        >
            {children}
        </button>
    )
}
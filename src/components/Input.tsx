import type { InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    error?: string | null
}

export const Input = ({
    id,
    label,
    error,
    className = "",
    ...props
}: InputProps) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-")
    const errorId = `${inputId}-error`

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={inputId} className="font-semibold text-primary">
                {label}
            </label>
            <input
                id={inputId}
                className={`rounded-lg border border-primary/40 bg-secondary px-3 py-2 text-gray-800 outline-none transition-shadow placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? "border-red-500" : ""} ${className}`}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                {...props}
            />
            {error && (
                <p id={errorId} className="text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}
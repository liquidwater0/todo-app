import { ReactNode, HTMLAttributes } from 'react';

type FilterButtonProps = {
    children: ReactNode,
    active?: boolean,
    className?: string,
} & HTMLAttributes<HTMLButtonElement>

export default function FilterButton({ children, active, className, ...props }: FilterButtonProps) {
    return (
        <button 
            className={`filter-button ${active ? "active" : ""} ${className ? className : ""}`}
            type="button" 
            { ...props }
        >
            { children }
        </button>
    );
}
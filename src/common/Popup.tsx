import { useEffect, useRef, type FC, type ReactNode, type MouseEvent } from "react";
import classNames from "classnames";

export interface PopupItem {
    id: string;
    label: string;
    selected?: boolean;
}

export interface PopupProps {
    show?: boolean;
    onClose?: () => void;
    className?: string;
    children?: ReactNode;
    items?: PopupItem[];
    onItemSelected?: (id: string) => void;
    itemClassName?: string;
    selectedClassName?: string;
}

export const Popup: FC<PopupProps> = ({
    show,
    onClose,
    className,
    children,
    items,
    onItemSelected,
    itemClassName,
    selectedClassName
}) => {
    const popupRef = useRef<HTMLDivElement>(null);

    // Close popup when clicking outside
    useEffect(() => {
        if (!show || !onClose) return;

        const handleClickOutside = (event: Event) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, onClose]);

    const handleItemClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();
        const id = (event.target as HTMLElement).id;
        if (id && onItemSelected) {
            onItemSelected(id);
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div ref={popupRef} className={classNames(className)}>
            {items ? (
                <ul>
                    {items.map(item => (
                        <li
                            onClick={handleItemClick}
                            id={item.id}
                            key={item.id}
                            className={item.selected === true ? selectedClassName : itemClassName}>
                            {item.label}
                        </li>
                    ))}
                </ul>
            ) : (
                children
            )}
        </div>
    );
};

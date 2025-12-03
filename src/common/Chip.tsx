import type { FC, CSSProperties } from "react";
import classNames from "classnames";

export interface ChipStyle {
    stroke?: string;
    fill: string;
    text: string;
    label: string;
}

export interface ChipProps<T extends string> {
    value: T;
    styleMap: Record<T, ChipStyle>;
    className?: string;
}

export const Chip = <T extends string>({
    value,
    styleMap,
    className
}: ChipProps<T>): ReturnType<FC> => {
    const style = styleMap[value];
    if (typeof value === 'undefined') {
        return null;
    }

    const label = style.label;
    if (typeof style === 'undefined') {
        return null;
    }

    const chipStyle: CSSProperties = {
        color: style.text,
        borderColor: style.stroke ?? 'transparent',
        backgroundColor: style.fill,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '.5em',
        padding: '.2rem .75rem',
        fontWeight: 500,
        fontSize: '0.875em',
        display: 'inline-block',
    };

    return (
        <div style={chipStyle} className={classNames(className)}>
            {label}
        </div>
    );
};

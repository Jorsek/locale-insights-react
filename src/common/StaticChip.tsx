import type { FC, CSSProperties } from "react";
import classNames from "classnames";

export interface StaticChipProps {
    stroke?: string;
    fill: string;
    text: string;
    label: string;
    className?: string;
}

export const StaticChip: FC<StaticChipProps> = ({
    stroke,
    fill,
    text,
    label,
    className
}) => {
    const chipStyle: CSSProperties = {
        color: text,
        borderColor: stroke ?? 'transparent',
        backgroundColor: fill,
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

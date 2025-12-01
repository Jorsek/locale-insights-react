import type { FC, ReactNode } from "react";
import './CalloutInsight.css';
import '../../../skeleton.css'
import classNames from "classnames";

interface CalloutInsightProps {
    icon?: string;
    label: string;
    value: ReactNode,
    loading?: boolean,
    className?: string,
}

export const CalloutInsight: FC<CalloutInsightProps> = ({
    icon,
    label,
    value,
    loading,
    className,
}) => {
    const classes = classNames('callout-insight', className, {
        'skeleton-conainer': loading
    });

    return (
        <section className={classes}>
            {loading ? (
                <>
                    {typeof (icon) === 'string' &&
                        <span className="skeleton" style={{ '--w': '2.5em', '--h': '2.5em' } as React.CSSProperties} />
                    }
                    <div className='content'>
                        <p className='label skeleton' style={{ '--w': '15ch', '--h': '1.2em' } as React.CSSProperties}></p>
                        <p className='label skeleton' style={{ '--w': '10ch', '--h': '1.875em' } as React.CSSProperties}></p>
                    </div>
                </>
            ) : (
                <>
                    {typeof (icon) === 'string' &&
                        <span className="icon" >{icon}</span>
                    }
                    <div className="content">
                        <p className="label">{label}</p>
                        <p className="value">{value}</p>
                    </div>
                </>
            )}
        </section>
    )
}
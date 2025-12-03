import { useEffect, useState, type FC } from "react";
import classNames from "classnames";
import styles from './DetailsStatus.module.css';
import { useDetails } from "../detailsContext";

export interface DetailsStatusProps {
    className?: string;
}

export const DetailsStatus: FC<DetailsStatusProps> = ({
    className
}) => {
    const [showFetching, setShowFetching] = useState(false);
    const { items, page, isFetching } = useDetails();
    const containerClass = classNames(styles.container, className);

    const currentPage = page.number + 1;
    const loaded = Math.min(page.totalElements, ((page.number + 1) * page.size));

    useEffect(() => {
        if (isFetching) {
            setShowFetching(true);
            return () => setTimeout(setShowFetching, 250, false);
        }
        return () => { }
    }, [isFetching]);

    return (items && items.length !== 0) ? (
        <footer className={containerClass}>
            <div className={styles.text}>
                {`Fetched ${items.length.toLocaleString('en-us')} of ${page.totalElements.toLocaleString('en-us')} items, Page ${currentPage.toLocaleString('en-us')} of ${page.totalPages.toLocaleString('en-us')}`}
            </div>
            {showFetching &&
                <div className={styles.spinner} aria-hidden="true"></div>
            }
        </footer>
    ) : null;
};

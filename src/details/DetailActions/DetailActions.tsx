import { useState, type FC, type MouseEvent } from "react";
import { useColumns } from "../columnsContext";
import classNames from "classnames";
import detailStyles from '../details.module.css';

import { Popup } from "src/common";

export interface DetailActionsProps {
    className?: string;
}

export const DetailActions: FC<DetailActionsProps> = ({
    className,
}) => {
    const [showColumnChooser, setShowColumnChooser] = useState(false);
    let { availableColumns, addColumn } = useColumns();


    const handleAddColumnButton = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setShowColumnChooser(!showColumnChooser);
    };

    const handleAddColumn = (id: string) => {
        addColumn(id);
        setShowColumnChooser(false);
    };

    const handleDownloadCsv = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        console.log("--> handle downloading the csv here");
    };

    return (
        <div className={classNames(detailStyles.actions, className)}>
            <button
                onClick={handleDownloadCsv}
                className={detailStyles.actionDownloadCsv}
                title="Download as CSV">
                <span className={detailStyles.actionIcon}>download</span>
                Download CSV
            </button>
            <span style={{ position: 'relative' }}>
                <button
                    onClick={handleAddColumnButton}
                    disabled={availableColumns.length === 0}
                    className={detailStyles.actionAddColumn}>
                    <span className={detailStyles.actionIcon}>add</span>
                    Add Column
                </button>
                <Popup
                    show={showColumnChooser}
                    onClose={() => setShowColumnChooser(false)}
                    className={detailStyles.columnChooser}
                    items={availableColumns.map(column => ({
                        id: column.id,
                        label: column.label,
                        selected: false
                    }))}
                    onItemSelected={handleAddColumn}
                    selectedClassName={detailStyles.selected}
                />
            </span>
        </div>
    );
};

import type { FC } from "react";
import type { ResourceStatus } from "../../../types";
import classNames from "classnames";
import { config } from "../../../config";
import './ResourceStatusChip.css'

interface ResourceChipStatusProps {
    status: ResourceStatus
    className?: string,
}

export const ResourceStatusChip: FC<ResourceChipStatusProps> = ({ status, className }) => {
    const classnames = classNames({
        'resource-status-chip': true,
        'missing': status === 'MISSING',
        'out-of-data': status === 'OUTDATED',
        'current': status == 'CURRENT',
    }, className);
    return (
        <div className={classnames}>{config.resourceStatusLabels[status]}</div>
    )
}
import type { FC } from 'react';
import { Filters } from '../Filters/Filters';
import { Charts } from '../Charts/Charts';
import { Callouts } from '../Callouts/Callouts';
import { Details } from '../Details/Details';

interface DashboardProps {
    className?: string;
}

export const Dashboard: FC<DashboardProps> = () => {
    return (
        <>
            <h1>Localization Dashboard</h1>
            <p>Monitor and manage localization status across all projects</p>
            <Filters />
            <Callouts />
            <Charts />
            <Details />
        </>
    );
};

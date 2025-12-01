import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FC } from "react";
import type { ResourceItem } from "../types";


export interface Column<T extends {}> {
    id: string,
    sortBy?: string,
    name: string,
    width?: string | number,
    render(item: T): ReturnType<FC>
}

export const detailColumnSlice = createSlice({
    initialState: {
        all: [],
        columns: [],
    },
    name: 'detailColumnsSlice',
    reducers: {

    },
});

export const selectDetailColumns = createSelector(
    detailColumnSlice.selectSlice,
    state => state.columns,
);

export const selectAvailabeDetailColumns = createSelector(
    detailColumnSlice.selectSlice,
    state => []
)


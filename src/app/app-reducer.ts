import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction'

export type StatusType = "idle" | "loading" | "succeeded" | "failed" | "deleting";

const initialState: InitialStateType = {
    status: "idle",
    error: null
}

const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setGlobalErrorAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{error: string | null}>){
            state.error = action.payload.error;
        },
        setGlobalStatusAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{status: StatusType}>){
            state.status = action.payload.status;
        },
    }
})

// actions
export const appReducer = slice.reducer
export const {setGlobalErrorAC, setGlobalStatusAC} = slice.actions;

export type AppActionsType = ReturnType<typeof setGlobalErrorAC> | ReturnType<typeof setGlobalStatusAC>

export type InitialStateType = {
    status: StatusType, //происходит ли сейчас взаимодействие с сервером
    error: string | null //если ошибка какая-то глобальная произойдет - мы запишем текст ошибки сюда
}





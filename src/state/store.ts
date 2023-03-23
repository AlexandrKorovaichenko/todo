import {combineReducers, AnyAction, legacy_createStore as createStore, applyMiddleware} from "redux";
import { todolistReducer } from '../state/todolists-reducer';
import { useDispatch } from "react-redux";
import thunk, { ThunkDispatch, ThunkAction } from "redux-thunk";
import { tasksReducer } from "./tasks-reducer";
import { TodoActionsTypes } from '../state/todolists-reducer';
import { appReducer } from "../app/app-reducer";
import { authReducer } from "./auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
});

//// Login /////////

///////////////////////////////////////////////////////////////////////
//export type RootActions = TodoActionsTypes | TaskActionsTypes;
//export const store = createStore(rootReducer, applyMiddleware(thunk));

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
});


export type AppRootStateType = ReturnType<typeof store.getState>
export type AppThunkDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>

//export type AppThunkActionType = ThunkAction<void, AppRootStateType, unknown, RootActions> // any - тип всех экшенов всех редюсеров
export const AppDispatch = () => useDispatch<AppThunkDispatchType>()

// @ts-ignore
window.store = store;

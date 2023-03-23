import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { v1 } from 'uuid';
import { todolistsAPI, TodolistType } from "../api/api";
import { setGlobalStatusAC, AppActionsType, StatusType } from '../app/app-reducer';
import { handleCatchError, handleSrverAppError } from '../utils/error-utils';


export const todolistID1 = v1();
export const todolistID2 = v1();

const initialState: Array<TodoListDomainType> = [];

const slice = createSlice({
    name: "todolists",
    initialState: initialState,
    reducers: {
        removeTodolistAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{ todolistID: string }>){
            const index = state.findIndex(tl => tl.id === action.payload.todolistID)
            if(index > -1){
                state.splice(index, 1)
                state.sort((a, b) => a.title > b.title ? 1 : -1)
            }
        },
        addTodolistAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{title: string, todolistID: string}>){
            state.push({ id: action.payload.todolistID, title: action.payload.title, filter: "all", addedDate: "", order: 0, status: "idle" })
            state.sort((a, b) => a.title > b.title ? 1 : -1)
        },
        changeTitleTodolistAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{ todolistID: string, newTitle: string }>){
            const index = state.findIndex(tl => tl.id === action.payload.todolistID)
            if(index > -1){
                state[index].title = action.payload.newTitle;
                state.sort((a, b) => a.title > b.title ? 1 : -1)
            }
        },
        changeFilterTodolistAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction< {filter: "all" | "active" | "completed", todolistID: string} >){
            const index = state.findIndex(tl => tl.id === action.payload.todolistID)
            if(index > -1){
                state[index].filter = action.payload.filter;
                state.sort((a, b) => a.title > b.title ? 1 : -1)
            }
        },
        setTodoListsAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{todolists: Array<TodolistType>}>) {
            action.payload.todolists.sort((a, b) => a.title > b.title ? 1 : -1)
            return action.payload.todolists.map((element) => ({ ...element, filter: "all", status: "idle" }))
        },
        changeTodoListStatusAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{todolistID: string, status: StatusType}>){
            const index = state.findIndex(tl => tl.id === action.payload.todolistID)
            if(index > -1){
                state[index].status = action.payload.status;
                state.sort((a, b) => a.title > b.title ? 1 : -1)
            }
        },
    }
})


// actions
export const todolistReducer = slice.reducer
export const {removeTodolistAC, addTodolistAC, changeTitleTodolistAC, changeFilterTodolistAC, setTodoListsAC, changeTodoListStatusAC} = slice.actions;


// thunks
// export type AppThunkActionType = ThunkAction<void, AppRootStateType, unknown, RootActions> // any - тип всех экшенов всех редюсеров
// что ниже является этим параметром - void, AppRootStateType, unknown, RootActions
// export const setTodosTC = (): AppThunkActionType => async dispatch => {
export const setTodosTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(setGlobalStatusAC({status: "loading"}))
        todolistsAPI.getTodolists()
            .then((res) => { 
                if(res.status === 200){
                    dispatch(setTodoListsAC({ todolists: res.data } ))
                    dispatch(setGlobalStatusAC({status: "succeeded"}))
                } else{
                    handleCatchError(res.statusText, dispatch)
                }
            })
            .catch((error) => {
                handleCatchError(error.message, dispatch)
            })
    }
}


export const addTodosTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setGlobalStatusAC({status: "loading"}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if(res.data.resultCode === 0){
                    dispatch(addTodolistAC({title: res.data.data.item.title, todolistID: res.data.data.item.id} ))
                    dispatch(setGlobalStatusAC({status: "succeeded"}))
                } else {
                    handleSrverAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleCatchError(error.message, dispatch)
            })
    }
}


export const updateTitleTodosTC = (todolistID: string, newTitle: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolist(todolistID, newTitle)
            .then((res) => {
                if(res.data.resultCode === 0){
                    dispatch(changeTitleTodolistAC({ todolistID, newTitle: newTitle }));
                    dispatch(changeTodoListStatusAC({todolistID, status: "idle"} ))
                    dispatch(setGlobalStatusAC({status: "succeeded"}))
                } else {
                    handleSrverAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleCatchError(error.message, dispatch)
                dispatch(changeTodoListStatusAC({todolistID, status: "idle"}))
            })
    }
}

export const deleteTodosTC = (todolistID: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setGlobalStatusAC({status: "loading"}))
        dispatch(changeTodoListStatusAC({todolistID, status: "deleting"} ))
        setTimeout(() => {
            todolistsAPI.deleteTodolist(todolistID)
                .then((res) => {
                    if(res.data.resultCode === 0){
                        dispatch(removeTodolistAC({ todolistID }));
                        dispatch(setGlobalStatusAC({status: "succeeded"}));
                    } else {
                        handleSrverAppError(res.data, dispatch)
                    }  
                })
                .catch((error) => {
                    handleCatchError(error.message, dispatch)
                    dispatch(changeTodoListStatusAC({todolistID, status: "idle"} ))
                })
        }, 3000);
    }
}

//types
export type TodoListDomainType = TodolistType & {
    filter: "all" | "active" | "completed"
    status: StatusType
}

export type TodoActionsTypes = ReturnType<typeof changeFilterTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTitleTodolistAC>
    | ReturnType<typeof setTodoListsAC>
    | ReturnType<typeof changeTodoListStatusAC>
    | AppActionsType;

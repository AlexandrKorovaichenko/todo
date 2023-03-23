import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux'
import { authAPI, Result_code } from '../api/api'
import { setGlobalStatusAC } from '../app/app-reducer'
import { FormDataType } from '../features/Login/Login'
import { handleCatchError, handleSrverAppError } from '../utils/error-utils'

const initialState = {
    isLoggedIn: false,
    isInitialized: false
}

const slice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{value: boolean}>){
            state.isLoggedIn = action.payload.value;
        },
        setIsInitializedAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{value: boolean}>){
            state.isInitialized = action.payload.value;
        },
    }
})

// actions
export const authReducer = slice.reducer
const {setIsLoggedInAC, setIsInitializedAC} = slice.actions;

// thunks
export const loginTC = (data: FormDataType) => async (dispatch: Dispatch) => {
    dispatch(setGlobalStatusAC({status: "loading"}))
    try {
        const result = await authAPI.login(data); 
        if(result.data.resultCode === Result_code.Ok) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setGlobalStatusAC({status: "succeeded"}))
        } else {
            handleSrverAppError(result.data, dispatch)
        }
    } catch(error: any) {
        const message = error.response ? error.response.data.messages[0] : error.message;
        handleCatchError(message, dispatch)
    }
}


export const authMeTC = () => async (dispatch: Dispatch) => {
    dispatch(setGlobalStatusAC({status: "loading"}))
    try {
        const result = await authAPI.me(); 
        if(result.data.resultCode === Result_code.Ok) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setIsInitializedAC({value: true}))
            dispatch(setGlobalStatusAC({status: "succeeded"}))
        } else {
            dispatch(setIsInitializedAC({value: false}))
            handleSrverAppError(result.data, dispatch)
        }
    } catch(error: any) {
        const message = error.response ? error.response.data.messages[0] : error.message;
        handleCatchError(message, dispatch)
    }
}

export const logoutTC = () => async (dispatch: Dispatch) => {
    dispatch(setGlobalStatusAC({status: "loading"}))
    const result = await authAPI.logout();
    try{
        if(result.data.resultCode === Result_code.Ok) {
            dispatch(setIsLoggedInAC({value: false}))
            dispatch(setGlobalStatusAC({status: "succeeded"}))
        } else {
            dispatch(setIsInitializedAC({value: false}))
            handleSrverAppError(result.data, dispatch)
        }
    } catch(error: any){
        const message = error.response ? error.response.data.messages[0] : error.message;
        handleCatchError(error, dispatch)
    }   
 }
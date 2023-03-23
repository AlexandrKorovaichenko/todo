import { Dispatch } from 'redux';
import { GeneralType } from "../api/api";
import { AppActionsType, setGlobalErrorAC, setGlobalStatusAC } from "../app/app-reducer";


export const handleSrverAppError = <D>(data: GeneralType<D>, dispatch: Dispatch<AppActionsType> ) => {
    if(data.messages.length){
        dispatch(setGlobalErrorAC({error: data.messages[0]}));
    } else {
        dispatch(setGlobalErrorAC({error: "Some error occured"})); 
    }
    dispatch(setGlobalStatusAC({status: "failed"}))
}


export const handleCatchError = (message: string | null, dispatch: Dispatch<AppActionsType>) => {
    const messageText = message ? message : "Some error occured"
    dispatch(setGlobalErrorAC({error: messageText}))
    dispatch(setGlobalStatusAC({status: "failed"}))
}                    

export type ErrorCustomType = {
    messages: string[]
}

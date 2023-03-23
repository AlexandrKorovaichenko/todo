
import TextField from '@mui/material/TextField';
import React, { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent, useState } from 'react';
import { changeTodoListStatusAC } from '../../state/todolists-reducer';
import { AppDispatch } from '../../state/store'

type ElementType = "todoList" | "task"

export type EditTableSpanType = {
    title: string
    elementId: string
    type: ElementType
    changeTitle: (newTitle: string, elementId: string) => void
}

export const EditableSpan = React.memo((props: EditTableSpanType) => {    

    const dispatch = AppDispatch();

    let[editMode, setEditMode] = useState<boolean>(true);
    let[inputText, setInputText] = useState<string>(props.title);


    function setEditModeHandlerForSpan(event: MouseEvent<HTMLSpanElement> | FocusEvent<HTMLInputElement | HTMLTextAreaElement>){ 
        if(props.type === "todoList") {
            dispatch(changeTodoListStatusAC({todolistID: props.elementId, status: "loading" }))
        }
        setEditMode(!editMode); 
    }

    const onChangeElementHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setInputText(event.currentTarget.value);
    }

    const onKeyPressElementHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if(props.type === "todoList" && event.key === "Enter"){
            props.changeTitle(inputText, props.elementId); 
            setEditMode(!editMode);
        }
    }

    function setEditModeHandlerForInput(event: MouseEvent<HTMLSpanElement> | FocusEvent<HTMLInputElement | HTMLTextAreaElement>){ 
        props.changeTitle(inputText, props.elementId);
        setEditMode(!editMode);
    }

    return (
        
        editMode 
        
        ? <span onDoubleClick = {setEditModeHandlerForSpan} > 
            {inputText} 
        </span> 

        : <TextField onChange = {onChangeElementHandler} 
                     onKeyDown = { onKeyPressElementHandler } 
                     onBlur = {setEditModeHandlerForInput} 
                     value = {inputText} autoFocus
        />
    )
})

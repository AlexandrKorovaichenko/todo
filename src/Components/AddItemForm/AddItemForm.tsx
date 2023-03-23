
import ControlPoint from "@mui/icons-material/ControlPoint";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { AppDispatch } from "../../state/store";
import { addTaskTC } from "../../state/tasks-reducer";
import { addTodosTC } from "../../state/todolists-reducer";

type PropsTodoListType = {
    formType: "addTodoList" | "addTask"
    todolistID?: string
    disabled?: boolean
}


export const AddItemForm = React.memo(({disabled = false, ...props}: PropsTodoListType) => {

    const dispatch = AppDispatch();

    let[title, setTitle] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    const onChangeInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value);
    }

    const onKeyPressInputHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if(error !== false) setError(false);
        event.key === "Enter" && addToDoListOrTask();
    }

    const addToDoListOrTask = () => {
        const titleElement = title.trim();
        if(titleElement) {
                if( props.formType === "addTask" && props.todolistID ) {
                    dispatch(addTaskTC(props.todolistID, titleElement))
                    setError(false)
                } else {
                    dispatch(addTodosTC(titleElement))
                    setError(false)
                }
            } else {
                setError(true);
            }
        setTitle("");
    };


   return  (
        <div>
        <TextField type = "text" 
                value = { title }  
                variant = { "outlined" }
                error = { !!error }
                label = { "Type value" }
                helperText = { error }
                onChange = { onChangeInputHandler } 
                onKeyPress = { onKeyPressInputHandler }
                style = { !error && {} || {border: "2px solid red"} }
                disabled = {disabled}
            />

        <IconButton onClick = { addToDoListOrTask } color = { "primary" } disabled = { disabled }>
            <ControlPoint /> 
        </IconButton>

        {error && <div>Title is requred!</div>}

        </div>
    )
})



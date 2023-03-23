
import React, { useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';
import { AppDispatch, AppRootStateType } from '../../state/store';
import { setTasksTC } from '../../state/tasks-reducer';
import { changeFilterTodolistAC, deleteTodosTC, TodoListDomainType } from '../../state/todolists-reducer';
import { EditableSpan } from '../EditableSpan/EditableSpan';
import { AddItemForm } from '../AddItemForm/AddItemForm';
import { ListTasks } from '../ListTasks/ListTasks';
import { useSelector } from 'react-redux';




type filterType = "all" | "active" | "completed";

type PropsTodoListType = {
    todolist: TodoListDomainType
    changeTodolistTitle: (newTitle: string, todolistId: string) => void
    changeTaskTitle: (newTitle: string, taskId: string, todolistId: string) => void
    demo?: boolean
}


export const Todolist = React.memo(({ demo = false, ...props }: PropsTodoListType) => {

    const dispatch = AppDispatch();

    useEffect(() => {
        if(demo) return;
        dispatch(setTasksTC(props.todolist.id)) 
    }, [])


    const removeToDoList = useCallback(() => {
        dispatch(deleteTodosTC(props.todolist.id));
    }, [props.todolist.id, dispatch])


    const changeFilter = useCallback((filter: filterType) => {
        dispatch(changeFilterTodolistAC({filter: filter, todolistID: props.todolist.id} ));
    }, [dispatch, props.todolist.id]);


    const changeTodolistTitle = useCallback((newTitle: string) => {
        props.changeTodolistTitle(newTitle, props.todolist.id);
    }, [props.todolist.id, props.changeTodolistTitle])

    return( 
            
        <div>
            
            {/* Блок с названием ТудуЛиста и кнопокой для его удаления*/}
            <h3> 
                <EditableSpan title = {props.todolist.title} 
                              elementId = {props.todolist.id} 
                              changeTitle = {changeTodolistTitle}
                              type = {"todoList"} 
                /> 

                <IconButton onClick = {removeToDoList} disabled = { props.todolist.status === "loading"} > 
                     <Delete /> 
                </IconButton>

            </h3>


            {/* Блок с полем для для добавления Новой таски */}
            <AddItemForm formType = {"addTask"} 
                         todolistID = {props.todolist.id }  
                         disabled = {props.todolist.status === "deleting"}
            />


            {/* Блок со списком тасок*/}
            <ListTasks todolistId = {props.todolist.id } 
                       filter = { props.todolist.filter }
                       changeTaskTitle = {props.changeTaskTitle}
                       disabled = { props.todolist.status === "deleting"}
            />

            <div>

                <ButtonMemo buttonName = { "All" }
                            todolistId = { props.todolist.id }
                            variant = { props.todolist.filter === "all" ? "contained" : "text" } 
                            changeFilter = { () => changeFilter("all") }
                    />
                                            
                <ButtonMemo buttonName = { "Active" }
                            todolistId = { props.todolist.id }
                            variant = {props.todolist.filter === "active" ? "contained" : "text"} 
                            changeFilter = { () => changeFilter("active") }
                    />

                <ButtonMemo buttonName = { "Completed" }
                            todolistId = { props.todolist.id }
                            variant = {props.todolist.filter === "completed" ? "contained" : "text"} 
                            changeFilter = { () => changeFilter("completed") }   
                    />

            </div>

        </div>
    );
});


type PropsButtonMemoType = {
    todolistId: string
    buttonName: string
    variant: "contained" | "text"
    changeFilter: () => void
}


const ButtonMemo = React.memo((props: PropsButtonMemoType) => {
    return(
        <Button variant = { props.variant } 
                onClick = {props.changeFilter}>
            {props.buttonName}
        </Button>
    )
})
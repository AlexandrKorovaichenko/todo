import React, { ChangeEvent, useCallback, useMemo } from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';
import { AppDispatch, AppRootStateType } from '../../state/store';
import { deleteTaskTC, upadteTaskTC } from '../../state/tasks-reducer';
import { useSelector } from 'react-redux';
import { TaskStatuses, TaskType } from '../../api/api';
import { EditableSpan } from '../EditableSpan/EditableSpan';


type PropsTasksListType = {
    todolistId: string
    filter: string
    changeTaskTitle: (newTitle: string, taskId: string, todolistId: string) => void
    disabled: boolean
}

export const ListTasks = React.memo(({ disabled = false, ...props}: PropsTasksListType) => { // начало
        
        const dispatch = AppDispatch();

        // Каждый раз создается новый массив !!!
        const tasks = useSelector<AppRootStateType, Array<TaskType>>(
            state => state.tasks[props.todolistId]
        ); 

        const tasksForRender = useMemo(() => {
                            //console.log(tasks)
                            return tasks?.filter(
                            element => {
                                if (props.filter === "active") return element.status === TaskStatuses.New
                                if (props.filter === "completed") return element.status === TaskStatuses.Completed
                                return true; 
            })
        }, [props.filter, tasks]);

        //Task
        const removeTask = (todolistId: string, taskID: string) => {
            dispatch(deleteTaskTC(todolistId, taskID))
        };   

        const changeTaskStatus = (taskId: string, checked: boolean) => {
            let status = checked === true ? TaskStatuses.Completed : TaskStatuses.New;
            dispatch(upadteTaskTC(props.todolistId, taskId, {status: status}));
        }

        const changeTaskTitle = useCallback((newTitle: string, taskId: string) => { 
            props.changeTaskTitle(newTitle, taskId, props.todolistId)
        }, [props.changeTaskTitle, props.todolistId])

        return (

            <div>


                <ul>
                    { // начало

                        tasksForRender?.map(
                            
                            (element) => {

                                return ( 
                                        <li key = {element.id }>

                                        <Checkbox
                                            defaultChecked = { element.status === TaskStatuses.New ? false : true }
                                            onChange = { (event: ChangeEvent<HTMLInputElement>) => changeTaskStatus(element.id, event.currentTarget.checked) } 
                                            disabled = { disabled }
                                        /> 

                                        <EditableSpan title = {element.title} 
                                                      elementId = {element.id} 
                                                      changeTitle = {changeTaskTitle} 
                                                      type = {"task"}
                                        />

                                        <IconButton onClick = { () => removeTask(props.todolistId, element.id) } disabled = { disabled } > 
                                            <Delete />
                                        </IconButton>

                                        </li>
                                    )                                

                            }
                    
                        ) //: <span>List is Empty!</span> 

                    } 
                
                </ul>


            </div>
            

    )

})//конец




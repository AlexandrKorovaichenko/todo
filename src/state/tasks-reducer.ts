import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { Dispatch } from 'redux';
import { v1 } from 'uuid';
import { todolistsAPI, TaskType, ModelTaskType, TaskStatuses, TaskPriorities, TodolistType, } from '../api/api';
import { setGlobalStatusAC, AppActionsType } from '../app/app-reducer';
import { AppRootStateType } from '../state/store';
import { addTodolistAC, changeTodoListStatusAC, removeTodolistAC, setTodoListsAC, todolistID1, todolistID2 } from '../state/todolists-reducer';
import { ErrorCustomType, handleCatchError, handleSrverAppError } from '../utils/error-utils';
//import { UpdateTask } from '../Components/todolists-api.stories';

export const initialState: TasksDomainType = {}

const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {  

        setTasksAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{ tasks: Array<TaskType>, todolistID: string }>){
            state[action.payload.todolistID] = action.payload.tasks;
        },

        removeTaskAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{ todolistID: string, taskID: string }>){
            const index = state[action.payload.todolistID].findIndex(tl => tl.id === action.payload.taskID)
            if(index > -1){
                state[action.payload.todolistID].splice(index, 1)
            }
        },

        addTasksInTodoListAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{ task: TaskType }>){
            state[action.payload.task.todoListId].unshift(action.payload.task);
        },

        upadteTaskAC(state /*работает с копией(или черновиком) стейта*/, action: PayloadAction<{ todolistID: string, taskID: string, model: ModelTaskType }>){
            const tasks = state[action.payload.todolistID];
            const index = state[action.payload.todolistID].findIndex(tl => tl.id === action.payload.taskID)    
            if(index > -1){
                tasks[index] = {...tasks[index], ...action.payload.model};
            }
        },

      },

      extraReducers: (builder) => {

        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolistID] = [] 
        })

        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistID]
        })

        builder.addCase(setTodoListsAC, (state, action) => {
            action.payload.todolists.forEach((element: any) => {
                        state[element.id] = [];
                    })
        })
    }
})

//actions
export const tasksReducer = slice.reducer
export const { removeTaskAC, upadteTaskAC, addTasksInTodoListAC, setTasksAC } = slice.actions;

//actions
// export const removeTaskAC = (todolistID: string, taskID: string) => ({ type: "REMOVE-TASK", taskID, todolistID } as const)
// export const upadteTaskAC = (todolistID: string, taskID: string, model: ModelTaskType) => ({ type: "UPDATE-TASK", taskID, todolistID, model } as const)
// export const addTasksInTodoListAC = (task: TaskType) => ({ type: "ADD-TASK-TODOLIST", task } as const)
// export const removeTodoListTasksAC = (todolistID: string) => ({ type: "REMOVE-TODOLIST", todolistID } as const)
// export const setTasksAC = (tasks: Array<TaskType>, todolistID: string) => ({ type: "SET-TASKS", tasks, todolistID } as const)


//thunks
export const setTasksTC = (todolistID: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setGlobalStatusAC({status: "loading"}));    // выводим полоску загрузки в самом верху
        todolistsAPI.getTasks(todolistID)
            .then((res) => {
                if(res.status === 200){
                    dispatch(setTasksAC({ tasks: res.data.items, todolistID: todolistID } ));
                    dispatch(setGlobalStatusAC({status: "succeeded"}));    
                } else {
                    handleCatchError(res.data.error, dispatch)
                }
            })
            .catch((error) => {
                handleCatchError(error.message, dispatch)
            })
        }
    }


export const deleteTaskTC = (todolistID: string, taskID: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setGlobalStatusAC({status: "loading"}))     // выводим полоску загрузки в самом верху
        todolistsAPI.deleteTask(todolistID, taskID)
            .then(res => {
                if(res.data.resultCode === 0){
                    dispatch(removeTaskAC( { todolistID: todolistID, taskID: taskID } ));
                    dispatch(setGlobalStatusAC({status: "succeeded"}))
                } else {
                    handleSrverAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleCatchError(error.message, dispatch)
            });
    }
}


export const addTaskTC = (todolistID: string, taskTitle: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setGlobalStatusAC({status: "loading"}))     // выводим полоску загрузки в самом верху
        todolistsAPI.createTask(todolistID, taskTitle)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTasksInTodoListAC( { task: res.data.data.item } ));
                    dispatch(setGlobalStatusAC({status: "succeeded"}));
                } else {
                    handleSrverAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleCatchError(error.message, dispatch);
            })
            
    }
}


export const upadteTaskTC = (todolistID: string, taskID: string, model: ModelTaskType) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(setGlobalStatusAC({status: "loading"}));
        const task = getState().tasks[todolistID].find(element => element.id === taskID);
        if (!task) {
            dispatch(setGlobalStatusAC({status: "succeeded"}))
            throw new Error("task not found in the state");
        }

        const modelTask: ModelTaskType = { 
            title: task.title,
            description: "",
            completed: task.completed,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...model  
        }

        todolistsAPI.updateTask(todolistID, taskID, modelTask)
            .then(res => {
                if(res.data.resultCode === 0){
                    dispatch(upadteTaskAC( {todolistID: todolistID, taskID: taskID, model: modelTask } ));
                    dispatch(setGlobalStatusAC({status: "succeeded"}))
                } else {
                    handleSrverAppError(res.data, dispatch)
                }
            })
            .catch((error: AxiosError<ErrorCustomType>) => {
                const message = error.response ? error.response.data.messages[0] : error.message;
                handleCatchError(message, dispatch)
            })

    }
}

export type TasksDomainType = { [key: string]: Array<TaskType> };

// export type TaskActionsTypes = ReturnType<typeof removeTodolistAC>
//     | ReturnType<typeof upadteTaskAC>
//     | ReturnType<typeof addTasksInTodoListAC>
//     | ReturnType<typeof removeTaskAC>
//     | ReturnType<typeof setTasksAC>
//     | ReturnType<typeof setTodoListsAC>
//     | ReturnType<typeof addTodolistAC>
//     | ReturnType<typeof changeTodoListStatusAC>
//     | AppActionsType;


export const initialStateForStories = {

    [todolistID1]: [{ id: v1(), title: "HTML&CSS", description: "", completed: true, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: todolistID1, order: 0, addedDate: "" },
    { id: v1(), title: "JS", description: "", completed: true, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: todolistID1, order: 0, addedDate: "" },
    { id: v1(), title: "ReactJS", description: "", completed: true, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: todolistID1, order: 0, addedDate: "" }],
    
    [todolistID2]: [{ id: v1(), title: "Book", description: "", completed: true, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: todolistID2, order: 0, addedDate: "" },
    { id: v1(), title: "Apple", description: "", completed: true, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: todolistID2, order: 0, addedDate: "" },
    { id: v1(), title: "Bread", description: "", completed: true, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: todolistID2, order: 0, addedDate: "" }]
    
};
import axios, { AxiosResponse } from "axios"
import { FormDataType } from "../features/Login/Login"

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "122269e0-74ed-428e-a29c-7af2ba9c2dd2"
    }
})

export const authAPI = {
    
    me(){
        return instance.get<GeneralType<AuthMeResponseType>>("/auth/me")
    },

    login(data: FormDataType) {
        return instance.post<GeneralType<UserLoginType>>("/auth/login", data)
    },

    logout(){
        return instance.delete<GeneralType<UserLoginType>>("/auth/login")
    }

 }


export const todolistsAPI = {

    getTodolists() {
        return instance.get<TodolistsGetType>("todo-lists/")
    },

    createTodolist(title: string) {
        return instance.post<GeneralType<TodolistItemType>>("todo-lists/", { title: title })
    },

    updateTodolist(todolistID: string, title: string) {
        return instance.put<GeneralType>("todo-lists/" + todolistID, { title: title })
    },

    deleteTodolist(todolistID: string) {
        return instance.delete<TodolistsDeleteType>("todo-lists/" + todolistID)
    },


    /////////////////////////////

    
    getTasks(todolistID: string) {
        return instance.get<TaskGetType>(`todo-lists/${todolistID}/tasks`)
    },

    createTask(todolistID: string, title: string) {
        return instance.post<TaskPostType>(`todo-lists/${todolistID}/tasks`, { title: title })
    },

    updateTask(todolistID: string, taskID: string, properties: ModelTaskType) {
        return instance.put<GeneralType<TaskItemType>>(`todo-lists/${todolistID}/tasks/${taskID}`, properties )
    },

    deleteTask(todolistID: string, taskID: string) {
        return instance.delete<GeneralType>(`todo-lists/${todolistID}/tasks/${taskID}`)
    }

}

//types Auth Login
export type UserLoginType = {
    userId: string
}

export type AuthMeResponseType = {
    id: number
    email: string
    login: string
}

export enum Result_code {
    Ok = 0,
    Error = 1,
    Captcha = 0,
}

//types todolists
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type TodolistItemType = {
    item: TodolistType
}

export type TaskItemType = {
    item: TaskType
}

export type GeneralType<D = {}> = {
    data: D
    messages: Array<string>
    resultCode: number
}

export type TaskGetType = {
    items: Array<TaskType>
    totalCount: number
    error: string | null
}

export type TaskPostType = {
    data: TaskItemType
    resultCode: number
    messages: Array<string>
}

export type TodolistsGetType = Array<TodolistType>

export type TodolistsDeleteType = {
    data: {}
    resultCode: number
    messages: Array<string>
    fieldsError: Array<string>
}

//types tasks
export type ModelTaskType = {
    title?: string
    description?: string
    completed?: boolean
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middele = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
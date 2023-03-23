import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, legacy_createStore as createStore } from "redux";
import thunk from 'redux-thunk';
import { v1 } from 'uuid';
import { TaskPriorities, TaskStatuses } from '../api/api';
import { AppRootStateType, rootReducer } from './store';
import { todolistID1, todolistID2 } from './todolists-reducer';

const initialGlobalState = {

    todolists: [
        {id: todolistID1,  title: "HTML&CSS",  filter: "all", addedDate: "", order: 0, status: 'idle'},
        {id: todolistID2,  title: "JS",        filter: "all", addedDate: "", order: 0, status: 'loading'},
    ],

    tasks: {

        [todolistID1] : [{id: v1(),  title: "HTML&CSS", description: "", completed: true, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: todolistID1, order: 0, addedDate: ""},
                        {id: v1(),  title: "JS",       description: "", completed: true, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: todolistID1, order: 0, addedDate: ""},
                        {id: v1(),  title: "ReactJS",  description: "", completed: true, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: todolistID1, order: 0, addedDate: ""}],
   
        [todolistID2] : [{id: v1(),  title: "Book",  description: "", completed: true, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: todolistID2, order: 0, addedDate: ""},
                        {id: v1(),  title: "Apple", description: "", completed: true, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: todolistID2, order: 0, addedDate: ""},
                        {id: v1(),  title: "Bread", description: "", completed: true, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: todolistID2, order: 0, addedDate: ""}]

    },

    app: {
        error: null,
        status: "idle"
    }

}

export const storyBokStore = createStore(rootReducer, initialGlobalState as AppRootStateType, applyMiddleware(thunk));


export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBokStore}>
        {storyFn()}
    </Provider>
}
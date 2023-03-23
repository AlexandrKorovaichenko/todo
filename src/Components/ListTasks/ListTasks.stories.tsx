import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../state/store';
import { action } from "@storybook/addon-actions";
import { ListTasks } from './ListTasks';
import { todolistID1 } from '../../state/todolists-reducer';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import { EditableSpan } from '../EditableSpan/EditableSpan';
import { initialStateForStories } from '../../state/tasks-reducer';
import { TaskStatuses } from '../../api/api';

export default {
    title: "ListTasks Component",
    component: ListTasks
}

const callback = action("Component tested")

export const ListTasksBaseExample = () => {

    const tasks = initialStateForStories[todolistID1]

    return <Provider store = {store} >
                <>

                <ListTasks todolistId = { todolistID1 } 
                        changeTaskTitle = {callback}
                        filter = { "all" }
                        disabled = { false } />

                <Checkbox
                    defaultChecked = { tasks[0].status === TaskStatuses .New ? false : true }
                    onChange = { callback } />

                <EditableSpan title = {tasks[0].title} elementId = {tasks[0].id} changeTitle = {callback} type = {"task"}/>

                <IconButton onClick = { callback } > 
                    <Delete />
                </IconButton>

                </>
    </Provider>

}
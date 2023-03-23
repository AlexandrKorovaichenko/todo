import React from 'react';
import { AddItemForm } from "./AddItemForm";
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReduxStoreProviderDecorator } from '../../state/ReduxStoreProviderDecorator';

export default {
    title: "TODOLIST/AddItemForm",
    component: AddItemForm,
    decorators: [ReduxStoreProviderDecorator],
} //as ComponentMeta<typeof AddItemForm>
// const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm { ...args }/>
// export const AddItemFormStory = Template.bind({});

export const AddItemFormStory = (props: any) => {
    return (
        <AddItemForm formType = {"addTodoList"} />
    ) 
}

export const AddItemFormStoryDisabled = (props: any) => {
    return (
        <AddItemForm formType = {"addTodoList"} disabled = {true} />
    ) 
}
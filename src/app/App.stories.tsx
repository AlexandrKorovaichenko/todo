import React from 'react';
import { App } from './App';
import { ReduxStoreProviderDecorator } from "../state/ReduxStoreProviderDecorator"
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
    title: "AppWithRedux Component",
    component: App,
    decorators: [ReduxStoreProviderDecorator]
} //as ComponentMeta<typeof App>
//const Template: ComponentStory<typeof App> = () => <App demo = {true} />
//export const AddBaseExample = Template.bind({})
export const AddBaseExample = () => { return <App demo = {true}/> }
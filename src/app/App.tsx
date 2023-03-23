import React, { useCallback, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { AppDispatch, AppRootStateType } from '../state/store';
import { upadteTaskTC } from '../state/tasks-reducer';
import { setTodosTC, TodoListDomainType, updateTitleTodosTC } from '../state/todolists-reducer';
import { AddItemForm } from '../Components/AddItemForm/AddItemForm';
import { Todolist } from '../Components/Todolist/Todolist';
import { Snackbars } from '../Components/ErrorSnackBar/ErrorSnackBar';
import { Login } from '../features/Login/Login';
import { authMeTC, logoutTC } from '../state/auth-reducer';
import { CircularProgress } from '@mui/material';
//import './App.css';

type AppPropsType = {
    demo?: boolean
}

export const App = React.memo(({ demo = false, ...props }: AppPropsType) => {

    const dispatch = AppDispatch();
    const status = useSelector<AppRootStateType, string | null>(state => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.auth.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    useEffect(() => {
        dispatch(authMeTC())
    }, [])

    if (!isInitialized) {
        return <div  
            style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
            <CircularProgress />
        </div>
    }

    const logOutHandler = () => {
        dispatch(logoutTC() )
    }

    return (

        <div className="App">

            <Snackbars />

            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>

                    { isLoggedIn && <Button onClick={logOutHandler} color="inherit">LogOut</Button> } 

                </Toolbar>
            </AppBar>

            {status === "loading" && <LinearProgress />}

            <Routes>
                <Route path = {'/'} element={<TodolistList demo={demo} />} />
                <Route path = {'login'} element={<Login />} />
                <Route path = {'404'} element={<h1 style={{ textAlign: 'center' }}>404: PAGE NOT FOUND</h1>} />
                <Route path = '*' element={<Navigate to='404' />} />
            </Routes>



        </div>
    )

})

type TodolistListPropsType = {
    demo?: boolean
}

export const TodolistList = ({ demo = false, ...props }: TodolistListPropsType) => {

    const dispatch = AppDispatch();
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const status = useSelector<AppRootStateType, string | null>(state => state.app.status)

    useEffect(() => {
        if (demo || !isLoggedIn) return;
        if (isLoggedIn) {
            dispatch(setTodosTC())
        }
    }, [])

    //изменяем заголовок Тудулиста
    const changeTodolistTitle = useCallback((newTitle: string, todolistId: string) => {
        dispatch(updateTitleTodosTC(todolistId, newTitle));
    }, [dispatch])

    //изменяем заголовок Таски
    const changeTaskTitle = useCallback((newTitle: string, taskId: string, todolistId: string) => {
        dispatch(upadteTaskTC(todolistId, taskId, { title: newTitle }));
    }, [dispatch])

    const todolists = useSelector<AppRootStateType, Array<TodoListDomainType>>(
        state => state.todolists
    );


    { if (!isLoggedIn) { return <Navigate to={'/Login'} /> } }

    return (

        <Container fixed>

            <Grid container spacing={3} style={{ marginTop: "50px" }}>

                <Grid container>
                    <AddItemForm formType={"addTodoList"} disabled={status === "loading"} />
                </Grid>

                {todolists.map((element: TodoListDomainType) => {
                    return <Grid style={{ marginRight: "20px", marginTop: "20px" }}>
                        <Paper style={{ padding: "10px" }}>
                            <Todolist key={element.id}
                                changeTodolistTitle={changeTodolistTitle}
                                changeTaskTitle={changeTaskTitle}
                                demo={demo}
                                todolist={element}
                            />
                        </Paper>
                    </Grid>
                })
                }

            </Grid>

        </Container>


    )

}
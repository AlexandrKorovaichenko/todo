
import React, {useEffect, useState} from 'react'
import {todolistsAPI} from '../../api/api'


export default {
   title: 'API Todolist'
}

export const GetTodolists = () => {
   const [state, setState] = useState<any>(null)
   useEffect(() => {
      todolistsAPI.getTodolists()
      .then((res) => {
         setState(res.data)
      })

   }, [])
   return <div>{JSON.stringify(state)}</div>
}


// export const CreateTodolist = () => {
//    const [state, setState] = useState<any>(null)
//    useEffect(() => {
//       todolistsAPI.createTodolist("newTodolist")
//       .then((res) => {
//          setState(res.data)
//       })
//    }, [])

//    return <div>{JSON.stringify(state)}</div>
// }


// export const DeleteTodolist = () => {
//    const [state, setState] = useState<any>(null)
//    useEffect(() => {
//       todolistsAPI.deleteTodolist("36e513e0-f570-4edb-b85f-a507107c2031")
//       .then((res) => {
//          console.log(res)
//          setState(res.data)
//       })
//    }, [])

//    return <div>{JSON.stringify(state)}</div>
// }


// export const UpdateTodolistTitle = () => {
//    const [state, setState] = useState<any>(null)
//    useEffect(() => {
//       todolistsAPI.updateTodolist("36e513e0-f570-4edb-b85f-a507107c2031", "NewTitle123")
//       .then((res) => {
//          console.log(res);
//          setState(res.data)
//       })
//    }, [])
//    return <div>{JSON.stringify(state)}</div>
// }


// export const GetTasks = () => {
//    const [state, setState] = useState<any>(null)
//    useEffect(() => {
//       todolistsAPI.getTasks("36e513e0-f570-4edb-b85f-a507107c2031")
//       .then((res) => {
//          setState(res.data)
//       })
//    }, [])
//    return <div>{JSON.stringify(state)}</div>
// }


// export const CreateTask = () => {
//    const [state, setState] = useState<any>(null)
//    useEffect(() => {
//       todolistsAPI.createTask("36e513e0-f570-4edb-b85f-a507107c2031", "newTask")
//       .then((res) => {
//          setState(res.data)
//       })
//    }, [])
//    return <div>{JSON.stringify(state)}</div>
// }


// export const UpdateTask = () => {
//    const [state, setState] = useState<any>(null)
//    useEffect(() => {
//       todolistsAPI.updateTask("36e513e0-f570-4edb-b85f-a507107c2031", "93060896-f3c2-45db-97db-eb211656d94c", {
//          "title": "NewTitileTask",
//          "description": "",
//          "completed": true,
//          "status": 0,
//          "priority": 1,
//          "startDate": "",
//          "deadline": "2023-01-21T07:41:23.307"
//       })
//       .then((res) => {
//          setState(res.data)
//       })
//    }, [])
//    return <div>{JSON.stringify(state)}</div>
// }


// export const DeleteTask = () => {
//    const [state, setState] = useState<any>(null)
//    const [taskId, setTaskId] = useState<any>(null)
//    const [todolistId, setTodolistId] = useState<any>(null)
//    //useEffect(() => {}, [])
   
//    const deleteTask = () => {
//       todolistsAPI.deleteTask(todolistId, taskId)
//       .then((res) => {
//          setState(res.data)
//       })
//    }

//    return <div>{JSON.stringify(state)}
//       <div>
//          <input placeholder={'todolistId'} value = {todolistId} onChange = {(e) => {setTodolistId(e.currentTarget.value)}}/>
//          <input placeholder={'taskId'} value = {taskId} onChange = {(e) => {setTaskId(e.currentTarget.value)}}/>
//          <button onClick={deleteTask}>delete task</button>
//       </div>
//    </div>
// }

import { v1 } from 'uuid';
import { StatusType } from '../app/app-reducer';
import {removeTodolistAC, addTodolistAC, todolistReducer, changeTitleTodolistAC, TodoListDomainType, setTodoListsAC, changeTodoListStatusAC} from "../state/todolists-reducer"

let todolistID1: string;
let todolistID2: string;
let oldState: Array<TodoListDomainType> = [];

beforeEach(() => {

    todolistID1 = v1();
    todolistID2 = v1();

    oldState = [
        {id: todolistID1,  title: "HTML&CSS",  filter: "all", addedDate: "", order: 0, status: "idle" },
        {id: todolistID2,  title: "JS",        filter: "active", addedDate: "", order: 0, status: "idle" },
    ]

})


// removeTodolistAC
test("Test remove todoList", () => {
    const action = removeTodolistAC({ todolistID: todolistID1 } );
    const newState = todolistReducer( oldState, action)
    expect(newState.length).toBe(1);
    expect(newState.length).not.toBe(oldState.length);
    expect(newState[0].id).toBe(todolistID2);
})


// addTodolistAC
test("Test add Todolist", () => {
    const action = addTodolistAC({title: "CSS", todolistID: todolistID1} );
    const newState = todolistReducer( oldState, action )
    const keys = Object.keys(newState);
    const newKey = keys.find(k => k != todolistID1 && k != todolistID2);
    if(!newKey){ throw Error("new key should be added"); }
    expect(newState.length).toBe(3);
    expect(newState.length).not.toBe(oldState.length);
    expect(newState[2].title).toBe("CSS");
})


// upadteTitleTodolistAC
test("Test update title Todolist", () => {
    const action = changeTitleTodolistAC({ todolistID: todolistID2, newTitle: "React" } )
    const newState = todolistReducer( oldState, action )
    expect(newState.length).toBe(2);
    expect(newState[1].title).toBe("React"); 
})


// setTodoListsAC
test("Test add todolists", () => {
    const action = setTodoListsAC({todolists: oldState } );
    const newState = todolistReducer([], action );
    expect(newState.length).toBe(2);
    expect(newState[1].filter).toBe("all");
    expect(newState[1].title).toBe("JS"); 
})


// changeTodoListStatusAC
test("Test change status todolist", () => {
    let newStatus: StatusType = "loading";
    const action = changeTodoListStatusAC({todolistID: todolistID1, status: newStatus} );
    const newState = todolistReducer( oldState, action );
    expect(newState[0].status).toBe("loading");
})


// changeTodolistFilterAC
test("todolists should be set to the state", () => {})
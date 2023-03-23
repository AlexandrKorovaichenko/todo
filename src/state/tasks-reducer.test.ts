import { removeTaskAC, addTasksInTodoListAC, tasksReducer, TasksDomainType, setTasksAC, upadteTaskAC } from "../state/tasks-reducer";
import { removeTodolistAC } from "../state/todolists-reducer";
import { v1 } from 'uuid';
import { ModelTaskType, TaskPriorities, TaskStatuses } from "../api/api";

let todolistID1_task1: string, todolistID1_task2: string, todolistID1_task3: string, todolistID1_taskTest4: string;
let todolistID2_task1: string, todolistID2_task2: string, todolistID2_task3: string;

let startState: TasksDomainType;


beforeEach(() => {

    todolistID1_task1 = v1(); todolistID1_task2 = v1(); todolistID1_task3 = v1(); todolistID1_taskTest4 = v1();
    todolistID2_task1 = v1(); todolistID2_task2 = v1(); todolistID2_task3 = v1();

    startState = {

        "todolistID1": [{ id: todolistID1_task1, title: "HTML&CSS", description: "", completed: false, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: "todolistID1", order: 0, addedDate: "" },
        { id: todolistID1_task2, title: "JS", description: "", completed: false, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: "todolistID1", order: 0, addedDate: "" },
        { id: todolistID1_task3, title: "ReactJS", description: "", completed: false, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: "todolistID1", order: 0, addedDate: "" }],

        "todolistID2": [{ id: todolistID2_task1, title: "Book", description: "", completed: false, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: "todolistID2", order: 0, addedDate: "" },
        { id: todolistID2_task2, title: "Apple", description: "", completed: false, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: "todolistID2", order: 0, addedDate: "" },
        { id: todolistID2_task3, title: "Bread", description: "", completed: false, status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: "", deadline: "", todoListId: "todolistID2", order: 0, addedDate: "" }]

    };

})

//addTasksInTodoListAC
test("Test Add Task", () => {

    const action = addTasksInTodoListAC(
            { task: {
                description: "",
                title: "Test task add",
                completed: false,
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                id: todolistID1_taskTest4,
                todoListId: "todolistID1",
                order: 0,
                addedDate: ""
            } }
        );

    const endState = tasksReducer(startState, action);
    expect(endState["todolistID1"].length).toBe(4);
    expect(endState["todolistID1"][3].id).toBeDefined();
    expect(endState["todolistID1"][3].title).toBe("Test task add");
    expect(endState["todolistID1"][3].status).toBe(TaskStatuses.New);
    expect(endState["todolistID1"][3].priority).toBe(TaskPriorities.Low);

});

// removeTaskAC
test("Test Delete Tasks", () => {
    const action = removeTaskAC( { todolistID: "todolistID1", taskID: todolistID1_taskTest4 } );
    const endState = tasksReducer(startState, action);
    expect(endState["todolistID1"].length).toBe(3);
})

// removeTaskAC - Несуществующей таски, удалил выше
test("Test Delete Task", () => {
    const action = removeTaskAC({ todolistID: "todolistID1", taskID: todolistID1_taskTest4 });
    const endState = tasksReducer(startState, action);
    expect(endState["todolistID1"].length).toBe(3);
    expect(endState["todolistID1"].every(task => task.id != "todolistID1_taskTest4")).toBeTruthy();
});


//upadteTaskAC
test("Test Change Task", () => {
    const modelTask: ModelTaskType = {
        title: "New Title Task 3",
        description: "",
        completed: true,
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: ""
    }

    const action = upadteTaskAC({ todolistID: "todolistID2", taskID: todolistID2_task3, model: modelTask });
    const endState = tasksReducer(startState, action);
    expect(endState["todolistID2"][2].completed).toBe(true);
    expect(endState["todolistID2"][2].completed).toBeTruthy(); // тоже самое что и первая строка
    expect(endState["todolistID2"][2].status).toBe(TaskStatuses.New);
    expect(endState["todolistID2"][2].id).toBeDefined();

});

// setTasksAC
test("tasks add for todolist", () => {
    const action = setTasksAC({
        tasks: [{
            id: todolistID2_task1,
            title: "Book",
            description: "",
            completed: false,
            status: TaskStatuses.New,
            priority: TaskPriorities.Low,
            startDate: "", deadline: "",
            todoListId: "todolistID2",
            order: 0,
            addedDate: ""
        }], todolistID: "todolistID1"
    });

    const endState = tasksReducer(startState, action);
    expect(endState['todolistID1'].length).toBe(1);
})

// removeTodoListTasksAC
test("empty arrays be added when we set", () => {
    const action = removeTodolistAC({todolistID: "todolistID1"});
    const endState = tasksReducer(startState, action);
    const keys = Object.keys(endState);
    expect(keys.length).toBe(1);

    expect(keys[0]).toBe("todolistID2");
})
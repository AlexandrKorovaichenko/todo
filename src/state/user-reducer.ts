

export const userReducer = (state: StateType, action: ActionType):StateType => {
    
    switch(action.type){
        
        case "INCREMENT-AGE":
            state.age = state.age + 1;
            return state;

        case "INCREMENT-CHILDREN":
            return{...state, 
                    childrenCount: state.childrenCount + 1
                }

        case "CHANGE-NAME":
            return{...state, 
                    name: action.newName
                }
                
        default: 
            throw new Error("I don't understand this action type") 

    }

}

type StateType = {
    age: number
    childrenCount: number
    name: string
}

type ActionType = {
    type: string
    newName: string
    //[key: string]: any // Что за запись???
}
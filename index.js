// utils
function generateId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  );
}

// own middleware
const bitcoinChecker = store => next => action => {
  if (
    (action.type === ADD_TODO &&
      action.todo.name.toLowerCase().includes('bitcoin')) ||
    (action.type === ADD_GOAL &&
      action.goal.name.toLowerCase().includes('bitcoin'))
  ) {
    return alert(`Nope! That's a bad idea!`);
  }

  return next(action);
};

const loggerMiddleware = store => next => action => {
  console.group(action.type);
  console.log('Action: ');
  console.log(action);
  next(action);
  console.log('New state: ');
  console.log(store.getState());
  console.groupEnd();
};

// APP STATE
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';
const RECEIVE_DATA = 'RECEIVE_DATA';

const receiveData = (todos, goals) => ({
  type: RECEIVE_DATA,
  todos,
  goals
});

const addTodo = todo => ({
  type: ADD_TODO,
  todo
});

const removeTodo = id => ({
  type: REMOVE_TODO,
  id
});

const toggleTodo = id => ({
  type: TOGGLE_TODO,
  id
});

const addGoal = goal => ({
  type: ADD_GOAL,
  goal
});

const removeGoal = id => ({
  type: REMOVE_GOAL,
  id
});

const todosReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id !== action.id ? todo : { ...todo, completed: !todo.completed }
      );
    case RECEIVE_DATA:
      return action.todos;
    default:
      return state;
  }
};

const goalsReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter(goal => goal.id !== action.id);
    case RECEIVE_DATA:
      return action.goals;
    default:
      return state;
  }
};

const rootReducer = Redux.combineReducers({
  todos: todosReducer,
  goals: goalsReducer
});

const store = Redux.createStore(
  rootReducer,
  Redux.applyMiddleware(bitcoinChecker, loggerMiddleware)
);

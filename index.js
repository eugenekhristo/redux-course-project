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

// const thunkify = store => next => action => {
//   if (typeof action === 'function') return action(store.dispatch);
//   return next(action);
// };

// APP STATE
const RECEIVE_DATA = 'RECEIVE_DATA';
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

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

// API ACTION GENERATORS

const handleReceiveDataAPI = () => {
  return dispatch => {
    Promise.all([API.fetchTodos(), API.fetchGoals()]).then(([todos, goals]) => {
      dispatch(receiveData(todos, goals));
    });
  };
};

const handleDeleteTodo = todo => {
  return dispatch => {
    dispatch(removeTodo(todo.id));
    return API.deleteTodo(todo.id).catch(() => {
      dispatch(addTodo(todo));
      alert('Some error occurred on the back-end! Try again!');
    });
  };
};

const handleAddTodo = (name, callback) => {
  return dispatch => {
    API.saveTodo(name)
      .then(todo => {
        dispatch(addTodo(todo));
        callback();
      })
      .catch(() => alert('Some error occurred on the back-end! Try again!'));
  };
};

const handleToggleTodoAPI = id => {
  return dispatch => {
    dispatch(toggleTodo(id));
    API.saveTodoToggle(id).catch(() => {
      dispatch(toggleTodo(id));
      alert('Some error occurred on the back-end! Try again!');
    });
  };
};

const handleDeleteGoal = goal => {
  return dispatch => {
    dispatch(removeGoal(goal.id));
    return API.deleteGoal(goal.id).catch(() => {
      dispatch(addGoal(goal));
      alert('Some error occurred on the back-end! Try again!');
    });
  };
};

const handleAddGoal = (name, callback) => {
  return dispatch => {
    API.saveGoal(name)
      .then(goal => {
        dispatch(addGoal(goal));
        callback();
      })
      .catch(() => alert('Some error occurred on the back-end! Try again!'));
  };
};

// REDUCERS

const todosReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id !== action.id ? todo : { ...todo, complete: !todo.complete }
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

const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return true;

    default:
      return state;
  }
};

const rootReducer = Redux.combineReducers({
  todos: todosReducer,
  goals: goalsReducer,
  loaded: loadingReducer
});

const store = Redux.createStore(
  rootReducer,
  Redux.applyMiddleware(ReduxThunk.default, loggerMiddleware, bitcoinChecker)
);

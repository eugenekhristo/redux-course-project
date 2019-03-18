// LIBRARY
function createStore(reducer) {
  let state;
  let listeners = [];

  const getState = () => state;

  const subsctibe = listener => {
    listeners.push(listener);
    return () => (listeners = listeners.filter(l => l !== listener));
  };

  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  // first call to fill our state with default values
  dispatch('');

  return {
    getState,
    subsctibe,
    dispatch
  };
}

// APP
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

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
    default:
      return state;
  }
};

const rootReduer = (state = {}, action) => ({
  todos: todosReducer(state.todos, action),
  goals: goalsReducer(state.goals, action)
});

const store = createStore(rootReduer);

console.log(store.getState())

const unsibscribe = store.subsctibe(() => {
  console.log('Current state is: ', store.getState());
  console.log(
    '========================================================================'
  );
});

store.dispatch(
  addTodo({
    id: 0,
    name: 'Learn Redux',
    completed: false
  })
);

store.dispatch(
  addTodo({
    id: 1,
    name: 'Learn about pure functions',
    completed: true
  })
);

store.dispatch(
  addTodo({
    id: 2,
    name: 'Learn NodeJS',
    completed: false
  })
);

store.dispatch(toggleTodo(0));

store.dispatch(removeTodo(1));

store.dispatch(
  addGoal({
    id: 0,
    name: 'Create PWA app with react'
  })
);

store.dispatch(
  addGoal({
    id: 1,
    name: 'Ride a snowboard'
  })
);

store.dispatch(removeGoal(1));

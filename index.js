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

  return {
    getState,
    subsctibe,
    dispatch
  };
}

const todosReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.todo]);
    case 'REMOVE_TODO':
      return state.filter(todo => todo.id !== action.id);
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id !== action.id ? todo : { ...todo, completed: !todo.completed }
      );
    default:
      return state;
  }
};

const goalsReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_GOAL':
      return state.concat([action.goal]);
    case 'REMOVE_GOAL':
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

const unsibscribe = store.subsctibe(() => {
  console.log('Current state is: ', store.getState());
  console.log(
    '========================================================================'
  );
});

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 0,
    name: 'Learn Redux',
    completed: false
  }
});

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 1,
    name: 'Learn about pure functions',
    completed: true
  }
});

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 2,
    name: 'Learn NodeJS',
    completed: false
  }
});

store.dispatch({
  type: 'TOGGLE_TODO',
  id: 0
});

store.dispatch({
  type: 'REMOVE_TODO',
  id: 1
});

store.dispatch({
  type: 'ADD_GOAL',
  goal: {
    id: 0,
    name: 'Create PWA app with react'
  }
});

store.dispatch({
  type: 'ADD_GOAL',
  goal: {
    id: 1,
    name: 'Ride a snowboard'
  }
});

store.dispatch({
  type: 'REMOVE_GOAL',
  id: 1
});

function createStore(reducer) {
  let state;
  let listeners = [];

  const getState = () => state;

  const subsctibe = listener => {
    listeners.push(listener);
    return () => listeners = listeners.filter(l => l !== listener);
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
    default:
      return state;
  }
};

const store = createStore(todosReducer);

const unsibscribe = store.subsctibe(() =>
  console.log('Current state is: ', store.getState())
);

console.log(store.getState());

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

unsibscribe();

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 2,
    name: 'Learn NodeJS',
    completed: false
  }
});


console.log('STATE', store.getState());
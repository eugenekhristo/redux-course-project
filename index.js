// utils
function generateId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  );
}

// LIBRARY
function createStore(reducer) {
  let state;
  let listeners = [];

  const getState = () => state;

  const subscribe = listener => {
    listeners.push(listener);
    return () => (listeners = listeners.filter(l => l !== listener));
  };

  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  // first call to fill our state with default values when store is created
  dispatch('');

  return {
    getState,
    subscribe,
    dispatch
  };
}

// APP STATE
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

const rootReducer = (state = {}, action) => ({
  todos: todosReducer(state.todos, action),
  goals: goalsReducer(state.goals, action)
});

const store = createStore(rootReducer);

// DOM
// like store methods in Angular
function addTodoToStore() {
  const inputElement = document.getElementById('addTodoInput');
  const todoName = inputElement.value;
  inputElement.value = '';

  store.dispatch(
    addTodo({
      id: generateId(),
      name: todoName,
      completed: false
    })
  );
}

document.getElementById('addTodoBtn').addEventListener('click', addTodoToStore);

store.subscribe(() => {
  const {todos} = store.getState();

  document.getElementById('todoList').innerHTML = '';

  todos.forEach(addTodoToDOM);
});

function addTodoToDOM(todo) {
  const li = document.createElement('li');
  li.textContent = todo.name;
  li.style.cursor = 'pointer';

  li.style.textDecoration = todo.completed ? 'line-through' : 'none'
  li.addEventListener('click', () => {
    store.dispatch(toggleTodo(todo.id))
  })

  document.getElementById('todoList').append(li);
}
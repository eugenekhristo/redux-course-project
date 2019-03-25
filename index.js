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

const rootReducer = Redux.combineReducers({
  todos: todosReducer,
  goals: goalsReducer
});

const store = Redux.createStore(
  rootReducer,
  Redux.applyMiddleware(bitcoinChecker, loggerMiddleware)
);

// DOM
// like store methods in Angular
function createRemoveButton(eventHandler) {
  const button = document.createElement('button');
  button.textContent = 'Remove';
  button.addEventListener('click', eventHandler);
  return button;
}

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

function addGoalToStore() {
  const inputElement = document.getElementById('addGoalInput');
  const goalName = inputElement.value;
  inputElement.value = '';

  store.dispatch(
    addGoal({
      id: generateId(),
      name: goalName
    })
  );
}

document.getElementById('addTodoBtn').addEventListener('click', addTodoToStore);
document.getElementById('addGoalBtn').addEventListener('click', addGoalToStore);

store.subscribe(() => {
  const { todos, goals } = store.getState();

  document.getElementById('todoList').innerHTML = '';
  document.getElementById('goalList').innerHTML = '';

  todos.forEach(addTodoToDOM);
  goals.forEach(addGoalToDOM);
});

function addTodoToDOM(todo) {
  const li = document.createElement('li');
  li.textContent = todo.name;
  li.style.cursor = 'pointer';

  li.style.textDecoration = todo.completed ? 'line-through' : 'none';
  li.addEventListener('click', () => {
    store.dispatch(toggleTodo(todo.id));
  });

  const removeButton = createRemoveButton(() => {
    store.dispatch(removeTodo(todo.id));
  });

  document.getElementById('todoList').append(li);
  document.getElementById('todoList').append(removeButton);
}

function addGoalToDOM(goal) {
  const li = document.createElement('li');
  li.textContent = goal.name;
  const removeButton = createRemoveButton(() => {
    store.dispatch(removeGoal(goal.id));
  });
  document.getElementById('goalList').append(li);
  document.getElementById('goalList').append(removeButton);
}

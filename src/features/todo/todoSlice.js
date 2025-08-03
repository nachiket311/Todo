import { createSlice, nanoid } from "@reduxjs/toolkit";

// Load from localStorage
const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("todos");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// Save to localStorage
const saveToLocalStorage = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Sort so that completed todos always go to the bottom
const sortTodos = (todos) => {
  return [...todos].sort((a, b) => a.completed - b.completed);
};

const initialState = {
  todos: sortTodos(loadFromLocalStorage()),
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: nanoid(),
        text: action.payload.trim().replace(/\s+/g, ' '),
        completed: false,
      };
      state.todos.push(newTodo);
      state.todos = sortTodos(state.todos);
      saveToLocalStorage(state.todos);
    },
    removeTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      saveToLocalStorage(state.todos);
    },
    updateTodo: (state, action) => {
      const { id, text } = action.payload;
      const todo = state.todos.find((todo) => todo.id === id);
      if (todo && !todo.completed) {
        todo.text = text.trim().replace(/\s+/g, ' ');
        saveToLocalStorage(state.todos);
      }
    },
    toggleCompleted: (state, action) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        state.todos = sortTodos(state.todos);
        saveToLocalStorage(state.todos);
      }
    },
    reorderTodos: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.todos.splice(sourceIndex, 1);
      state.todos.splice(destinationIndex, 0, removed);
      saveToLocalStorage(state.todos);
    },
  },
});

export const {
  addTodo,
  removeTodo,
  updateTodo,
  toggleCompleted,
  reorderTodos,
} = todoSlice.actions;

export default todoSlice.reducer;

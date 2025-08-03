import React from "react";
import "./App.css";
import AddTodo from "./components/AddTodo";
import Todos from "./components/Todos";

function App() {
  return (
    <>
      <div className="h-14 text-white text-3xl font-bold flex justify-center items-center">
        <h1>Todos</h1>
      </div>
      <AddTodo />
      <Todos />
    </>
  );
}

export default App;

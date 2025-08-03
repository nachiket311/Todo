import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  removeTodo,
  updateTodo,
  toggleCompleted,
  reorderTodos,
} from "../features/todo/todoSlice";

function Todos() {
  const todos = useSelector((state) => state.todo.todos);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(null);
  const [editInput, setEditInput] = useState("");

  const handleEdit = (todo) => {
    setIsEditing(todo.id);
    setEditInput(todo.text.replace(/\s+/g, " ").trim());
  };

  const handleUpdate = (id) => {
    const trimmedText = editInput.replace(/\s+/g, " ").trim();
    if (trimmedText) {
      dispatch(updateTodo({ id, text: trimmedText }));
      setIsEditing(null);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    dispatch(
      reorderTodos({
        sourceIndex: result.source.index,
        destinationIndex: result.destination.index,
      })
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <ul
            className="list-none"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {todos?.map((todo, index) => (
              <Draggable
                draggableId={todo.id.toString()}
                index={index}
                key={todo.id}
              >
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mt-4 flex justify-between items-center bg-zinc-800 px-4 py-2 rounded"
                  >
                    {isEditing === todo.id ? (
                      <div className="w-full flex items-center justify-between space-x-2">
                        <textarea
                          // type="text"
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          className="bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 w-full"
                        />
                        <button
                          onClick={() => handleUpdate(todo.id)}
                          className="text-white bg-green-500 border-0 py-1 px-4 focus:outline-none hover:bg-green-600 rounded text-md"
                        >
                          <i className="fa-regular fa-folder"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center overflow-x-auto space-x-2">
                          <input
                            className="h-4 w-4"
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => dispatch(toggleCompleted(todo.id))}
                          />
                          <span
                            className={`text-white truncate max-w-5xl ${
                              todo.completed ? "line-through opacity-50" : ""
                            }`}
                          >
                            {todo.text}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(todo)}
                            disabled={todo.completed}
                            className={`text-white  border-0 py-1 px-4 focus:outline-none  rounded text-md ${
                              todo.completed
                                ? "opacity-50 cursor-not-allowed bg-green-500 hover:bg-green-600"
                                : "bg-blue-500 hover:bg-blue-600"
                            }`}
                          >
                            <i
                              className={`fa-regular ${
                                todo.completed
                                  ? "fa-circle-check"
                                  : "fa-pen-to-square"
                              }`}
                            ></i>
                          </button>
                          <button
                            onClick={() => dispatch(removeTodo(todo.id))}
                            className="text-white bg-red-500 border-0 py-1 px-4 focus:outline-none hover:bg-red-600 rounded text-md"
                          >
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Todos;

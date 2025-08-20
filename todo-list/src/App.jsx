import { useState, useEffect } from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

function App() {
  const [todoInput, setTodoInput] = useState(""); // Tracks current input for new task
  const [todoItems, setTodoItems] = useState([]); // Stores all todos
  const [error, setError] = useState(false); // Status of error message displaying

  useEffect(() => {
    console.log(todoItems);
  }, [todoItems]);

  const addTask = (input) => {
    const newTask = {
      id: todoItems.length + 1,
      text: input,
      isComplete: false,
      lastUpdated: new Date(),
    };

    setTodoItems((prev) => [...prev, newTask]);
    setTodoInput("");
  };

  const toggleTask = (id, checked) => {
    setTodoItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isComplete: checked,
              lastUpdated: new Date(),
            }
          : item
      )
    );
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10 px-5 sm:px-10 pt-14">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-medium mb-5">Todo List</h1>
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <TextField
            id="outlined-basic"
            label="Task"
            variant="outlined"
            className="flex-1 bg-white"
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (todoInput.length <= 0) {
                  setError(true);
                  return;
                }

                addTask(todoInput);
                setError(false);
              }
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              if (todoInput.length <= 0) {
                setError(true);
              } else {
                addTask(todoInput);
                setError(false);
              }
            }}
          >
            Add Task
          </Button>
        </div>
        {error && (
          <p className="text-red-600 text-sm pl-2">
            Enter at least one character
          </p>
        )}
      </div>
      <div className="flex flex-col w-full max-w-2xl bg-white p-5">
        {todoItems.filter((todo) => !todo.isComplete).length === 0 ? (
          <p className="text-sm text-gray-500 text-center">No tasks to do</p>
        ) : (
          todoItems
            .filter((todo) => !todo.isComplete)
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map((todo) => (
              <div key={todo.id}>
                <Checkbox
                  checked={todo.isComplete}
                  onChange={(e) => toggleTask(todo.id, e.target.checked)}
                />
                <span>{todo.text}</span>
              </div>
            ))
        )}
      </div>
      <div className="w-full max-w-2xl bg-white p-5">
        {todoItems.filter((todo) => todo.isComplete).length === 0 ? (
          <p className="text-sm text-gray-500 text-center">
            No completed tasks
          </p>
        ) : (
          todoItems
            .filter((todo) => todo.isComplete)
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map((todo) => (
              <div key={todo.id}>
                <Checkbox
                  checked={todo.isComplete}
                  onChange={(e) => toggleTask(todo.id, e.target.checked)}
                />
                <span>{todo.text}</span>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default App;

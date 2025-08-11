import { useState } from "react";
import "./App.css";

function App() {
  const [todoItems, setTodoItems] = useState([
    {
      id: 1,
      text: "gym",
      isComplete: false,
    },
    {
      id: 2,
      text: "work",
      isComplete: false,
    },
    {
      id: 3,
      text: "study",
      isComplete: false,
    },
  ]);

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        {todoItems.map((todo) => (
          <div key={todo.id}>
            <input type="checkbox" />
            <span>{todo.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

import { useState } from "react";
import "./App.css";

// Components
import Header from "./components/Header";
import NotesView from "./components/NotesView";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header />
      <NotesView />
    </div>
  );
}

export default App;

import { useState } from "react";
import "./App.css";

import { NotesProvider } from "./NotesContext";

// Components
import Header from "./components/Header";
import NotesView from "./components/NotesView";

function App() {
  const [count, setCount] = useState(0);

  return (
    <NotesProvider>
      <div className="flex justify-center p-5 sm:px-10">
        <div className="w-full max-w-3xl">
          <Header />
          <NotesView />
        </div>
      </div>
    </NotesProvider>
  );
}

export default App;

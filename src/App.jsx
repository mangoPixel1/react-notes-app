import { useContext, useState } from "react";
import "./App.css";

// Contexts
import { UIProvider } from "./contexts/UIContext";
import { NotesProvider } from "./contexts/NotesContext";

// Components
import MainContainer from "./components/MainContainer";

function App() {
  return (
    <UIProvider>
      <NotesProvider>
        <MainContainer />
      </NotesProvider>
    </UIProvider>
  );
}

export default App;

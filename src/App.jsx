import { useContext, useState } from "react";
import "./App.css";

// Contexts
import { UIProvider } from "./UIContext";
import { NotesProvider } from "./NotesContext";

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

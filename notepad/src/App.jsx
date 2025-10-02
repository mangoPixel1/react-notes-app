import { useContext, useState } from "react";
import "./App.css";

// Contexts
import { UIProvider } from "./UIContext";
import { NotesProvider } from "./NotesContext";

// Components
import Header from "./components/Header";
import View from "./components/View";

function App() {
  return (
    <UIProvider>
      <NotesProvider>
        <div className="flex justify-center p-5 sm:px-10">
          <div className="w-full max-w-3xl">
            <Header />
            <View />
          </div>
        </div>
      </NotesProvider>
    </UIProvider>
  );
}

export default App;

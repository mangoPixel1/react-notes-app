import { useState } from "react";
import "./App.css";

import { NotesProvider } from "./NotesContext";

// Components
import Header from "./components/Header";
import NotesView from "./components/NotesView";
import SingleNoteView from "./components/SingleNoteView";

function App() {
  const NOTES_VIEW_INDEX = 0; // All notes (default)
  const SINGLE_NOTE_VIEW = 1;

  const views = [NotesView, SingleNoteView];
  const [currentViewIndex, setCurrentViewIndex] = useState(NOTES_VIEW_INDEX);
  const CurrentView = views[currentViewIndex];

  const [addMode, setAddMode] = useState(false);

  return (
    <NotesProvider>
      <div className="flex justify-center p-5 sm:px-10">
        <div className="w-full max-w-3xl">
          <Header addMode={addMode} setAddMode={setAddMode} />
          <CurrentView addMode={addMode} setAddMode={setAddMode} />
        </div>
      </div>
    </NotesProvider>
  );
}

export default App;

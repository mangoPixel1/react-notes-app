import { useReducer, createContext } from "react";

export const NotesContext = createContext();

const initialState = {
  notesList: [],
};

function notesReducer(state, action) {
  switch (action.type) {
    case "ADD_NOTE":
      const newDate = Date.now();
      const noteObj = {
        id: crypto.randomUUID(),
        creationDate: newDate,
        lastEdited: newDate,
        title: action.payload.title,
        body: action.payload.body,
        color: action.payload.color,
      };

      return { ...state, notesList: [...state.notesList, noteObj] };
    default:
      return state;
  }
}

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  function addNote() {}

  function removeNote() {}

  function editNote() {}

  return (
    <NotesContext.Provider value={{ notes: state.notesList }}>
      {children}
    </NotesContext.Provider>
  );
}

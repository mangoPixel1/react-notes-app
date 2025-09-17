import { useReducer, createContext } from "react";

// Allows components to access the context through useContext
export const NotesContext = createContext();

const initialState = {
  notesList: [],
};

function notesReducer(state, action) {
  switch (action.type) {
    case "ADD_NOTE":
      const newDate = new Date();
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

// Makes context accessible to nested child components
export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  function addNote(newNote) {
    dispatch({
      type: "ADD_NOTE",
      payload: {
        title: newNote.title,
        body: newNote.body,
        color: newNote.color,
      },
    });
  }

  function removeNote(id) {}

  function editNote() {}

  return (
    <NotesContext.Provider
      value={{
        notes: state.notesList,
        addNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

// TODO
// NotesView -> Cancel Button error with setState()

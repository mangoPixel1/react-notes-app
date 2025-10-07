import { useReducer, createContext } from "react";

// Allows components to access the context through useContext
export const NotesContext = createContext();

const initialState = {
  notesList: [
    {
      id: crypto.randomUUID(),
      creationDate: new Date(),
      lastEdited: new Date(),
      title: "Banana",
      body: "A soft yellow fruit rich in potassium.",
      color: "yellow",
    },
    {
      id: crypto.randomUUID(),
      creationDate: new Date(),
      lastEdited: new Date(),
      title: "Apple",
      body: "A sweet red fruit, crisp and juicy.",
      color: "red",
    },
    {
      id: crypto.randomUUID(),
      creationDate: new Date(),
      lastEdited: new Date(),
      title: "Broccoli",
      body: "A green vegetable packed with vitamins.",
      color: "green",
    },
    {
      id: crypto.randomUUID(),
      creationDate: new Date(),
      lastEdited: new Date(),
      title: "Carrot",
      body: "A crunchy orange vegetable good for eyesight.",
      color: "orange",
    },
    {
      id: crypto.randomUUID(),
      creationDate: new Date(),
      lastEdited: new Date(),
      title: "Blueberry",
      body: "A small blue fruit high in antioxidants.",
      color: "blue",
    },
    {
      id: crypto.randomUUID(),
      creationDate: new Date(),
      lastEdited: new Date(),
      title: "Mushroom",
      body: "A gray vegetable with an earthy flavor.",
      color: "gray",
    },
  ],
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

    case "DELETE_NOTE":
      return {
        ...state,
        notesList: state.notesList.filter((note) => note.id !== action.payload),
      };
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

  function removeNote(id) {
    dispatch({
      type: "DELETE_NOTE",
      payload: id,
    });
  }

  function editNote(title, body, lastUpdate) {}

  return (
    <NotesContext.Provider
      value={{
        notes: state.notesList,
        addNote,
        removeNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

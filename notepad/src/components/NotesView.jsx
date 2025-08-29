import { useState, useContext } from "react";
import { NotesContext } from "../NotesContext";

// Components
import NoteCard from "./NoteCard";

function NotesView() {
  const { notes } = useContext(NotesContext);

  const [addMode, setAddMode] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [color, setColor] = useState("");

  const colorOptions = ["yellow", "red", "green", "orange", "blue", "gray"];

  const handleAddNote = (e) => {
    e.preventDefault();

    console.log(title);
    console.log(body);
    console.log(color);
  };

  return (
    <div className="mt-8">
      {addMode && (
        <form className="mb-8">
          <div className="space-y-2">
            <input
              className="block border"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="block border"
              name="note-body"
              id="note-body"
              placeholder="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </div>

          <div className="flex flex-wrap my-5">
            {colorOptions.map((colorOption, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={colorOption}
                  name="colors"
                  value={colorOption}
                  checked={color === colorOption}
                  onChange={(e) => setColor(e.target.value)}
                />
                <label htmlFor={colorOption} className="ml-1 mr-3">
                  {colorOption.charAt(0).toUpperCase() + colorOption.slice(1)}
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddNote}
            className="bg-gray-200 px-2 py-2 cursor-pointer hover:bg-gray-300 transition duration-300"
          >
            Add Note
          </button>
        </form>
      )}

      <div className="mb-3">
        <label htmlFor="sortBy" className="mr-2">
          Sort by
        </label>
        <select name="sortBy" id="sortBy">
          <option value="date-created-newest">{`Date Created (Newest)`}</option>
          <option value="date-created-oldest">{`Date Created (Oldest)`}</option>
          <option value="last-edited">Last Edited</option>
          <option value="color">Color</option>
        </select>
      </div>
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          title={note.title}
          body={note.body}
          creationDate={note.creationDate}
          lastEdited={note.lastEdited}
          color={note.color}
        />
      ))}
    </div>
  );
}

export default NotesView;

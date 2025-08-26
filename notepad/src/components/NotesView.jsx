import React from "react";

// Components
import NoteCard from "./NoteCard";

function NotesView() {
  return (
    <div>
      <p>Sort by</p>
      <NoteCard color={"yellow"} />
      <NoteCard color={"red"} />
      <NoteCard color={"green"} />
      <NoteCard color={"orange"} />
      <NoteCard color={"blue"} />
      <NoteCard color={"gray"} />
    </div>
  );
}

export default NotesView;

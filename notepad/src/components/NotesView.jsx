import React from "react";

// Components
import NoteCard from "./NoteCard";

function NotesView() {
  return (
    <div className="mt-8">
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

      {[...Array(5)].map((_, i) => (
        <NoteCard
          key={i}
          title={"Title"}
          body={"Lorem ipsum dolor sit amet"}
          creationDate={"1/1/2025"}
          lastEdited={"2/2/2025"}
          color={"yellow"}
        />
      ))}
    </div>
  );
}

export default NotesView;

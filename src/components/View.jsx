import React, { useContext, useState } from "react";

// Context
import { UIContext } from "../UIContext";

function View() {
  const { views, currentViewIndex, currentNoteID } = useContext(UIContext);
  const CurrentView = views[currentViewIndex];

  return (
    <>
      {currentNoteID && currentViewIndex === 1 ? (
        <CurrentView id={currentNoteID} />
      ) : (
        <CurrentView />
      )}
    </>
  );
}

export default View;

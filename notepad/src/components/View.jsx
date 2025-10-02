import React, { useContext, useState } from "react";

// Context
import { UIContext } from "../UIContext";

function View() {
  const { views, currentViewIndex } = useContext(UIContext);
  const CurrentView = views[currentViewIndex];

  return (
    <>
      <CurrentView />
    </>
  );
}

export default View;

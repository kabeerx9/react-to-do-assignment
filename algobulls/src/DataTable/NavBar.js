import React, { useState } from "react";
import NewItemForm from "./NewItemForm";
const NavBar = (props) => {
  const [flag, setFlag] = useState(false);

  const flagChangeHandler = (e) => {
    e.preventDefault();
    setFlag((prev) => !prev);
  };
  return (
    <>
      {!flag && <input onChange={(e) => props.onQueryChange(e.target.value)} />}
      {!flag && <button onClick={flagChangeHandler}>Tap to add item</button>}
      {flag && <NewItemForm onAdd={props.onAdd} onclick={flagChangeHandler} />}
    </>
  );
};

export default NavBar;

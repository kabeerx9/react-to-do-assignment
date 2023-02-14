import React, { useState } from "react";
import NewItemForm from "./NewItemForm";

import { Input, Button } from "antd";

const NavBar = (props) => {
  const [flag, setFlag] = useState(false);

  const flagChangeHandler = (e) => {
    e.preventDefault();
    setFlag((prev) => !prev);
  };

  return (
    <>
      {!flag && (
        <Input
          onChange={(e) => props.onQueryChange(e.target.value)}
          placeholder="Enter search term"
          style={{
            width: 200,
            marginRight: 10,
            marginBottom: 30,
            marginTop: 30,
          }}
        />
      )}
      {!flag && (
        <Button
          onClick={flagChangeHandler}
          style={{ marginBottom: 30, marginTop: 30 }}
        >
          Tap to add item
        </Button>
      )}
      {flag && <NewItemForm onAdd={props.onAdd} onclick={flagChangeHandler} />}
    </>
  );
};
export default NavBar;

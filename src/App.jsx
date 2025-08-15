import { useEffect, useState } from "react";
import { Input, ListOfAllItems } from "./Components.jsx";

export default function TodoApp() {
  const [toggleShowDone, setToggleShowDonw] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [addTaskText, setAddTaskText] = useState("");

  useEffect(() => {
    const getServerData = async () => {
      try {
        const result = await fetch("http://localhost:3001/todos");
        result.json().then((json) => {
          setListItems(json);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getServerData();
  }, []);

  const addNewServerData = async (task) => {
    try {
      const result = await fetch("http://localhost:3001/todos", {
        method: "POST",
        header: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: task,
          isEditing: false,
          isDone: false,
        }),
      });
      result.json().then((newListItem) => {
        setListItems([...listItems, newListItem]);
        console.log(newListItem);
      });
    } catch (error) {
      console.log(error);
    }
  };

  async function handleDone(id) {
    try {
      const result = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "PATCH",
        header: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isDone: true,
        }),
      });
      result.json().then((updatedItem) => {
        setListItems(listItems.map((e) => (e.id === id ? updatedItem : e)));
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEditSave(id, textToSave) {
    const result = await fetch(`http://localhost:3001/todos/${id}`, {
      method: "PATCH",
      header: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        task: textToSave,
        isEditing: false,
      }),
    });
    result.json().then((editedItem) => {
      setListItems(listItems.map((e) => (e.id === id ? editedItem : e)));
    });
  }

  async function handleDelete(id) {
    const result = await fetch(`http://localhost:3001/todos/${id}`, {
      method: "DELETE",
    });
    result.json().then(() => {
      setListItems(listItems.filter((e) => e.id !== id));
    });
  }

  function handleEdit(id) {
    setListItems(() => {
      const newListItems = listItems.map((e) => {
        if (id === e.id) {
          e.isEditing = true;
        } else {
          e.isEditing = false;
        }
        return e;
      });
      return newListItems;
    });
  }

  return (
    <>
      <h3>TODO LIST</h3>
      <Input
        addTaskText={addTaskText}
        setAddTaskText={setAddTaskText}
        addNewServerData={addNewServerData}
      />
      <button onClick={() => setToggleShowDonw(!toggleShowDone)}>
        {toggleShowDone ? "Hide Done" : "Show Done"}
      </button>
      <ListOfAllItems
        listItems={listItems}
        handleEditSave={handleEditSave}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleDone={handleDone}
        toggleShowDone={toggleShowDone}
      />
    </>
  );
}

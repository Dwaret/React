import { useEffect, useState } from "react";
import { Input, ListOfAllItems } from "./Components.jsx";
import { setItem, getItem } from "./LocalStorage.js";

export default function TodoApp() {
  const [toggleShowDone, setToggleShowDonw] = useState(false);
  const [id, setId] = useState(() => {
    const value = getItem("count");
    return value ? value : 0;
  });
  const [listItems, setListItems] = useState(() => {
    const value = getItem("listItems");
    return value ? value : [];
  });
  const [addTaskText, setAddTaskText] = useState("");

  useEffect(() => {
    setItem("listItems", listItems);
    setItem("count", id);
  }, [listItems, id]);

  function handleEditSave(id, textToSave) {
    setListItems(() => {
      const newListItem = listItems.map((e) => {
        if (id === e.id) {
          e.task = textToSave;
          e.isEditing = false;
        }
        return e;
      });
      return newListItem;
    });
  }

  function handleDelete(id) {
    setListItems(listItems.filter((e) => e.id !== id));
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

  function handleDone(id) {
    setListItems(() => {
      const newListItems = listItems.map((e) => {
        if (id === e.id) {
          e.isDone = true;
        }
        return e;
      });
      return newListItems;
    });
  }

  function handleAddTask(event) {
    event.preventDefault();

    setListItems([
      ...listItems,
      {
        id: id,
        task: addTaskText,
        isEditing: false,
        isDone: false,
      },
    ]);

    setId(id + 1);

    setAddTaskText("");
  }

  return (
    <>
      <h3>TODO LIST</h3>
      <form>
        <Input
          addTaskText={addTaskText}
          setAddTaskText={setAddTaskText}
          handleAddTask={handleAddTask}
        />
      </form>
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

import { useState } from "react";
import { FaCheckSquare } from "react-icons/fa";

export function Input({ addTaskText, setAddTaskText, addNewServerData }) {
  return (
    <>
      <form>
        <input
          value={addTaskText}
          onChange={(e) => setAddTaskText(e.target.value)}
          placeholder="Add your task here"
        ></input>
        <button
          onClick={(e) => {
            e.preventDefault();
            addNewServerData(addTaskText);
          }}
        >
          ADD
        </button>
      </form>
    </>
  );
}

export function ListOfAllItems({
  listItems,
  handleEditSave,
  handleDelete,
  handleEdit,
  handleDone,
  toggleShowDone,
}) {
  return (
    <ul>
      {listItems.map((e) => {
        return e.isEditing ? (
          <Edit
            item={e}
            handleEditSave={handleEditSave}
            handleDelete={handleDelete}
          />
        ) : (
          <ListItem
            item={e}
            handleEdit={handleEdit}
            handleDone={handleDone}
            toggleShowDone={toggleShowDone}
          />
        );
      })}
    </ul>
  );
}

function Edit({ item, handleEditSave, handleDelete }) {
  const [editText, setEditText] = useState(item.task);

  return (
    <>
      <li>
        <input value={editText} onChange={(e) => setEditText(e.target.value)} />
        <button onClick={() => handleEditSave(item.id, editText)}>Save</button>
        <button onClick={() => handleDelete(item.id)}>Delete</button>
      </li>
    </>
  );
}

function ListItem({ item, handleEdit, handleDone, toggleShowDone }) {
  if (toggleShowDone && item.isDone) {
    return (
      <>
        <li key={item.id}>
          {item.task}
          <FaCheckSquare />
        </li>
      </>
    );
  } else if (!item.isDone) {
    return (
      <>
        <li key={item.id}>
          {item.task}
          <button onClick={() => handleEdit(item.id)}>Edit</button>
          <button onClick={() => handleDone(item.id)}>Done!</button>
        </li>
      </>
    );
  }
}

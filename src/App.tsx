import { useState } from "react";
import { Input, ListOfAllItems } from "./Components.jsx";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

interface Todo {
  id: number;
  task: string;
  isEditing: boolean;
  isDone: boolean;
}

export default function TodoApp() {
  const [toggleShowDone, setToggleShowDone] = useState<boolean>(false);
  const [addTaskText, setAddTaskText] = useState<string>("");
  const queryClient = useQueryClient();

  const initialServerData = useQuery({
    queryKey: ["todos"],
    queryFn: getServerData,
  });

  const saveEditMutation = useMutation({
    mutationFn: (save: { id; textToSave }) =>
      saveEdit(save.id, save.textToSave),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const addEditStatusMutation = useMutation({
    mutationFn: (id: number) => addEditStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const addDoneStatusMutation = useMutation({
    mutationFn: (id: number) => addDoneStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: (task: string) => addData(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => DeleteData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (initialServerData.isPending) {
    return <div>Loading...</div>;
  }

  function addNewServerData(addTaskText: string) {
    addMutation.mutate(addTaskText);
    setAddTaskText("");
  }

  function handleDone(id: number) {
    addDoneStatusMutation.mutate(id);
  }

  function handleEditSave(id: number, textToSave: string) {
    saveEditMutation.mutate({ id, textToSave });
  }

  function handleDelete(id: number) {
    deleteMutation.mutate(id);
  }

  function handleEdit(id: number) {
    addEditStatusMutation.mutate(id);
  }

  const todos = initialServerData.data;

  return (
    <>
      <h3>TODO LIST</h3>
      <Input
        addTaskText={addTaskText}
        setAddTaskText={setAddTaskText}
        addNewServerData={addNewServerData}
      />
      <button onClick={() => setToggleShowDone(!toggleShowDone)}>
        {toggleShowDone ? "Hide Done" : "Show Done"}
      </button>
      <ListOfAllItems
        listItems={todos || []}
        handleEditSave={handleEditSave}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleDone={handleDone}
        toggleShowDone={toggleShowDone}
      />
    </>
  );
}

async function saveEdit(id: number, textToSave: string) {
  const response = await fetch(`http://localhost:3001/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task: textToSave,
      isEditing: false,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to update item");
  }
  return response.json();
}

async function addEditStatus(id: number) {
  const response = await fetch(`http://localhost:3001/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isEditing: true,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to update item");
  }
  return response.json();
}

async function addDoneStatus(id: number) {
  const response = await fetch(`http://localhost:3001/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isDone: true,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to update item");
  }
  return response.json();
}

async function addData(task: string) {
  const response = await fetch("http://localhost:3001/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task: task,
      isEditing: false,
      isDone: false,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to add item");
  }
  return response.json();
}

async function DeleteData(id: number) {
  const response = await fetch(`http://localhost:3001/todos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete item");
  }
  return response.json();
}

async function getServerData() {
  const response = await fetch("http://localhost:3001/todos");
  if (!response.ok) {
    throw new Error("Unable to fetch data from server");
  }
  return response.json();
}

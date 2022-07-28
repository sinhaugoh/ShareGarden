import { createContext, useContext, useState } from "react";
import CreateItemPostFormModal from "../components/shared/CreateItemPostFormModal";

const CreateItemPostContext = createContext();

export function useCreateItemPost() {
  return useContext(CreateItemPostContext);
}

export function CreateItemPostProvider({ children }) {
  const [isOpenCreateItemPostModal, setIsOpenCreateItemPostModal] =
    useState(false);

  function toggleCreateItemPostModal() {
    setIsOpenCreateItemPostModal((prev) => !prev);
  }

  return (
    <CreateItemPostContext.Provider
      value={{ isOpenCreateItemPostModal, toggleCreateItemPostModal }}
    >
      <CreateItemPostFormModal />
      {children}
    </CreateItemPostContext.Provider>
  );
}

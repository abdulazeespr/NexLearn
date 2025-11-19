import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "./authSlice";

function loadFromLocalStorage() {
  try {
    const serialized = localStorage.getItem("auth");
    if (!serialized) return undefined;
    return { auth: JSON.parse(serialized) };
  } catch (e) {
    console.warn("Failed to load auth from localStorage", e);
    return undefined;
  }
}

function saveToLocalStorage(state: any) {
  try {
    const serialized = JSON.stringify(state.auth);
    localStorage.setItem("auth", serialized);
  } catch (e) {
    console.warn("Failed to save auth to localStorage", e);
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: typeof window !== "undefined" ? loadFromLocalStorage() : undefined,
});

store.subscribe(() => {
  if (typeof window === "undefined") return;
  saveToLocalStorage(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector as any;

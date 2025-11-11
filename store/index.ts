import { create } from "zustand";

interface AppState {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;

  bottomActiveMenu: string;
  setBottomActiveMenu: (menu: string) => void;
}

const appStore = create<AppState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => set(() => ({ isLoggedIn: value })),

  bottomActiveMenu: "/",
  setBottomActiveMenu: (menu: string) =>
    set(() => ({ bottomActiveMenu: menu })),
}));

export default appStore;

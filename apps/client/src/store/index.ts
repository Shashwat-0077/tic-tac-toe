import { create } from "zustand";

type Store = {
    username: string;
};

type Action = {
    setUsername: (username: string) => void;
};

export const useStore = create<Store & Action>()((set) => ({
    username: "",
    setUsername: (username) => set((state) => ({ username })),
}));

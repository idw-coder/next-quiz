import { create } from "zustand";

type ConfirmDialogState = {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    open: (message: string, onConfirm: () => void) => void;
    close: () => void;
};

export const useConfirmDialog = create<ConfirmDialogState>((set) => ({
    isOpen: false,
    message: '',
    onConfirm: () => {},
    open: (message, onConfirm) => set({ isOpen: true, message, onConfirm }),
    close: () => set({ isOpen: false, message: '', onConfirm: () => {} }),
}));
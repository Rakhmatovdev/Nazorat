import { create } from 'zustand';

export const useZustan = create((set) => ({
  Udata: {},
  add: () => set((state) => ({ Udata: state.Udata })),
  remove: () => set({ Udata: {} }),
  update: (newBears) => set({ bears: newBears }),
}));

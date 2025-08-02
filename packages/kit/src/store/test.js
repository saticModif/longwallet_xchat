import {create} from 'zustand';

const useStore = create((set) => ({
  isShowAppTabs: false,
  setShowAppTabs: (flag) => set((state) => ({ isShowAppTabs: flag})),
 
}));

export default useStore
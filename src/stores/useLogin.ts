import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface StoreState {
  type: string | null;
}

interface StoreActions {
  setType: (type: string) => void;
}

const initInfo = { type: 'login' };

export const useLoginStore = create<StoreState & StoreActions>()(
  immer((set, get) => ({
    ...initInfo,
    setType: (type: string) => {
      set({ type });
    },
  }))
);

interface StoreNoCacheState {
  isShowInfomonHome: number; // 1 home 2 pet room 3 pet book 4 infomon station // 5 infomon lab // 7 petbookdetail
  currentMapHover: string;
  showShopHightLight: boolean;
  buyItemCurrentLight: number;
}

interface StoreNoCacheActions {
  setIsShowInfomonHome: (show: number) => void;
  setCurrentMapHover: (currentMapHover: string) => void;
  setShowShopHightLight: (show: boolean) => void;
  setBuyItemCurrentLight: (num: number) => void;
}

export const useNoCacheStore = create<
  StoreNoCacheState & StoreNoCacheActions
>()(
  immer((set, get) => ({
    isShowInfomonHome: 0,
    setIsShowInfomonHome: (status: number) => {
      var body = document.body;
      if (status === 0) {
        body.style.overflow = "";
      } else {
        body.style.overflow = "hidden";
      }
      set((state) => {
        state.isShowInfomonHome = status;
      });
    },

    currentMapHover: "petroom",
    setCurrentMapHover: (currentMapHover: string) => {
      set((state) => {
        state.currentMapHover = currentMapHover;
      });
    },
    buyItemCurrentLight: -1,
    setBuyItemCurrentLight: (num: number) => {
      set((state) => {
        state.buyItemCurrentLight = num;
      });
    },
    showShopHightLight: false,
    setShowShopHightLight: (show: boolean) => {
      set((state) => {
        state.showShopHightLight = show;
      });
    },
  }))
);

// Calculate if time is greater than one day
export const isMoreThanOneDay = (time: number): boolean => {
  const now = new Date().getTime();
  return now - time > 24 * 60 * 60 * 1000;
};

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface StoreState {
  user: any | null;
  token: string | null;
  sonicAddress: string | null;
  currentSelectChainType: string | null;
}

interface StoreActions {
  setToken: (token: any) => void;
  setUser: (user: any) => void;
  setSonicAddress: (sonicAddress: any) => void;
  setCurrentSelectChainType: (currentSelectType: string) => void;
  reset: () => void;
}

const initInfo = {
  user: null,
  token: null,
  sonicAddress: null,
  currentSelectChainType: "Sonic",
};

export const useStore = create<StoreState & StoreActions>()(
  persist(
    immer((set, get) => ({
      ...initInfo,
      setToken: (token: any) => {
        set({ token });
      },
      setCurrentSelectChainType: (currentSelectChainType: string) => {
        set({ currentSelectChainType });
      },
      setSonicAddress: (sonicAddress: any) => {
        set({ sonicAddress });
      },
      setUser: (user: any) => {
        set({ user });
      },
      reset: () =>
        set({
          user: null,
          token: null,
        }),
    })),

    {
      name: "gaime",
      storage: createJSONStorage(() => localStorage),
    }
  )
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

// Calculate if time is more than one day
export const isMoreThanOneDay = (time: number): boolean => {
  const now = new Date().getTime();
  return now - time > 24 * 60 * 60 * 1000;
};

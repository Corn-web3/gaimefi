import React, { useEffect, useState } from "react";
import { ChevronRight, Copy } from "lucide-react";
import { toast } from "@/components/Toast";
import { getMyGameHold, getMyGameToken } from "@/services/gameService";
import NoData from "@/components/NoData";
import { useNavigate } from "react-router-dom";
import CreateGames from "./CreateGames";
import HoldGames from "./HoldGames";
import { useStore } from "@/stores";

interface GameItem {
  amount: number;
  currency: string;
  value: number;
}

interface ProfileCardProps {
  address: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLogout: () => void;
  onRefreshCoin: (index: number) => void;
}

const WalletPopup: React.FC<ProfileCardProps> = ({
  address,
  currentPage,
  totalPages,
  onPageChange,
  onLogout,
  onRefreshCoin,
}) => {
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const { user } = useStore();

  const [activeTab, setActiveTab] = useState("gameHeld");

  const handleCopy = () => {
    toast.success("Copied to clipboard");
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="w-[400px] bg-[#0e1515] rounded-2xl  text-white">
      {/* Header */}
      <div className="flex items-center justify-between w-full h-[54px] px-[16px] ">
        <div className="flex items-center gap-2">
          <img
            src={user?.avatarUrl}
            className="w-6 h-6 bg-[#2c2d30] rounded-md"
          ></img>
          <span className="font-thin text-[14px]">
            {shortenAddress(address)}
          </span>
        </div>
        <button className="w-6 h-6 flex items-center justify-center">
          <Copy className="w-4 h-4" onClick={handleCopy} />
        </button>
      </div>

      <div className="w-full bg-[#1a2222] p-[16px] border border-[#252d2d] rounded-[10px] border-b-[0px]">
        {/* Tabs */}
        <div className="flex mb-6 w-full items-center border border-[#252d2d] rounded-[10px] text-[12px]">
          <button
            className="flex-1 py-2 text-[#00ffcc] border-b-2 border-[#00ffcc] text-sm font-thin rounded-[10px]"
            style={{
              backgroundColor: activeTab === "gameHeld" ? "#262d2d" : "#1a2222",
              color: activeTab === "gameHeld" ? "#09FFF0" : "#fff",
            }}
            onClick={() => {
              setActiveTab("gameHeld");
            }}
          >
            My Holdings
          </button>
          <button
            className="flex-1 py-2 text-gray-400 text-sm font-thin rounded-[10px]"
            style={{
              backgroundColor:
                activeTab === "gameCreated" ? "#262d2d" : "#1a2222",
              color: activeTab === "gameCreated" ? "#09FFF0" : "#fff",
            }}
            onClick={() => {
              setActiveTab("gameCreated");
            }}
          >
            My Creations
          </button>
        </div>

        {/* Game List */}
        {activeTab === "gameHeld" ? <HoldGames /> : <CreateGames />}
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center h-[56px] justify-center text-sm font-medium text-white hover:text-gray-200 cursor-pointer bg-[#1a2222]"
        style={{
          borderTop: "1px solid #313838",
        }}
      >
        Log out
      </button>
    </div>
  );
};

export default WalletPopup;

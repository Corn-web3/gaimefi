// WalletAddress.tsx
import React, { useState, useRef, useEffect } from "react";
import okxIcon from "@/assets/fun/okxIcon.png";
import { ChevronDown, ChevronRight, Copy } from "lucide-react";
import WalletPopup from "./WalletPopup";
import { useWallet } from "@/utils/useWallet";
import { useStore } from "@/stores";
import { trackEvent } from "@/utils/trackEvent";
import { useEvent } from "@/utils/ImEvent";

interface WalletAddressProps {
  address: string;
}
const WalletAddress = ({ address }: WalletAddressProps) => {
  const { loginOut } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useStore();
  const { currentSelectChainType } = useStore.getState();
  useEvent("chooseSonicThenLogout", () => {
    handleLogout();
  });

  const handleLogout = () => {
    loginOut();
    trackEvent("logout");
  };

  const handleRefreshCoin = (index: number) => {
    console.log("Refreshing coin at index:", index);
  };
  return (
    <div
      className={`relative w-[174px] h-[42px]  cursor-pointer ml-[24px]`}
      ref={dropdownRef}
    >
      <div
        onClick={() => {
          if (currentSelectChainType !== "Sonic") {
            setIsOpen(!isOpen);
          }
        }}
        className={`
          w-full
          h-full
          flex items-center justify-center
          bg-[#1f2023] 
          rounded-[12px]
          pl-[9px]
          pr-[16px]
          text-white
          hover:bg-[#2a2b2f]
          transition-colors
          border border-[#2c3030]
          hover:border-[#fff]
        `}
      >
        {/* Wallet Icon */}
        <img
          src={
            user?.avatarUrl || "https://api-staging.gaime.fun/file/avatar9.png"
          }
          className="w-[24px] h-[24px]"
          alt=""
        />

        {/* Address */}
        <span className="text-sm font-medium ml-[8px]">
          {`${address.slice(0, 4)}...${address.slice(-4)}`}
        </span>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 ml-auto transition-transform cursor-pointer ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 w-[400px] mt-2 bg-[#1f2023] rounded-xl overflow-hidden shadow-lg z-[100]">
          <WalletPopup
            address={address}
            currentPage={currentPage}
            totalPages={3}
            onPageChange={setCurrentPage}
            onLogout={handleLogout}
            onRefreshCoin={handleRefreshCoin}
          />
        </div>
      )}
    </div>
  );
};

export default WalletAddress;

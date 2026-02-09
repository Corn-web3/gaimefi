import { useState } from "react";
interface TabProps {
  tabs: any[];
  activeTab: any;
  onChange: (tab: any) => void;
}
const Tab = ({ tabs, activeTab, onChange }: TabProps) => {
  return (
    <div className="w-full">
      <div className="flex w-full items-center">
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => {
              onChange(tab);
            }}
            className="mr-[32px] font-medium text-[16px] text-[#fff] cursor-pointer relative"
            style={{
              color: activeTab?.name === tab?.name ? "#fff" : "#6f7373",
              fontWeight: activeTab?.name === tab?.name ? "bold" : "normal",
            }}
          >
            {tab?.name} {tab?.num ? `(${tab?.num})` : ""}

            {activeTab?.name === tab?.name && (
              <div className="absolute bottom-[-23px] left-0 w-full h-[3px] bg-[#09fff0]"></div>
            )}
          </div>
        ))}
      </div>

      <div className="w-wull h-[1px] bg-[#1b2121]  mt-[24px] relative"></div>
    </div>
  );
};

export default Tab;

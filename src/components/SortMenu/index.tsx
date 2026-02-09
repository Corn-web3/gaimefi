import { useEffect, useState } from "react";
import CustomSelect from "../CustomSelect";
import { getGameType } from "@/services/gameService";

interface SortMenuProps {
  onChangeSort?: (value: string) => void;
  onChangeGameType?: (value: string) => void;
}
const SortMenu: React.FC<SortMenuProps> = ({
  onChangeSort,
  onChangeGameType,
}) => {
  const [selectedValue, setSelectedValue] = useState("3");

  const options = [
    { value: "1", label: "Marketcap" },
    { value: "2", label: "Total Plays" },
    { value: "3", label: "Last Created" },
  ];
  const [sortMenuList, setSortMenuList] = useState<any>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const getGameTypeList = async () => {
    const res = await getGameType();
    setSortMenuList(res);
  };

  useEffect(() => {
    getGameTypeList();
  }, []);
  return (
    <div className="flex items-center">
      <CustomSelect
        frontText={<div className="text-[#6e7171] ">Sort by</div>}
        className="!w-[224px] !h-[40px] !rounded-[12px] !text-[14px] !font-medium !border-none !px-[10px]"
        options={options}
        value={selectedValue}
        onChange={(value) => {
          if (value === selectedValue) {
            setSelectedValue("");
            onChangeSort?.("");
          } else {
            setSelectedValue(value);
            onChangeSort?.(value);
          }
        }}
      ></CustomSelect>

      <div className="flex items-center ml-[16px]">
        {sortMenuList?.length > 0 &&
          sortMenuList?.map((item, index) => (
            <div
              key={item?.name}
              style={{
                background: activeIndex === index ? "#032120" : "#0f1716",
                color: activeIndex === index ? "#09FFF0" : "#fff",
              }}
              className="h-[40px] px-[24px] cursor-pointer bg-[#0f1716] rounded-[12px] text-[#fff] flex items-center text-[14px] font-medium mr-[16px]"
              onClick={() => {
                if (activeIndex === index) {
                  setActiveIndex(-1);
                  onChangeGameType?.("");
                } else {
                  setActiveIndex(index);
                  onChangeGameType?.(item?.name);
                }
              }}
            >
              {item?.name}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SortMenu;

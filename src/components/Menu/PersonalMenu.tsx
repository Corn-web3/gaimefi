import { classNames } from "@/utils/classNames";
import PersonalMenuItemButton from "../CustomButton/PersonalMenuItemButton";

import houseIcon from "@/assets/personal/house.svg";
import medalIcon from "@/assets/personal/medal.svg";
import summarizeIcon from "@/assets/personal/summarize.svg";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const menus = [
  {
    icon: <img className="w-[36px] h-[36px]" src={houseIcon} />,
    title: "Home",
    id: "home",
    path: "/personal/home",
  },
  {
    icon: <img className="w-[36px] h-[36px]" src={medalIcon} />,
    title: "Interview Drill",
    id: "interviewDrill",
    path: "/personal/interview-drill",
  },
  {
    icon: <img className="w-[36px] h-[36px]" src={summarizeIcon} />,
    title: "Reports & Progress",
    id: "reportsProgress",
    path: "/personal/reports",
  },
];

const PersonalMenu = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentMenu, setCurrentMenu] = useState("");
  const onClickMenuItem = (menu) => {
    setCurrentMenu(menu.id);
    navigate(menu.path);
  };

  useEffect(() => {
    const path = location.pathname;
    const _menu = menus.find((menu) => path.startsWith(menu.path));
    if (_menu) {
      setCurrentMenu(_menu.id);
    }
  }, [location]);

  return (
    <div
      className={classNames(
        "bg-[#4a23cc] flex flex-col items-center pt-[147px]",
        className
      )}
    >
      {menus?.map((menu, index) => (
        <PersonalMenuItemButton
          key={index}
          className={classNames(
            "w-[194px] text-[#fff] font-medium",
            index !== 0 ? "mt-[40px]" : ""
          )}
          selected={currentMenu === menu?.id}
          icon={menu.icon}
          onClick={() => onClickMenuItem(menu)}
        >
          {menu.title}
        </PersonalMenuItemButton>
      ))}
    </div>
  );
};

export default PersonalMenu;

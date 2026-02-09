import { classNames } from "@/utils/classNames";

const PersonalMenuItemButton = ({ children, icon, className = "",selected, onClick }) => {
  return (
    <div
      className={classNames(
        "flex items-center rounded-[10px] hover:bg-[#a992ef] px-[18px] py-[10px] cursor-pointer rounded-full",
        className,
        selected ? "bg-[#a992ef]" : ""
      )}
      onClick={onClick}
    >
      <div className="mr-[8px]">{icon}</div>
      {children}
    </div>
  );
};

export default PersonalMenuItemButton;

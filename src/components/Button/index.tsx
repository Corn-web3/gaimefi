import { classNames } from "@/utils/classNames";
import { Button as MuiButton } from "@mui/material";
export const Button = ({ children, className, ...props }: any) => {
  return (
    <MuiButton
      {...props}
      className={classNames(className, " setFontRobotoMono")}
      sx={{ textTransform: "none" }}
    >
      {children}
    </MuiButton>
  );
};

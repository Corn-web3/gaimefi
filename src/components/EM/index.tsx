import { classNames } from "@/utils/classNames";

export const EM = ({ className, italic = false,children }: any) => {
  return (
    <em className={classNames(!italic ? " not-italic" : "", className)}>{children}</em>
  );
};

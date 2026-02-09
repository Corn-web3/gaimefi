import { Pagination as MuiPagination } from "@mui/material";
import { useEffect, useState } from "react";
import PageArrowImg from "@/assets/icon/page-arrow.png";
import PageArrowDisabledImg from "@/assets/icon/page-arrow-disabled.png";
import { classNames } from "@/utils/classNames";

const Arrow = ({
  disabled,
  direction,
  onClick = () => {},
}: {
  disabled: boolean;
  direction: "left" | "right";
  onClick?: () => void;
}) => {
  return (
    <img
      className={classNames(
        "w-[16px] h-[16px]",
        (direction === "left" && !disabled) ||
          (direction === "right" && disabled)
          ? "rotate-180"
          : ""
      )}
      src={disabled ? PageArrowDisabledImg : PageArrowImg}
      alt=""
      onClick={onClick}
    />
  );
};

export const Pagination = ({
  count,
  onChange,
  page: _page = undefined,
  showText = false,
  ...props
}) => {
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (!_page) {
      return;
    }
    setPage(_page);
  }, [_page]);
  return (
    <div className="flex items-center">
      <div
        className="cursor-pointer flex items-center mr-[20px] select-none"
        onClick={() => {
          if (page === 1) return;
          setPage(Math.max(1, page - 1));
          onChange?.(Math.max(1, page - 1));
        }}
      >
        <Arrow direction="left" disabled={page === 1} />
        {showText && (
          <span
            className="text-[14px] ml-[8px]"
            style={{ color: page === 1 ? "#FFFFFF66" : "#FFFFFF99" }}
          >
            Previous
          </span>
        )}
      </div>
      <MuiPagination
        count={count}
        page={page}
        color="primary"
        onChange={(e, _page) => {
          setPage(_page);
          onChange?.(_page);
        }}
        hideNextButton
        hidePrevButton
        shape="rounded"
        sx={[
          { "& .MuiPaginationItem-root": { color: "#FFFFFF99 !important" } },
          {
            "& .Mui-selected": {
              background: "#09FFF0 !important",
              color: "#000 !important",
            },
          },
        ]}
        className="!text-[#fff]"
        {...props}
      />
      <div
        className="cursor-pointer flex items-center ml-[20px] select-none"
        onClick={() => {
          if (page === count) return;
          setPage(Math.min(count, page + 1));
          onChange?.(Math.min(count, page + 1));
        }}
      >
        {showText && (
          <span
            className="text-[14px] mr-[8px]"
            style={{ color: page === count ? "#FFFFFF66" : "#FFFFFF99" }}
          >
            Next
          </span>
        )}
        <Arrow direction="right" disabled={page === count} />
      </div>
    </div>
  );
};

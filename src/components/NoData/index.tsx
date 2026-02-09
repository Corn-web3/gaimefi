import Nodata from "@/assets/fun/Nodata.png";

interface NoDataProps {
  className?: string;
  text?: string;
}

const NoData = ({ className, text }: NoDataProps) => {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center ${className}`}
    >
      <img src={Nodata} className="w-[98px] h-[68px]" alt="" />
      <div className="text-[#838585] text-[12px] mt-[16px]">No data</div>
    </div>
  );
};

export default NoData;

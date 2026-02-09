import { useState } from "react";
import CustomButton from "../CustomButton";
import Modal from "@mui/material/Modal";
const ChoosePackage = () => {
  const [data, setData] = useState<any[]>([{}, {}, {}]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  return (
    <div className="w-[1091px] h-[669px] rounded-[26px] bg-[#0e0d12] flex flex-col items-center ">
      <div className="text-[40px] text-[#fff] font-bold leading-[52px] mt-[47px] flex items-center">
        Choose Your Credit Package
        <div className="w-[111px] h-[45px] bg-[#4cd964] font-medium text-[#000] text-[24px] rounded-full ml-[20px] flex items-center justify-center">
          40% Off
        </div>
      </div>

      <div className="flex items-center mt-[47px] gap-[58px]">
        {data.map((item, index) => (
          <div
            key={index}
            className="w-[276px] h-[378px] bg-[#1c1c24] relative text-[24px] rounded-[25px] cursor-pointer  text-[#fff] flex flex-col items-center justify-center px-[46px] text-center"
            onClick={() => setActiveIndex(index)}
            style={{
              border:
                activeIndex === index
                  ? "4px solid #4cd964"
                  : "1px solid #4e1ea0",
            }}
          >
            {index === 1 && (
              <div className="absolute left-[50%] translate-x-[-50%] top-[-20px] w-[147px] h-[36px] bg-[#4a23cc] rounded-[8px] flex items-center justify-center text-[18px] font-medium">
                Most Popular
              </div>
            )}
            {index === 2 && (
              <div className="absolute left-[50%] translate-x-[-50%] top-[-20px] w-[147px] h-[36px] bg-[#ff9500] rounded-[8px] flex items-center justify-center text-[18px] font-medium">
                Best Price
              </div>
            )}
            <div>League of ROOKIE</div>
            <div className="text-[32px] font-medium mt-[10px]">$99</div>
            <div className="text-[18px] font-medium mt-[6px]">for</div>
            <div className="text-[18px] font-bold mt-[9px]">100 Token</div>
            <div className="text-[14px] text-[#fff] mt-[10px] text-center">
              Equivalent to 1 Mock with Banker session
            </div>
          </div>
        ))}
      </div>

      <CustomButton className="mt-[20px] w-[169px] h-[48px] !text-[18px] bg-[#4cd964] hover:text-[#4cd964]">
        Continue
      </CustomButton>
    </div>
  );
};

const ChoosePackageMask = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <ChoosePackage />
      </div>
    </Modal>
  );
};

export default ChoosePackageMask;

import { Box } from "@mui/material";
import AddImg from "@/assets/form/add.png";
import Card from "../Card";
import { useRef, useState } from "react";
import { uploadFile } from "@/services/gameService";
import { toast } from "../Toast";
import { Loading } from "../Loading";
import CloseImg from "@/assets/modal/close.png";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

const Upfile = ({ onChange, name, className }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const onUpfile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size cannot exceed 2MB");
      return;
    }

    const formData = new FormData();
    // Add file
    formData.append("file", file);
    setLoading(true);
    const res = await uploadFile(formData);
    setLoading(false);
    setUrl(res?.url);
    if (name) {
      onChange({ target: { name, value: res?.url } });
    } else {
      onChange(res?.url);
    }
  };
  return (
    <>
      {loading && <Loading></Loading>}
      {!loading &&
        (url ? (
          <div className="relative w-fit">
            <img
              onClick={() => ref.current?.click()}
              src={url}
              alt="file"
              className="w-[90px] h-[90px] object-cover cursor-pointer"
            ></img>
            <img
              src={CloseImg}
              alt="close"
              className="w-[16px] h-[16px] cursor-pointer absolute top-[0px] right-[0px] translate-x-[50%] translate-y-[-50%] bg-[#ffffff33] rounded-full"
              onClick={() => setUrl("")}
            ></img>
          </div>
        ) : (
          <Card
            className="flex justify-center items-center h-[90px] cursor-pointer"
            onClick={() => ref.current?.click()}
          >
            <div className="flex flex-col items-center">
              <img
                className="w-[16px] h-[16px] mb-[10px]"
                src={AddImg}
                alt="add"
              />
              <div className="text-[14px] text-[#fff] opacity-40 leading-[18px]">
                Choose File
              </div>
              <div className="text-[12px] text-[#fff] opacity-40 leading-[18px]">
                Upload game cover(PNG/JPG, max 2MB)
              </div>
            </div>
          </Card>
        ))}
      <input
        ref={ref}
        accept=".png,.jpg"
        type="file"
        hidden
        onChange={onUpfile}
      />
    </>
  );
};

export default Upfile;

interface CrosswiseUpfileProps {
  onChange: (uploadObj: any) => void;
}
export const CrosswiseUpfile = ({ onChange }: CrosswiseUpfileProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const onUpfile = async (e) => {
    const file = e.target.files?.[0];

    if (!file?.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const formData = new FormData();
    // Add file
    formData.append("file", file);
    const res = await uploadFile(formData);
    onChange({
      url: res?.url,
      fileName: file.name,
    });
    return;
  };
  return (
    <Card
      className="flex justify-center items-center h-[42px] cursor-pointer border-dashed border-[2px] !p-[0px] !rounded-[12px]"
      onClick={() => ref.current?.click()}
    >
      <div className="flex  items-center">
        <img className="w-[16px] h-[16px] mr-[10px]" src={AddImg} alt="add" />
        <div className="text-[14px] text-[#fff] opacity-40 leading-[18px]">
          Choose File
        </div>
        <input ref={ref} type="file" hidden onChange={onUpfile} />
      </div>
    </Card>
  );
};

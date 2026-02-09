import Input, { TextField } from ".";
import { Button } from "../Button";
import { DeleteSvg } from "../Svg/delete";

export const ListInput = ({ value = [], onChange, name, placeholder }: any) => {
  const handleChange = (index: number, val: string) => {
    const newList = [...value];
    newList[index] = val;
    if (name) {
      onChange({ target: { name, value: newList } });
    } else {
      onChange(newList);
    }
  };
  const handleAdd = () => {
    const newList = [...value];
    newList.push("");
    if (name) {
      onChange({ target: { name, value: newList } });
    } else {
      onChange(newList);
    }
  };

  const handleDelete = (index: number) => {
    const newList = [...value];
    newList.splice(index, 1);
    if (name) {
      onChange({ target: { name, value: newList } });
    } else {
      onChange(newList);
    }
  };
  return (
    <div className="flex flex-col  gap-[8px]">
      {value?.map?.((item, index) => (
        <div key={index} className="flex items-center">
          <TextField
            className="!w-[600px] !p-0 !h-fit"
            multiline
            rootSx={{
              padding: "8px 16px",
            }}
            height='fit-content'
            placeholder={placeholder}
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
          ></TextField>
          <DeleteSvg
            onClick={() => handleDelete(index)}
            className="cursor-pointer ml-[12px]"
          ></DeleteSvg>
        </div>
      ))}
      <Button
        variant="outlined"
        className=" !w-fit !text-[#FFFFFFcc] !text-[14px] !border-[#FFFFFF33]"
        color="#FFFFFF33"
        onClick={handleAdd}
      >
        Add More
      </Button>
    </div>
  );
};

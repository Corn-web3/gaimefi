import Formation from "@/components/Formation";
const Generate = () => {
  return (
    <div
      className=" w-full min-h-screen overflow-x-hidden flex flex-col items-center custom"
      style={{
        background: "#101515",
      }}
    >
      <div
        className="w-full "
        style={{
          width: "1440px",
        }}
      >
        <div className="w-full px-[120px] flex items-center justify-center h-[100vh]">
          <Formation title="Cooking..." />
        </div>
      </div>
    </div>
  );
};

export default Generate;

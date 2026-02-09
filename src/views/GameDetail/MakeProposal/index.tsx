import CustomInput from "@/components/CustomInput";
import CustomTextarea from "@/components/Textarea";
import { TextField } from "@/components/input";
import ModelPopup from "@/components/ModelPopup";
import { useEffect, useState } from "react";
import { toast } from "@/components/Toast";
import { publishGame } from "@/services/gameService";
import { createProposal } from "@/services/proposal";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const MakeProposal = ({
  cacheCurrentGame,
  open,
  onClose,
}: {
  cacheCurrentGame: any;
  open: boolean;
  onClose: () => void;
}) => {
  const [proposalName, setProposalName] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const navigate = useNavigate();
  const onSubmit = debounce(() => {
    if (!cacheCurrentGame?.id) {
      toast.error("Without any changes");
      return;
    }
    createProposal({
      chatRecordId: cacheCurrentGame?.id,
      name: proposalName,
      description: proposalDescription,
    }).then((res) => {
      toast.success("Proposal submitted successfully");
      onClose();
      navigate(-1);
    });
  },500);

  useEffect(() => {
    if (!open) {
      setProposalName("");
      setProposalDescription("");
    }
  }, [open]);
  return (
    <ModelPopup
      open={open}
      onClose={onClose}
      title="Create New Proposal"
      onClickSubmit={onSubmit}
      confirmText="Submit Proposal"
    >
      <div className="w-full  mt-[24px] flex flex-col">
        <div className="text-[14px] text-[#ffffff] mb-[16px]">
          Title
        </div>
        <TextField
          value={proposalName}
          placeholder="Enter a short,descriptive title(max 50 chars)"
          className="!w-full "
          maxLength={50}
          onChange={(e) => setProposalName(e.target.value)}
          errorMessage={undefined}
          startAdornment={undefined}
        />
        <div className="text-[14px] text-[#ffffff] my-[16px]">
          Description
        </div>
        <CustomTextarea
          showCount={false}
          placeholder="Describe your suggested changes and why they would improve the game(max 500 chars)"
          className="!w-full !h-[90px]"
          maxLength={500}
          value={proposalDescription}
          onChange={(e) => setProposalDescription(e.target.value)}
        />
      </div>
    </ModelPopup>
  );
};

export default MakeProposal;

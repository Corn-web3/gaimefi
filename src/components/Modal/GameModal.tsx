import { CardModal } from ".";
import RenderGameByCode from "../EditorView/RenderGameByCode";

export default function GameModal({ open, onClose, code, title }) {
  return (
    <CardModal
      title={title}
      open={open}
      onClose={onClose}
      cardClassName={"w-[840px] h-[800px]"}
    >
      <RenderGameByCode code={code}></RenderGameByCode>
    </CardModal>
  );
}

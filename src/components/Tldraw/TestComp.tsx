import {  Rectangle2d, ShapeUtil, TldrawUiButton } from "tldraw";
import { TLBaseShape } from "tldraw";
import { Input } from "@mui/material";
type CardShape = TLBaseShape<
  "select",
  { w: number; h: number; isLocked: boolean }
>;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export class CardShapeUtil extends ShapeUtil<CardShape> {
  static override type = "shape" as const;
  static id = "shape:card11" as const;

  public getDefaultProps(): CardShape["props"] {
    return {
      isLocked: true,
      w: 100,
      h: 100,
    };
  }

  getGeometry(shape: CardShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: CardShape,...e) {
    console.log(shape,e,'ssssssssss');
    return (
      <div {...shape} className="w-full h-full flex justify-center items-center">
        <Input onPointerDown={(e) => e.stopPropagation()}></Input>
        <TldrawUiButton type={"danger"}>789</TldrawUiButton>
      </div>
    );
  }

  indicator(shape: CardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

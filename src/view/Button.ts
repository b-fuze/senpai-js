import { ISprite, ISpriteProps, Sprite } from "./Sprite";
import { loadImage, ITextureMap, ILoadProps, createTextureMap } from "../util";

import assert from "assert";

export interface IButton extends ISprite {
  selected: boolean;
  font: string;
  fontColor: string;
  fontSize: number;
  text: string;
}

export interface IButtonProps extends ISpriteProps {
  selected?: boolean;
  font?: string;
  fontColor?: string;
  fontSize?: number;
  text?: string;
}

export class Button extends Sprite implements IButton {
  public selected: boolean = false;
  public font: string = "monospace";
  public fontColor: string = "black";
  public fontSize: number = 12;
  public text: string =  "";

  constructor(props: IButtonProps) {
    super(props);
    this.selected = props.selected || false;
    this.font = props.font || this.font;
    this.fontColor = props.fontColor || this.fontColor;
    this.fontSize = props.fontSize || this.fontSize;
    this.text = props.text || this.text;
  }

  public update(): void {
    const active = this.active ? "Active" : "Inactive";
    const hover = this.hover ? "Hover" : "NoHover";
    const selected = this.selected ? "Selected" : "Unselected";
    this.setTexture(`${active}_${hover}_${selected}`);

    this.cursor = this.hover ? "pointer" : "default";
    super.update();
  }

  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
    ctx.translate(this.texture.width * 0.5, this.texture.height * 0.5);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.text, 0, 0);
  }
}

export interface ILoadButtonProps extends IButtonProps, ILoadProps {

}

export async function loadButton(props: ILoadButtonProps): Promise<IButton> {
  const img = loadImage(props.src);
  const textures: ITextureMap = await createTextureMap(props.definition, img);

  ["Active", "Inactive"].forEach(active => {
    ["Hover", "NoHover"].forEach(hover => {
      ["Selected", "Unselected"].forEach(selected => {
        assert(textures[`${active}_${hover}_${selected}`]);
      });
    });
  });

  props.textures = textures;
  const button = new Button(props);

  return button;
}

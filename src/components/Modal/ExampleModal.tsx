import { CardModal, Modal } from ".";
import Card from "../Card";
import LogoImg from "@/assets/icon/logo.png";
import { TextField } from "../input";
import { useState } from "react";
import { Underline } from "../Underline";
import { EM } from "../EM";
import GlowButton from "../GlowButton";
import { Button } from "../Button";


export const ExampleModal = ({ open, onClose }) => {
  const [list, setList] = useState([
    "Neon Strike is a fast-paced action shooter where players battle through neon-lit cyberpunk cities. Use your energy blade and plasma guns to defeat robotic enemies while dodging their attacks. The unique time-slow mechanic activates when you're not moving, letting you plan your next move strategically. Features dynamic combat, vibrant visuals, and an original synthwave soundtrack.",
    "Color Match is a casual puzzle game that tests your reflexes and color recognition skills. Tap to match falling orbs with the correct color zones, creating satisfying chain reactions. Progress through 50 increasingly challenging levels, unlock new color patterns, and compete for high scores. Perfect for quick play sessions with its simple controls but challenging mastery curve.",
    "Bubble Garden is a relaxing puzzle game about growing and connecting magical plants. Match three or more bubbles of the same color to make flowers bloom and create beautiful garden patterns. As your garden grows, unlock new plant species and special power-ups that create dazzling chain reactions. With simple touch controls and no time pressure, it's the perfect game to unwind while exercising your puzzle-solving skills. Each level brings new challenges and stunning visual rewards as your garden comes to life.",
    // 4,
  ]);
  return (
    <div>
      <CardModal
        title={"Tips for Writing Great Game Descriptions"}
        open={open}
        onClose={onClose}
        cardClassName={"w-[640px]"}
      >
        <div className="text-[14px] leading-[22px] text-[#fff] opacity-[0.8] mb-[24px]">
          <div>A good game description should include:</div>
          <div>• Core Gameplay - What players do in your game</div>
          <div>• Controls - How players interact with the game</div>
          <div>• Goals - What players aim to achieve</div>
          <div>• Features - What makes your game special</div>
          <div>• Style - Visual and audio elements</div>
        </div>
        <div className="flex flex-col gap-[8px]">
          {list.map((item, index) => (
            <Card
              className="text-[#FFFFFFCC] text-[14px] leading-[22px]"
              key={index}
            >
              <div className="mb-[6px]">Sample {index + 1}</div>
              <div>{item}</div>
            </Card>
          ))}
          <Card className="text-[#FFFFFFCC] text-[14px] leading-[22px]">
            <div className="mb-[6px]">Sample 4</div>
            <div>
              Dragon's Legacy is a turn-based strategy RPG where you lead a band
              of mercenaries in a war-torn fantasy realm. Recruit unique
              characters, each with their own abilities and storylines. Engage
              in tactical grid-based combat where positioning and skill
              combinations are key to victory. Features include:
            </div>
            <div>• Deep character progression system</div>
            <div>• Procedurally generated missions</div>
            <div>• Dynamic weather affecting battle conditions</div>
            <div>• Multiple storyline paths based on your choices The game combines classic RPG elements with modern strategic depth, creating a challenging but rewarding experience.</div>
          </Card>
        </div>
        <div className="flex  justify-between mt-[24px]">
          <GlowButton className="w-full h-[56px]" onClick={onClose}>
            I know
          </GlowButton>
        </div>
      </CardModal>
    </div>
  );
};

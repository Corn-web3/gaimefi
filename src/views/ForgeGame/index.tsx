// @ts-ignore
import React, { useEffect, useState } from "react";
import { TextField } from "@/components/input";
import { FormLabel } from "@/components/FormLabel";
import { useForm } from "@/components/Form";
import { FormItem } from "@/components/Form/FormItem";
import MoneyImg from "@/assets/forgeGame/$.png";
import RightArrowImg from "@/assets/forgeGame/right-arrow.png";
import Card from "@/components/Card";
import Select from "@/components/Select";
import Upfile from "@/components/Upfile";
import DiscordImg from "@/assets/icon/discord.png";
import TelegramImg from "@/assets/icon/telegram.png";
import TwitterImg from "@/assets/icon/twitter.png";
import WebsiteImg from "@/assets/icon/website.png";
import { MoreOptions } from "./MoreOptions";
import GlowButton from "@/components/GlowButton";
import { getGameType, createGame, newGame } from "@/services/gameService";
import { Link } from "@/components/Link";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { imEvent, useEvent } from "@/utils/ImEvent";
import { ExampleModal } from "@/components/Modal/ExampleModal";
import { toast } from "@/components/Toast";
import { ChooseGameModal } from "@/components/Modal/ChooseGaimeModal";
import { trackEvent } from "@/utils/trackEvent";
export const config = [
  {
    name: "name",
    label: "Name",
    placeholder: "Enter your game name (1-30 characters)",
    required: true,
    component: (props) => <TextField maxLength={30} {...props}></TextField>,
  },
  {
    name: "ticker",
    label: "Ticker",
    placeholder: "Enter token symbol(1-6 capitalletters)",
    required: true,
    rules: [
      {
        pattern: /^[A-Z]+$/,
        message: "Ticker must be uppercase letters",
      },
    ],
    component: (props) => (
      <TextField
        maxLength={6}
        toUppercase={true}
        startAdornment={
          <img className="w-[16px] h-[16px]" src={MoneyImg}></img>
        }
        {...props}
      ></TextField>
    ),
  },
  {
    name: "description",
    label: "Description",
    required: true,
    rules: [
      {
        max: 500,
        message: "Description must be 1-500 characters",
      },
    ],
    placeholder: "Describe your game in detail:gameplay,features,story...(1-500 characters)",
    tooltip:
      "Your description is the spell that brings your game to life! Be creative - our Agent will transform your words into playable magic.",
    labelExtra: () => {
      const onClick = () => {
        imEvent.trigger("onExample");
      };
      return <Link onClick={onClick}>Example</Link>;
    },
    component: (props) => (
      <TextField height="100px" multiline rows={4} showCount maxLength={500} minLength={50} {...props}></TextField>
    ),
  },
  {
    name: "gameType",
    label: "Game type",
    placeholder: "Choose your game genre",
    required: true,
    component: (props) => {
      const [options, setOptions] = useState([]);
      useEffect(() => {
        getGameType().then((res) => {
          setOptions(
            res.map((item) => ({ name: item.name, label: item.name }))
          );
        });
      }, []);
      return <Select options={options} {...props}></Select>;
    },
  },
  {
    name: "coverImageUrl",
    label: "Cover Image",
    required: true,
    component: (props) => <Upfile {...props}></Upfile>,
  },
  {
    name: "twitterLink",
    icon: <img className="w-[16px] h-[16px]" src={TwitterImg}></img>,
    label: "Twitter Link",
    placeholder: "Https://twitter.com/...",
    component: (props) => <TextField {...props}></TextField>,
  },
  {
    name: "telegramLink",
    icon: <img className="w-[16px] h-[16px]" src={TelegramImg}></img>,
    label: "Telegram link",
    placeholder: "Https://t.me/...",
    component: (props) => <TextField {...props}></TextField>,
  },
  {
    name: "discordLink",
    icon: <img className="w-[16px] h-[16px]" src={DiscordImg}></img>,
    label: "Discord link",
    placeholder: "Https://discord.gg/...",
    component: (props) => <TextField {...props}></TextField>,
  },
  {
    name: "websiteLink",
    icon: <img className="w-[16px] h-[16px]" src={WebsiteImg}></img>,
    label: "Website link",
    placeholder: "Https://...",
    component: (props) => <TextField {...props}></TextField>,
  },
];

export default function ForgeGame() {
  const {
    formValues,
    errors,
    handleChange,
    setFormValues,
    setErrors,
    validate,
  } = useForm({
    config,
  });
  const [chooseGameModalOpen, setChooseGameModalOpen] = useState(false);
  const navigate = useNavigate();
  const [exampleModalOpen, setExampleModalOpen] = useState(false);
  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    const res = await createGame({ ...formValues });
    trackEvent("create_token", {
      game_id: res?.id,
      game_name: formValues.name,
    });
    return res?.id
  };


  // useEffect(() => {
  //   setFormValues({
  //     name: "Cosmic Quest",
  //     ticker: "CMSQ",
  //     description:
  //       "An epic space exploration game where players build interstellar empires, trade resources, and battle alien civilizations across a procedurally generated galaxy.",
  //     gameType: '3D',
  //     coverImageUrl: null,
  //     twitterLink: "https://twitter.com/cosmicquest",
  //     telegramLink: "https://t.me/cosmicquestofficial",
  //     discordLink: "https://discord.gg/cosmicquest",
  //     websiteLink: "https://www.cosmicquestgame.com",
  //   });
  // }, []);

  const getConfigItem = (name: string) => {
    return {
      ...config.find((item) => item.name === name),
      formValues,
      errors,
      handleChange,
    };
  };
  const onBack = () => {
    navigate("/");
  };

  useEvent("onExample", () => {
    setExampleModalOpen(true);
  });
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full">
          <div
            onClick={onBack}
            className="flex items-center text-[#707373] cursor-pointer w-fit"
          >
            <ChevronLeft className="text-[10px]" />
            <span className="text-[14px] ml-[6px] leading-[14px]">Back</span>
          </div>
        </div>
        <div className="text-[#fff] text-[24px] font-bold">Create New Game</div>
        <Card
          component="form"
          // onSubmit={handleSubmit}
          sx={{ width: 800, mx: "auto", mt: 4, color: "white" }}
        >
          <div className="flex">
            <FormItem
              {...getConfigItem("name")}
              className="!mr-[12px] !mt-[0]"
            />
            <FormItem {...getConfigItem("ticker")} className="!mt-[0]" />
          </div>

          <FormItem {...getConfigItem("description")} />
          <FormItem {...getConfigItem("gameType")} />
          <FormItem {...getConfigItem("coverImageUrl")} />
          <MoreOptions getConfigItem={getConfigItem} />

          <GlowButton
            onClick={() => {
              // handleSubmit();
              // toast.success("Forge a New Game");
              if (!validate()) {
                return;
              }
              setChooseGameModalOpen(true);
            }}
            className="!text-[18px] w-full font-bold text-[#001E1C]"
          >
            Next step
          </GlowButton>
        </Card>
      </div>
      <ExampleModal
        open={exampleModalOpen}
        onClose={() => {
          setExampleModalOpen(false);
        }}
      ></ExampleModal>

      <ChooseGameModal
        onSubmit={handleSubmit}
        open={chooseGameModalOpen}
        onClose={() => {
          setChooseGameModalOpen(false);
        }}
        values={formValues}
      ></ChooseGameModal>
      {/* <LoginModal open={true} onClose={() => {}}></LoginModal> */}
    </>
  );
}

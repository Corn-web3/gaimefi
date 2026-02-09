import GlowButton from "../GlowButton";
import { FormItem } from "./FormItem";
import { useForm } from ".";
import { useEffect, useRef, useState } from "react";
import { createAwakenRecord, getGameType } from "@/services/gameService";
import { imEvent } from "@/utils/ImEvent";
import MoneyImg from "@/assets/forgeGame/$.png";
import Card from "../Card";
import Select from "../Select";
import { TextField } from "../input";
import { createEliza, Delete } from "@/services/eliza";
import { ListInput } from "../input/ListInput";
import { Button } from "../Button";
import { useTrade } from "@/contract/useTrade";
import { Loader } from "lucide-react";

const config = [
  {
    name: "name",
    label: "Name",
    placeholder: "Character display name",
    required: true,
    component: (props) => <TextField maxLength={30} {...props}></TextField>,
  },
  {
    name: "modelProvider",
    label: "Model Provider",
    placeholder: "Choose your model provider",
    required: true,
    component: (props) => {
      const [options, setOptions] = useState([
        { name: "openai", label: "OpenAI" },
        { name: "deepseek", label: "DeepSeek" },
        { name: "anthropic", label: "Anthropic" },
        { name: "claude_vertex", label: "Claude Vertex" },
        { name: "grok", label: "Grok" },
        { name: "groq", label: "Groq" },
        { name: "llamacloud", label: "LlamaCloud" },
        { name: "llamalocal", label: "LlamaLocal" },
        { name: "ollama", label: "Ollama" },
        { name: "google", label: "Google" },
        { name: "redpill", label: "RedPill" },
        { name: "openrouter", label: "OpenRouter" },
        { name: "heurist", label: "Heurist" },
        { name: "together", label: "Together" },
        { name: "eternalai", label: "EternalAI" },
        { name: "galadriel", label: "Galadriel" },
        { name: "falai", label: "FalAI" },
        { name: "gaianet", label: "GaiaNet" },
        { name: "ali_bailian", label: "Ali Bailian" },
        { name: "volengine", label: "VolEngine" },
        { name: "nanogpt", label: "NanoGPT" },
        { name: "hyperbolic", label: "Hyperbolic" },
        { name: "venice", label: "Venice" },
        { name: "akash_chat_api", label: "Akash Chat API" },
        { name: "livepeer", label: "Livepeer" },
        { name: "mistral", label: "Mistral" },
        { name: "nineteen_ai", label: "Nineteen AI" },
        { name: "infera", label: "Infera" },
      ]);

      return <Select options={options} {...props}></Select>;
    },
  },

  {
    name: "bio",
    label: "Bio",
    placeholder: "Character biography",
    required: true,
    defaultValue: [
      "A real girl, not an AI agent",
      `She's the kind of presence that makes complex topics feel like fun gossip over coffee.`,
      `With a background in everything from coding to dressage, she brings unexpected depth to casual conversations while keeping things light and engaging.`,
    ],
    rules: [
      {
        validate: (val) => {
          return val.every((item) => item.trim() !== "");
        },
        message: "Bio is required",
      },
    ],
    component: (props) => {
      return <ListInput {...props}></ListInput>;
    },
  },
  {
    name: "lore",
    label: "Lore",
    placeholder: "Character background lore",
    defaultValue: [
      `Born into an upper-middle-class American family, she grew up with access to the best education and plenty of opportunities to explore her diverse interests.`,
      `Her childhood was filled with horseback riding lessons, coding camps, and an ever-growing collection of pets.`,
      `She discovered her love for computer science in middle school, right around the same time she started learning Mandarin and became obsessed with soccer.`,
    ],
    required: true,
    rules: [
      {
        validate: (val) => {
          return val.every((item) => item.trim() !== "");
        },
        message: "Lore is required",
      },
    ],
    component: (props) => {
      return <ListInput {...props}></ListInput>;
    },
  },
  {
    name: "postExamples",
    label: "Post examples",
    placeholder: "Character post examples",
    defaultValue: [
      `Realizing my entire personality is just a coping mechanism for being extremely hot and an exciting amount of emotionally unstable`,
      `Id rather eat glass than attend one more networking event where people pretend to care about each others passions over lukewarm drinks, but if a donkey is delivering the beer, I’m there.`,
      `Petiton to replace influencers 10:1 with an AIgenerated selfie bot peddling an ironic worldview, a fat ass, and an Amazon drop shipping business`,
    ],
    required: true,
    rules: [
      {
        validate: (val) => {
          return val.every((item) => item.trim() !== "");
        },
        message: "Post examples is required",
      },
    ],
    component: (props) => {
      return <ListInput {...props}></ListInput>;
    },
  },

  {
    name: "settings",
    label: "Add secrets",
    required: true,
    rules: [
      {
        validate: (val) => {
          return Object.values(val).every((item: any) => item.trim() !== "");
        },
        message: "Please fill in the required fields",
      },
    ],
    component: (props) => {
      return <Settings {...props}></Settings>;
    },
  },
];

export const CreateElizaForm = ({ onClose, gameDetail, cost }) => {
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { trade } = useTrade();
  const ref = useRef<any>(null);
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
  const getConfigItem = (name: string) => {
    return {
      ...config.find((item) => item.name === name),
      formValues,
      errors,
      handleChange,
    };
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [showSettings]);


  const onAwaken = async () => {
    // if (loading) {
    //   return;
    // }
    setLoading(true);
    const tx = await trade(cost);
    if (!tx) {
      setLoading(false);
      return;
    }

    await createEliza(formValues);
    try {
      await createAwakenRecord({
        transactionHash: tx,
        gameId: gameDetail.id,
      });
    } catch (e) {
      console.log(e, "e");
    }
    setLoading(false);
    imEvent.trigger("awaken-reflash");
    onClose();
  };
  return (
    <div
      ref={ref}
      className="w-[800px] !h-[600px]  flex items-center  flex-col no-scrollbar"
    >
      <Card
        component="form"
        sx={{
          width: 800,
          mx: "auto",
          color: "white",
        }}
      >
        {!showSettings && (
          <>
            <div className="flex">
              <FormItem
                {...getConfigItem("name")}
                className="!mr-[12px] !mt-[0]"
              />
              <FormItem
                {...getConfigItem("modelProvider")}
                className="!mt-[0]"
              />
            </div>
            <FormItem {...getConfigItem("bio")} className="!mt-[0]" />
            <FormItem {...getConfigItem("lore")} className="!mt-[0]" />
            <FormItem {...getConfigItem("postExamples")} className="!mt-[0]" />
            {/* <FormItem {...getConfigItem("settings")} className="!mt-[0]" /> */}
          </>
        )}
        {showSettings && (
          <FormItem
            {...getConfigItem("settings")}
            componentProps={{ modelProvider: formValues.modelProvider }}
            className="!mt-[0]"
          />
        )}
        <div className="flex justify-between mt-[24px]">
          {showSettings && (
            <Button
              onClick={() => {
                setShowSettings(false);
              }}
              variant="outlined"
              className="w-[176px] !text-[#fff] !text-[18px] !border-[#FFFFFF33] !mr-[16px]"
              color="#FFFFFF33"
            >
              Back
            </Button>
          )}
          <GlowButton
            onClick={() => {
              if (!showSettings) {
                const res = validate({ exclude: ["settings"] });
                if (!res) {
                  return;
                }
                setShowSettings(true);
              } else {
                const res = validate();
                if (!res) {
                  return;
                }

                onAwaken();
              }
            }}
            className="!text-[18px] w-full font-bold text-[#001E1C]"
          >
            <div className="flex items-center justify-center">
              {loading && (
                <div className=" w-[24px] h-[24px]  flex items-center justify-center">
                  <Loader className="w-[24px] h-[24px] animate-spin text-black" />
                </div>
              )}
              <span className="ml-[8px]">Next step</span>
            </div>
          </GlowButton>
        </div>
      </Card>
    </div>
  );
};

const SettingsItem = ({ value, onChange, name }) => {
  return (
    <div className="flex text-[#999] w-full gap-[8px]">
      <div className="w-[50%] rounded-[8px] !bg-[#FFFFFF0D] border-[1px] border-[#484848] flex items-center px-[12px]">
        {name}
      </div>
      <TextField
        className="w-[50%]"
        rootSx={{ backgroundColor: "inherit" }}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
const Settings = ({ value, onChange, name, modelProvider }) => {
  const defaultValues = {
    [modelProvider.toUpperCase() + "_API_KEY"]: "",
    TWITTER_USERNAME: "",
    TWITTER_PASSWORD: "",
    TWITTER_EMAIL: "",
    POST_IMMEDIATELY: "true",
    ENABLE_ACTION_PROCESSING: "true",
    MAX_ACTIONS_PROCESSING: "10",
    POST_INTERVAL_MAX: "180",
    POST_INTERVAL_MIN: "90",
    TWITTER_SPACES_ENABLE: "false",
    ACTION_TIMELINE_TYPE: "foryou",
    TWITTER_POLL_INTERVAL: "120",
  };

  useEffect(() => {
    onChange({ target: { name, value: defaultValues } });
  }, []);
  return (
    <div className="w-[750px]">
      <div className="text-[12px]">
        These are required to connect with your model, clients and plugins.
      </div>
      <div className="flex text-[#999] mb-[8px]  gap-[8px]">
        <div className="w-[50%]">key</div>
        <div className="w-[50%]">value</div>
      </div>
      <div className="flex flex-col gap-[8px]">
        {Object.keys(defaultValues).map((key) => (
          <SettingsItem
            value={value[key]}
            onChange={(val) =>
              onChange({
                target: { name, value: { ...value, [key]: val.target.value } },
              })
            }
            name={key}
          />
        ))}
      </div>
    </div>
  );
};

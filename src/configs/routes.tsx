// import LoginView from "../views/loginView";
import Home1 from "@/views/Home";
import Generate from "@/views/Generate";
import PublicLayout from "@/components/PublicLayout";
import Coin from "@/views/Coin";
import CreateToken from "@/views/Home/CreateToken";
import GameDetail from "@/views/GameDetail";
import ForgeGame from "@/views/ForgeGame";
import Demo from "@/views/Demo";
import Demo2 from "@/views/Demo2";
import TradingComponent from "@/views/SonicTest/index";
import Tldraw from "@/views/Tldraw";
import Tldraw2 from "@/views/Tldraw2";
import SonicTest from "@/views/SonicTest/index";
import VideoToCanvas from "@/views/VidoeToCanvas";

const isNoOpen = false;

const NoOpen = [
  // {
  //   path: "/home",
  //   type: "public",
  //   component: <Generate />,
  // },
  // {
  //   path: "/",
  //   type: "public",
  //   component: <Generate />,
  // },
];

const router = [
  {
    path: "/home",
    type: "public",
    component: (
      <PublicLayout>
        <Home1 />
      </PublicLayout>
    ),
  },
  {
    path: "/",
    type: "public",
    component: (
      <PublicLayout>
        <Home1 />
      </PublicLayout>
    ),
  },
  {
    path: "/coin/:id",
    type: "public",
    component: (
      <PublicLayout>
        <Coin />
      </PublicLayout>
    ),
  },
  {
    path: "/create-token",
    type: "public",
    component: (
      <PublicLayout>
        <CreateToken />
      </PublicLayout>
    ),
  },
  {
    path: "/game-detail/:id",
    auth: true,
    type: "public",
    component: (
      <PublicLayout>
        <GameDetail />
      </PublicLayout>
    ),
  },
  {
    path: "/forge-game",
    type: "public",
    component: (
      <PublicLayout>
        <ForgeGame />
      </PublicLayout>
    ),
  },
  {
    path: "/demo",
    type: "public",
    component: (
      <PublicLayout>
        <TradingComponent />
      </PublicLayout>
    ),
  },

  {
    path: "/video-to-canvas",
    type: "public",
    component: (
      <PublicLayout>
        <VideoToCanvas />
      </PublicLayout>
    ),
  },
  // {
  //   path: "/tldraw2",
  //   type: "public",
  //   component: (
  //     <PublicLayout>
  //       <Tldraw2 />
  //     </PublicLayout>
  //   ),
  // },
  // {
  //   path: "/demo2",
  //   type: "public",
  //   component: (
  //     <PublicLayout>
  //       <SonicTest />
  //     </PublicLayout>
  //   ),
  // },
];

export const routes = isNoOpen ? NoOpen : router;

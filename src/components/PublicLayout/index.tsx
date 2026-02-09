import { useLocation } from "react-router-dom";
import { routes as routesConfig } from "../../configs/routes";
import Header from "@/views/Home/Header";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavbarRoutes = routesConfig
    ?.filter((route) => route.type === "public")
    .map((route) => route.path);
  const showNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div
      className=" w-full min-h-screen overflow-x-hidden flex flex-col items-center custom"
      style={{
        background: "#020606",
      }}
    >
      <div
        className="w-full "
        style={{
          width: "1440px",
        }}
      >
        <Header />
        <div className="w-full px-[120px]">{children}</div>
      </div>
    </div>
  );
};

export default PublicLayout;

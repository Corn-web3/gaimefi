import ReactDOM from "react-dom/client";
import "./style/index.css";
import "./style/normalize.css";
import { createTheme, ThemeProvider, Button } from "@mui/material";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@privy-io/wagmi";
import { privyConfig } from "./config/privyConfig";
import { wagmiConfig } from "./config/wagmiConfig";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import App from "./App";

// Register duration plugin
dayjs.extend(duration);

const appid = process.env.REACT_APP_PRIVY_APP_ID || "cm6d22yrd012j7648z0x3eate";
const theme = createTheme({});
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Default: true
      retry: 1, // Default: 3
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    <PrivyProvider appId={appid} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <App />
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  </ThemeProvider>
);

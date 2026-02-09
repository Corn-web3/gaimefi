// KLineChartPro.tsx
import * as React from "react";
import { useEffect, useRef } from "react";
import { KLineChartPro, DefaultDatafeed } from "@klinecharts/pro";
// Import styles
import "@klinecharts/pro/dist/klinecharts-pro.css";
import CustomDatafeed from "./CustomDatafeed";
import { getKlineChart } from "@/services/gameService";
import { useParams } from "react-router-dom";

interface BaseTokenChartProps {
  alchemyApiKey: string;
  tokenAddress: string;
  tokenSymbol: string;
  pairAddress?: string;
  height?: string | number;
  gameDetail?: any;
}

const BaseTokenChart: React.FC<BaseTokenChartProps> = ({
  alchemyApiKey,
  tokenAddress,
  tokenSymbol,
  pairAddress,
  height = "600px",
  gameDetail,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  const init = () => {
    // 1. First check if ref exists
    if (!containerRef.current) return;
    const container = containerRef.current;
    getKlineChart(id as string, {
      unit: "minute",
    }).then((response) => {
      let precision = 5;
      if (response?.length > 0) {
        precision = countZerosAfterDecimal(response[0].c) + 2;
      }
      const options = {
        container: container as HTMLElement,
        theme: "dark",
        locale: "en",
        periods: [
          { text: "1m", timespan: "minute", multiplier: 1 },
          { text: "5m", timespan: "minute", multiplier: 5 },
          { text: "15m", timespan: "minute", multiplier: 15 },
          { text: "1H", timespan: "minute", multiplier: 60 },
          { text: "4H", timespan: "minute", multiplier: 240 },
          { text: "1D", timespan: "minute", multiplier: 1440 },
        ],
        symbol: {
          exchange: "Base",
          market: "crypto",
          shortName: `${gameDetail?.ticker}`,
          ticker: `${gameDetail?.ticker}/USD`,
          priceCurrency: "usdt",
          type: "crypto",
          pricePrecision: 5,
          volumePrecision: 5,
        },
        period: { multiplier: 15, timespan: "minute", text: "15m" },
        subIndicators: [],
        datafeed: new CustomDatafeed(id as string),
      };
      // Create instance
      chartRef.current = new KLineChartPro(options);
    });
  };
  const { id } = useParams();

  useEffect(() => {
    return () => {
      CustomDatafeed.destroy();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current && id) {
      init();
    }
    return () => {};
  }, []);

  return (
    <div style={{ width: "100%", height }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default BaseTokenChart;

function countZerosAfterDecimal(num) {
  const str = num.toString();
  const match = str.match(/\.(0+)/);
  return match ? match[1].length : 0;
}

import { Alchemy, HistoricalPriceInterval, Network } from "alchemy-sdk";
import {
  SymbolInfo,
  Period,
  DatafeedSubscribeCallback,
  Datafeed,
} from "@klinecharts/pro";
import { KLineData } from "klinecharts";
import { ethers, formatUnits } from "ethers";
import axios from "axios";
import { calculateDays } from "@/utils/calculateDays";
import { getKlineChart } from "@/services/gameService";

// Define K-line data structure
class CustomDatafeed implements Datafeed {
  private gameId: string;
  private static timer: any;

  constructor(gameId: string) {
    this.gameId = gameId;
  }

  // Search function implementation
  async searchSymbols(search?: string): Promise<SymbolInfo[]> {
    // Return fixed token info
    return [
      {
        ticker: search || "TOKEN/USD",
        name: search || "TOKEN/USD",
        shortName: (search || "TOKEN").split("/")[0],
        exchange: "Base",
        market: "crypto",
        priceCurrency: "USD",
        type: "crypto",
      },
    ];
  }

  // Get historical K-line data
  async getHistoryKLineData(
    symbol: SymbolInfo,
    period: Period,
    from: number,
    to: number
  ): Promise<KLineData[]> {
    const response = await getKlineChart(this.gameId, {
      range: period?.multiplier,
      startTime: from,
      endTime: to,
      unit: period?.timespan,
    });
    // Convert data format
    return response?.map((item) => ({
      timestamp: item.t, // Timestamp
      open: item.o, // Open price
      high: item.h, // High price
      low: item.l, // Low price
      close: item.c, // Close price
      volume: item?.v, // If backend does not provide volume
    }));
  }

  subscribe(
    symbol: SymbolInfo,
    period: Period,
    callback: DatafeedSubscribeCallback
  ): void {
    let data: any[] = [];
    if (CustomDatafeed.timer) {
      clearInterval(CustomDatafeed.timer);
      CustomDatafeed.timer = null;
    }
    const nowPeriod = period;
    CustomDatafeed.timer = setInterval(() => {
      let from = 0;
      if (nowPeriod?.timespan === "minute") {
        from = new Date().getTime() - nowPeriod?.multiplier * 60 * 1000;
      } else if (nowPeriod?.timespan === "hour") {
        from = new Date().getTime() - nowPeriod?.multiplier * 60 * 60 * 1000;
      }
      // Current time
      const to = new Date().getTime();
      getKlineChart(this.gameId, {
        range: nowPeriod?.multiplier,
        startTime: from,
        endTime: to,
        unit: nowPeriod?.timespan,
      }).then((response) => {
        // Convert data format
        data = response?.map((item) => ({
          timestamp: item.t, // Timestamp
          open: item.o, // Open price
          high: item.h, // High price
          low: item.l, // Low price
          close: item.c, // Close price
          volume: item?.v, // If backend does not provide volume
        }));
      });
      if (data?.length > 0) {
        const newData = data[data.length - 1];
        if (
          newData?.close == 0 ||
          newData?.high == 0 ||
          newData?.low == 0 ||
          newData?.open == 0
        ) {
          clearInterval(CustomDatafeed.timer);
          return;
        } else {
          callback(newData);
        }
      }
    }, 3000);
  }

  // Unsubscribe
  unsubscribe(symbol: SymbolInfo, period: Period): void {}

  // Destroy
  static destroy(): void {
    clearInterval(this.timer);
    this.timer = null;
  }
}

export default CustomDatafeed;

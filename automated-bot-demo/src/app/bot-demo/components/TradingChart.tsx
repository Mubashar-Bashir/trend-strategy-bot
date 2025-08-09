"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load TradingView script dynamically
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          width: "100%",
          height: 500,
          symbol: "BINANCE:BTCUSDT", // Example symbol
          interval: "15",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_legend: false,
          container_id: "tradingview_chart",
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return <div id="tradingview_chart" ref={containerRef} />;
}

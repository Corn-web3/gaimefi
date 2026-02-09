import { useEffect, useRef } from "react";
import { PAGInit } from "libpag";
import pagurl from "@/assets/video/1.pag";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    PAGInit().then((PAG) => {
      const url = "https://pag.qq.com/file/like.pag";

      fetch(url)
        .then((response) => response.arrayBuffer())
        .then(async (buffer) => {
          console.log(buffer);
          const pagFile = await PAG.PAGFile.load(buffer);
          const canvas = canvasRef.current;
          if (!canvas) return;
          canvas.width = pagFile.width();
          canvas.height = pagFile.height();
          const pagView = await PAG.PAGView.init(pagFile, canvas);
          if (!pagView) return;
          pagView.setRepeatCount(0);
          await pagView.play();
        });
    });
  }, [canvasRef]);
  return (
    <div className="App text-[#fff]">
      11100000
      <header className="App-header">
        <canvas id="pag" ref={canvasRef}></canvas>
      </header>
    </div>
  );
}

export default App;

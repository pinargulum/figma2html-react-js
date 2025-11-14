import { useState, useEffect, useMemo } from "react";
import NodeRenderer from "./renderer/NodeRenderer.jsx";
import { FIGMA_FILE_KEY } from "./config";
import { fetchFigmaFile } from "./services/figma";
import "./App.css";

function App() {
  // ---- State ----
  const [figmaData, setFigmaData] = useState(null);
  const [error, setError] = useState(null);

  // Figma REST API
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchFigmaFile(FIGMA_FILE_KEY);
        setFigmaData(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    load();
  }, []);

  // pick first canvas
  function getCanvas(doc) {
    const root = doc?.document;
    if (!root) return null;
    const children = root.children || [];
    return children.find((node) => node.type === "CANVAS") ?? root;
  }

  // collect Frame children
  function getFrames(canvas) {
    if (!canvas) return [];
    const children = canvas.children || [];
    const frameNodes = children.filter((node) => node.type === "FRAME");
    if (frameNodes.length) return frameNodes;
    return children[0] ? [children[0]] : []; // use first child if there is only one
  }

  // ---- Memoized current frame ----
  const rootFrame = useMemo(() => {
    if (!figmaData) return null;

    const document = figmaData.document;
    if (!document?.children) return null;

    const canvas =
      document.children.find((n) => n.type === "CANVAS") ||
      document.children[0];

    if (!canvas?.children) return null;

    // İsimden bulmayı dene, yoksa ilk FRAME'i al
    return (
      canvas.children.find(
        (n) => n.type === "FRAME" && n.name === "Sign in screen"
      ) ||
      canvas.children.find((n) => n.type === "FRAME") ||
      canvas.children[0]
    );
  }, [figmaData]);

  // Main UI
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#121212",
        color: "#ddd",
        placeItems: "center",
      }}
    >
      {/* top bar */}

      <div style={{ position: "sticky", zIndex: 5, display: "flex" }}>
              <label style={{ gap: "16px" }}>Frame
       
          <NodeRenderer node={rootFrame} />
        
        </label>
      </div>
    </div>
  );
}

export default App;

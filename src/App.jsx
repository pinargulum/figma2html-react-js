import { useState, useEffect, useMemo } from "react";
import NodeRenderer from "./renderer/NodeRenderer.jsx";
import "./App.css";

function App() {
  // ---- State ----
  const [figmaDoc, setFigmaDoc] = useState(null);
  const [frames, setFrames] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

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

  // load Figma json
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setErrorMsg("");

        const response = await fetch("/figma.json");
        if (!response.ok) {
          throw new Error(`Failled to load figma.json" (${response.status})`);
        }
        const data = await response.json();
        if (cancelled) return;

        setFigmaDoc(data);

        const canvas = getCanvas(data);
        const frameNodes = getFrames(canvas);
        setFrames(frameNodes);
        setSelectedIndex(0);
      } catch (err) {
        if (!cancelled) {
          console.error("Error while loading figma.json", err);
          setErrorMsg(String(err?.message || err));
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Memoized current frame ----
  const currentFrame = useMemo(() => {
    if (!figmaDoc || frames.length === 0) return null;
    const idx = Math.max(0, Math.min(selectedIndex, frames.length - 1));
    return frames[idx] ?? null;
  }, [figmaDoc, frames, selectedIndex]);

  // ---- Error and loading states ----
  if (errorMsg) {
    return (
      <div style={{ padding: 16, color: "#c33" }}>
        <b>Error:</b> {errorMsg}
      </div>
    );
  }
  if (!figmaDoc)
    return <div style={{ padding: 16 }}>Loading Figma File...</div>;
  if (!currentFrame) return <div style={{ padding: 16 }}> No Frame Found.</div>;
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
       
          <NodeRenderer node={currentFrame} />
        
        </label>
      </div>
    </div>
  );
}

export default App;

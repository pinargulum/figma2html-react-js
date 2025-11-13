import { useState, useEffect, useMemo } from "react";
import NodeRenderer from "./renderer/NodeRenderer.jsx";
import "./App.css";

function App() {
  // ---- State ----
  const [figmaDoc, setFigmaDoc] = useState(null);
  const [frameList, setFrameList] = useState([]);
  const [selectedIndex, setselectedIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // ---- Helper Function ----
 
    // load Figma json
    useEffect(() => {
      (async () => {
        try {
          setErrorMsg("");
          const response = await fetch("/figma.json")
          if (!response.ok)
            throw new Error(`Failled to load figma.json" (${response.status})`);

          const data = await response.json();
          setFigmaDoc(data);
          const canvas = (data.document.children || []).find((n) => n.type === "CANVAS") ?? data.document;
          const frames = (canvas.children || []).filter((n) => n.type === "FRAME");
          setFrameList(frames.length ? frames : [canvas.children?.[0]].filter(Boolean));
          setselectedIndex[0];
        } catch (err) {
          console.error("something went wrong while fetching data", err)
          setErrorMsg(String(err.message || err))
          }
        
      })();
     
    }, []);
  

  // ---- Memoized current frame ----

  const currentFrame = useMemo(() => {
    if (!figmaDoc || frameList.length === 0) return null;
    const safeIndex = Math.max(
      0,
      Math.min(selectedIndex, frameList.length - 1),
    );
    return frameList[safeIndex] ?? null;
  }, [figmaDoc, frameList, selectedIndex]);

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

  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#ddd" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          background: "rgba(18, 18, 18, .72",
          borderBottom: "1px solid #2a2a2a",
          backdropFilter: "blur(8px)",
        }}
      >
        <strong>Figma HTML (React)</strong>
        <span style={{ opacity: 0.6 }}>.</span>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {" "}
          Frame:
          <select
            value={selectedIndex}
            onChange={(e) => selectedIndex(Number(e.target.value))}
          >
            {frameList.map((frame, i) => (
              <option
                key={frame.id}
                value={i}
              >
                {frame.name || `Frame ${i + 1}`}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div
        style={{ display: "grid", placeItems: "center", padding: "32px 16px" }}
      >
        <div style={{ boxShadow: " 0 10px 30px rgba(0, 0, 0, .35)" }}>
          <NodeRenderer node={currentFrame} />
        </div>
      </div>
    </div>
  );
}

export default App;

import { useEffect, useMemo, useState } from "react";
import NodeRenderer from "./renderer/NodeRenderer";
//import { FIGMA_FILE_KEY } from "./config";
//import { fetchFigmaFile } from "./services/figma";
import figmaJson from "./figma.json";

export default function App() {
  const [figmaData, setFigmaData] = useState(null);
  const [error, setError] = useState(null);

  // Figma REST API
  useEffect(() => {
    function load() {
      try {
        //const data = await fetchFigmaFile(FIGMA_FILE_KEY);
        const data = figmaJson;
        setFigmaData(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    load();
  }, []);

  const rootFrame = useMemo(() => {
    if (!figmaData) return null;

    const document = figmaData.document;
    if (!document?.children) return null;

    const canvas =
      document.children.find((n) => n.type === "CANVAS") ||
      document.children[0];

    if (!canvas?.children) return null;

    return (
      canvas.children.find(
        (n) => n.type === "FRAME" && n.name === "Sign in screen",
      ) ||
      canvas.children.find((n) => n.type === "FRAME") ||
      canvas.children[0]
    );
  }, [figmaData]);

  // if thre is any loading errors
  if (error) {
    return (
      <div style={{ color: "red", padding: 200 }}>
        Error occured while loading the Figma file. Please try again later :{" "}
        {error}
      </div>
    );
  }

  if (!rootFrame || !rootFrame.absoluteBoundingBox) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          color: "white",
          alignItems: "center",
          paddingTop: 200,
        }}
      >
        Page is loading...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        padding: "32px 0",
        boxSizing: "border-box",
      }}
    >
      <label
        style={{
          display: "flex",
          paddingBottom: 8,
          color: "grey",
          fontSize: 12,
        }}
      >
        Frame
      </label>
      <NodeRenderer node={rootFrame} />
    </div>
  );
}

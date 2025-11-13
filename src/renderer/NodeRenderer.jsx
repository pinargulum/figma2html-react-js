import React from "react";
import { styleFromNode } from "./styleFromNode.js";

function getChildren(node) {
  return Array.isArray(node?.children) ? node.children : [];
}

function isVisible(node) {
  return node?.visible !== false;
}

//  renders a single Figma node and its children
function NodeRenderer({ node, origin }) {
  if (!node || !isVisible(node)) return null;

  
  const isFrameLike =
    node.type === "FRAME" ||
    node.type === "COMPONENT" ||
    node.type === "INSTANCE";

  // root frame / component container
  if (isFrameLike) {
    const bounds = node.absoluteBoundingBox || {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    // first frame becomes to reference point for children
    const frameOrigin = origin ?? bounds;
    const frameStyle = styleFromNode(node, frameOrigin);

    const containerStyle = {
      position: "relative",
      width: Math.round(bounds.width || 0),
      height: Math.round(bounds.height || 0),
      overflow: "hidden",
      background: "white",
      
    };

    if (frameStyle.background) {
      containerStyle.background = frameStyle.background;
    }

    if (frameStyle.borderRadius) {
      containerStyle.borderRadius = frameStyle.borderRadius;
    }

    if (frameStyle.boxShadow) {
      containerStyle.boxShadow = frameStyle.boxShadow;
    }

    return (
      <div
        style={containerStyle}
        data-node-id={node.id}
        data-node-name={node.name}
      >
        {getChildren(node).map((child) => (
          <NodeRenderer
            key={child.id}
            node={child}
            origin={frameOrigin}
          />
        ))}
      </div>
    );
  }
  // text nodes
  if (node.type === "TEXT") {
    const frameStyle = styleFromNode(node, origin);
    return (
      <div
        style={frameStyle}
        data-node-id={node.id}
      >
        {node.characters ?? ""}
      </div>
    );
  }
   const frameStyle = styleFromNode(node, origin);
return <div style={frameStyle}  data-node-id={node.id} />
}


export default NodeRenderer;

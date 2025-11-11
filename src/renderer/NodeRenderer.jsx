import React from "react";
import { styleFromNode } from "./styleFromNode";

function getChildren(node) {
  return Array.isArray(node?.children) ? node.children : [];
}

function isVisible(node) {
  return node?.visible !== false;
}

function NodeRenderer({ node }) {
  if (!node || !isVisible(node)) return null;

  const computedStyle = styleFromNode(node);

  if (node.type === "FRAME") {
    const bounds = node.absoluteBoundingBox ?? {};
    const containerStyle = {
      position: "relative",
      width: Math.round(bounds.width || 0),
      minHeight: Math.round(bounds.height || 0),
      overflow: "hidden",
      background: "transparent",
    };
    if (computedStyle.background || computedStyle.backgroundColor) {
      if (computedStyle.background) {
        containerStyle.background = computedStyle.background;
      }
      if (computedStyle.backgroundColor) {
        containerStyle.backgroundColor = computedStyle.backgroundColor;
      }
    }
    return (
      <div
        style={containerStyle}
        data-node-name={node.name}
        data-node-id={node.id}
      >
        {getChildren(node).map((child) => (
          <NodeRenderer
            key={child.id}
            node={child}
          />
        ))}
      </div>
    );
  }

  if (node.type === "TEXT") {
    // Text node'larında characters boş olabilir; en azından boş string bas
    const text = typeof node.characters === "string" ? node.characters : "";
    return (
      <div
        style={computedStyle}
        data-node-id={node.id}
        data-node-type="TEXT"
      >
        {text}
      </div>
    );
  }

  // Default: şekiller (RECTANGLE, ELLIPSE, LINE, POLYGON, vb.)
  // Görsel amaçlı olduklarından erişilebilirlik için gizli tutuyoruz.
  return (
    <div
      style={computedStyle}
      aria-hidden="true"
      data-node-id={node.id}
      data-node-type={node.type}
    />
  );
}
export default NodeRenderer

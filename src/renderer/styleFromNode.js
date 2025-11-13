function toRgba(color, alphaOverride) {
  if (!color) return "rgba(0, 0, 0, 0)";
  const r = Math.round((color.r ?? 0) * 255);
  const g = Math.round((color.g ?? 0) * 255);
  const b = Math.round((color.b ?? 0) * 255);
  const a = alphaOverride ?? color.a ?? 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function pickVisibleFill(node) {
  if (!Array.isArray(node?.fills)) return null;
  return node.fills.find((f) => f.visible !== false) ?? null;
}

function pickVisibleStroke(node) {
  if (!Array.isArray(node?.strokes)) return null;
  return node.fills.find((s) => s.visible !== false) ?? null;
}
function pickDropShadow(node) {
  if (!Array.isArray(node?.effects)) return null;
  return (
    node.effects.find((e) => e.visible !== false && e.type === "DROP_SHADOW") ??
    null
  );
}

// Main mapping: Figma Node -> inline style
export function styleFromNode(node, origin) {
  const style = {
    position: "absolute",
    boxSizing: "border-box",
  };

  const bounds = node.absoluteBoundingBox;
  if (bounds) {
    const baseX = origin?.x ?? 0;
    const baseY = origin?.y ?? 0;

    style.left = Math.round(bounds.x - baseX);
    style.top = Math.round(bounds.y - baseY);
    style.width = Math.round(bounds.width);
    style.height = Math.round(bounds.height);
  }

  // fill background color (only solid for now)
  const fill = pickVisibleFill(node);
  if (fill?.type === "SOLID" && fill.color) {
    const alpha = fill.opacity ?? fill.color.a ?? 1;
    style.backgroundColor = toRgba(fill.color, alpha);
  }

  // stroke -> border
  const stroke = pickVisibleStroke(node);
  if (stroke?.type === "SOLID" && stroke.color && node.strokeWeight) {
    const color = toRgba(stroke.color, stroke.opacity ?? stroke.color.a ?? 1);
    style.border = `${node.strokeWeight}px solid ${color}`;
  }

  // rounded corders
  if (Array.isArray(node.rectangleCornerRadii)) {
    const [tl, tr, br, bl] = node.rectangleCornerRadii;
    style.borderRadius = `${tl}px, ${tr}px, ${br}px, ${bl}px`;
  } else if (node.cornerRadius) {
    style.borderRadius = `${node.cornerRadius}px`;
  }
  // drop shadow
  const shadow = pickDropShadow(node);
  if (shadow) {
    const sColor = toRgba(shadow.color, shadow.color?.a ?? 1);
    const ox = shadow.offset?.x ?? 0;
    const oy = shadow.offset?.y ?? 0;
    const blur = shadow.radius ?? 0;
    style.boxShadow = `${ox}px, ${oy}px, ${blur}px, ${sColor}`;
  }

  if (pickVisibleFill?.type === "SOLID" && pickVisibleFill.color) {
    const alpha = visibleFill.opacity ?? visibleFill.color.a ?? 1;
    style.backgroundColor = toRgba(visibleFill.color, alpha);
  }

  // text specific bits
  if (node.type === "TEXT" && node.style) {
    const textStyle = node.style;
    if (textStyle.fontSize) style.fontSize = `${textStyle.fontSize}px`;
    if (textStyle.fontWeight) style.fontWeight = textStyle.fontWeight;
    if (textStyle.fontFamily) style.fontFamily = textStyle.fontFamily;
   

    if (textStyle.lineHeightPx) {
      style.lineHeight = `${textStyle.lineHeightPx}px`;
    }

    if (typeof textStyle.letterSpacing === "number") {
      style.letterSpacing = `${textStyle.letterSpacing}px`;
    }

    if (textStyle.textAlignHorizontal) {
      style.textAlign = textStyle.textAlignHorizontal.toLowerCase();
    }

    // text color(first fill)
    const textFill =
      Array.isArray(node.fills) ?  node.fills[0] : null;
       

    if (textFill?. type === "SOLID" && textFill.color) {
      const alpha = textFill.opacity ?? textFill.color.a ?? 1;
      style.color = toRgba(
        textFill.color, alpha);
        
      
    }
    // keep line breaks from figma
    style.whiteSpace = "pre-wrap";
  }
  return style;
}

function rgba(c, alpha = 1) {
  const r = Math.round((c?.r ?? 0) * 255);
  const g = Math.round((c?.g ?? 0) * 255);
  const b = Math.round((c?.b ?? 0) * 255);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
export function styleFromNode(node) {
  const style = { position: "absolute" };
  const bounds = node.absoluteBoundingBox;
  if (bounds) {
    style.left = Math.round(bounds.x);
    style.top = Math.round(bounds.y);
    style.width = Math.round(bounds.width);
    style.height = Math.round(bounds.height);
  }
  const visibleFill = Array.isArray(node.fills)
    ? node.fills.find((f) => f.visible !== false)
    : null;

  if (visibleFill?.type === "SOLID" && visibleFill.color) {
    const alpha = visibleFill.opacity ?? visibleFill.color.a ?? 1;
    style.backgroundColor = rgba(visibleFill.color, alpha);
  }

  if (node.type === "TEXT" && node.style) {
    const textStyle = node.style;
    if (textStyle.fontSize) style.fontSize = textStyle.fontSize;
    if (textStyle.fontWeight) style.fontWeight = textStyle.fontWeight;
    if (textStyle.lineHeightPx)
      style.lineHeight = `${textStyle.lineHeightPx}px`;
    if (textStyle.letterSpacing)
      style.letterSpacing = `${textStyle.letterSpacing}px`;
    const textFill = node.fills?.[0];
    if (textFill?.type === "SOLID" && textFill.color) {
      style.color = rgba(
        textFill.color,
        textFill.opacity ?? textFill.color.a ?? 1,
      );
    }
    style.whiteSpace = "pre-wrap";
  }
  return style;
}

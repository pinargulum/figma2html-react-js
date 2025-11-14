// Main mapping: Figma Node -> inline style
export function styleFromNode(node, parentBox) {
  const style = {
    boxSizing: "border-box",
  };

  const isText = node.type === "TEXT";

  // position: parents: relative, children: absolute
  if (node.absoluteBoundingBox) {
    const { x, y, width, height } = node.absoluteBoundingBox;

    if (parentBox) {
      // Children position base on parent`s frame
      style.position = "absolute";
      style.left = x - parentBox.x;
      style.top = y - parentBox.y;
    } else {
      // Root frame
      style.position = "relative";
    }

    style.width = width;
    style.height = height;
  }

  // fill background color, text color and gradient
  if (node.fills && node.fills.length > 0) {
    // first fill
    const fill = node.fills.find((f) => f.visible !== false) ?? node.fills[0];

    if (fill) {
      if (fill.type === "SOLID" && fill.color) {
        if (isText) {
          // Text color
          style.color = rgba(fill.color, fill.opacity);
        } else {
          // Box backgroundColor
          style.backgroundColor = rgba(fill.color, fill.opacity);
        }
      }
      // Linear gradient (only Sign in button)
      else if (
        !isText &&
        fill.type === "GRADIENT_LINEAR" &&
        Array.isArray(fill.gradientStops)
      ) {
        const stops = fill.gradientStops
          .map((stop) => {
            const color = rgba(stop.color);
            const pos = Math.round((stop.position ?? 0) * 100);
            return `${color} ${pos}%`;
          })
          .join(", ");

        // gradient left to right
        style.backgroundImage = `linear-gradient(90deg, ${stops})`;
      }
    }
  }

  // stroke (border)
  if (node.strokes && node.strokes.length > 0 && node.strokeWeight) {
    const stroke = node.strokes[0];
    if (stroke.type === "SOLID" && stroke.color) {
      style.border = `${node.strokeWeight}px solid ${rgba(
        stroke.color,
        stroke.opacity,
      )}`;
    }
  }

  // rounded corders / border radius
  // rounded corders / border radius
  let radiusValues = null;

  // if there is any rectangleCornerRadii
  if (
    Array.isArray(node.rectangleCornerRadii) &&
    node.rectangleCornerRadii.length === 4
  ) {
    radiusValues = node.rectangleCornerRadii;
  } else {
    const base = typeof node.cornerRadius === "number" ? node.cornerRadius : 0;

    const tl =
      typeof node.topLeftRadius === "number" ? node.topLeftRadius : base;
    const tr =
      typeof node.topRightRadius === "number" ? node.topRightRadius : base;
    const br =
      typeof node.bottomRightRadius === "number"
        ? node.bottomRightRadius
        : base;
    const bl =
      typeof node.bottomLeftRadius === "number" ? node.bottomLeftRadius : base;

    if (tl || tr || br || bl) {
      radiusValues = [tl, tr, br, bl];
    }
  }

  // apply to CSS
  if (radiusValues) {
    const [tl, tr, br, bl] = radiusValues;
    style.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
  }

  if (isText && node.style) {
    const s = node.style;

    style.whiteSpace = "pre-wrap";
    style.fontSize = s.fontSize;
    style.fontFamily = s.fontFamily;
    style.fontWeight = s.fontWeight;
    if (s.lineHeightPx) {
      style.lineHeight = `${s.lineHeightPx}px`;
    }

    // Flex container
    style.display = "flex";

    // Vertical(Top / Center / Bottom)
    if (s.textAlignVertical === "TOP") {
      style.alignItems = "flex-start";
    } else if (s.textAlignVertical === "BOTTOM") {
      style.alignItems = "flex-end";
    } else {
      style.alignItems = "center";
    }

    // Horizontal (Left / Center / Right)
    if (s.textAlignHorizontal === "CENTER") {
      style.justifyContent = "center";
      style.textAlign = "center";
    } else if (s.textAlignHorizontal === "RIGHT") {
      style.justifyContent = "flex-end";
      style.textAlign = "right";
    } else {
      style.justifyContent = "flex-start";
      style.textAlign = "left";
    }

    // Text backgroundColor
    style.backgroundColor = "transparent";

    // If no color comes from Figma
    if (!style.color) {
      style.color = "#000000";
    }
  }

  return style;
}

// Figma 0–1 RGB (CSS rgba)
function rgba(color, opacityOverride) {
  const alpha = opacityOverride ?? color.a ?? 1;
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

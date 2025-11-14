import { styleFromNode } from "./styleFromNode";

export default function NodeRenderer({ node, parentBox }) {
  const style = styleFromNode(node, parentBox);
  const isText = node.type === "TEXT";

  return (
    <div style={style}>
      {isText && node.characters}

      {node.children?.map((child) => (
        <NodeRenderer
          key={child.id}
          node={child}
          parentBox={node.absoluteBoundingBox}
        />
      ))}
    </div>
  );
}

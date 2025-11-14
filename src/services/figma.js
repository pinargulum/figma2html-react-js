import { FIGMA_TOKEN } from "../config";


export async function fetchFigmaFile(fileKey) {
  if (!FIGMA_TOKEN) {
    throw new Error("FIGMA_TOKEN missing – check your .env file");
  }

  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: {
      "X-Figma-Token": FIGMA_TOKEN,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Figma API error: ${res.status} ${text}`);
  }

  return await res.json();
}

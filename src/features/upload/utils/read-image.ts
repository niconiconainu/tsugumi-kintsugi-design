import {
  ACCEPTED_IMAGE_MIME_TYPES,
  MAX_IMAGE_EDGE_PX,
} from "@/constants/artifact/image";

export const isAcceptedImage = (file: File): boolean =>
  (ACCEPTED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type);

/**
 * 画像を長辺 1280px 以内へ縮小して data URL にする。
 * 原寸のまま送ると転送量が大きく、解析にも不要なので、ブラウザ側で落としてから送る。
 */
export const fileToResizedDataUrl = async (file: File): Promise<string> => {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_IMAGE_EDGE_PX / Math.max(bitmap.width, bitmap.height)
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Canvas 2D context is unavailable.");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", 0.82);
};

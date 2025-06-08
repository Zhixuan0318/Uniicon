import Replicate from "replicate";
import { createCanvas, loadImage } from "canvas";

export default async function clean(imageBuffer) {
  const base64 = imageBuffer.toString("base64");
  const dataUrl = `data:image/png;base64,${base64}`;

  const replicate = new Replicate();

  const outputUrl = await replicate.run(
    "smoretalk/rembg-enhance:4067ee2a58f6c161d434a9c077cfa012820b8e076efa2772aa171e26557da919",
    { input: { image: dataUrl } }
  );

  // Use global fetch (no import needed)
  const response = await fetch(outputUrl);
  const transparentBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(transparentBuffer);

  const img = await loadImage(buffer);

  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  return canvas.toBuffer("image/png");
}

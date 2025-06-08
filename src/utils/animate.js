import RunwayML from '@runwayml/sdk';
import "dotenv/config";

const mimeType = 'image/png';
const ratio = '960:960';
const duration = 5;
const interval = 5000;

export default async function animate(imageBuffer, description) {
  const client = new RunwayML({apiKey: process.env.RUNWAY});

  // Convert buffer to base64 string
  const base64String = imageBuffer.toString('base64');

  // Construct data URL for the image
  const promptImage = `data:${mimeType};base64,${base64String}`;

  // Combine prompt template with description
  const promptText = `${description}. No camera movement. No zoom.`

  // Create a new image-to-video task
  const imageToVideo = await client.imageToVideo.create({
    model: 'gen4_turbo',
    promptImage,
    promptText,
    ratio,
    duration,
  });

  const taskId = imageToVideo.id;

  // Polling loop for task status
  let task;
  do {
    await new Promise(resolve => setTimeout(resolve, interval));
    task = await client.tasks.retrieve(taskId);
  } while (!['SUCCEEDED', 'FAILED'].includes(task.status));

  if (task.status === 'FAILED') {
    throw new Error(`RunwayML task failed: ${task.error}`);
  }

  return task;
}

export default function handler(req: any, res: any) {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;
  return res.status(200).json({
    status: "ok",
    platform: "Facilissimo Web App Studio (Vercel Serverless)",
    hasApiKey: !!apiKey,
  });
}

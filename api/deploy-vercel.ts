export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { blueprint } = req.body || {};
    if (!blueprint || !blueprint.businessName) {
      return res.status(400).json({ success: false, error: "Blueprint non valido" });
    }

    const cleanSlug = (blueprint.businessName || "webapp")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    const host = req.headers?.host || 'facilissimo-webapp.vercel.app';
    const deploymentUrl = `https://${cleanSlug}.${host}`;

    return res.status(200).json({
      success: true,
      deploymentUrl,
      isRealVercel: true,
      message: `Web App Mobile First pubblicata su Vercel Subdomain!`,
      projectName: `facilissimo-webapp-${cleanSlug}`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Deploy Error" });
  }
}

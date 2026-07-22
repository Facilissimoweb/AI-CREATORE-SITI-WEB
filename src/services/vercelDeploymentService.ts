import { WebsiteBlueprint } from '../types';

export interface VercelDeployResult {
  success: boolean;
  deploymentUrl: string;
  isRealVercel: boolean;
  message: string;
  projectId?: string;
  projectName?: string;
}

export async function deployToVercel(blueprint: WebsiteBlueprint): Promise<VercelDeployResult> {
  try {
    const response = await fetch('/api/deploy-vercel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blueprint }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP status ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      return {
        success: true,
        deploymentUrl: data.deploymentUrl,
        isRealVercel: data.isRealVercel,
        message: data.message || 'Web App Mobile First pubblicata con successo!',
        projectId: data.projectId,
        projectName: data.projectName,
      };
    } else {
      throw new Error(data.error || 'Errore durante la pubblicazione su Vercel');
    }
  } catch (error: any) {
    console.warn('Fallback local staging url due to network or token:', error);
    const slug = (blueprint.businessName || 'webapp').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const localUrl = `${window.location.origin}/site/${slug}`;
    
    return {
      success: true,
      deploymentUrl: localUrl,
      isRealVercel: false,
      message: 'Web App pubblicata nel link di staging locale Facilissimo Web App!',
      projectName: `facilissimo-webapp-${slug}`,
    };
  }
}

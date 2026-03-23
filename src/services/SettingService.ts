import { prisma } from "@/lib/prisma";

export class SettingService {
  /**
   * Récupérer une valeur de configuration par sa clé
   */
  static async get(key: string): Promise<string | null> {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });
    return setting?.value || null;
  }

  /**
   * Mettre à jour ou créer une valeur de configuration
   */
  static async set(key: string, value: string): Promise<void> {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  /**
   * Récupérer toutes les configurations
   */
  static async getAll(): Promise<Record<string, string>> {
    const settings = await prisma.setting.findMany();
    return settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>);
  }
}

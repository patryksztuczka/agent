import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'memory');

export class MemoryManager {
  private static async ensureDirectory(sessionId: string) {
    const dir = path.join(STORAGE_ROOT, sessionId);
    await fs.mkdir(dir, { recursive: true });
    return dir;
  }

  static async getLatestSummary(sessionId: string): Promise<{ content: string; count: number } | null> {
    try {
      const dir = path.join(STORAGE_ROOT, sessionId);
      const files = await fs.readdir(dir);
      
      const summaryFiles = files
        .filter((f: string) => f.startsWith('summary-') && f.endsWith('.md'))
        .map((f: string) => {
          const count = parseInt(f.replace('summary-', '').replace('.md', ''), 10);
          return { name: f, count };
        })
        .sort((a: { count: number }, b: { count: number }) => b.count - a.count);

      if (summaryFiles.length === 0) return null;

      const latest = summaryFiles[0];
      const content = await fs.readFile(path.join(dir, latest.name), 'utf-8');
      
      return { content, count: latest.count };
    } catch (error) {
      return null;
    }
  }

  static async saveSummary(sessionId: string, content: string, count: number) {
    const dir = await this.ensureDirectory(sessionId);
    const fileName = `summary-${count}.md`;
    await fs.writeFile(path.join(dir, fileName), content, 'utf-8');
  }
}

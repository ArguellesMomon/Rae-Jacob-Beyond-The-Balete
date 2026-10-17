export const stored = new Map<string, string>();
export default {
  async getItem(key: string) { return stored.get(key) ?? null; },
  async setItem(key: string, value: string) { stored.set(key, value); },
};

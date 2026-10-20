const appListeners = new Set<(state: string) => void>();
const backListeners = new Set<() => boolean>();
export const Platform = { OS: 'ios' };
export const View='native-view';
export const StyleSheet={absoluteFill:{position:'absolute',left:0,right:0,top:0,bottom:0}};
export const AppState = { addEventListener: (_: string, listener: (state: string) => void) => { appListeners.add(listener); return { remove: () => appListeners.delete(listener) }; } };
export const BackHandler = { addEventListener: (_: string, listener: () => boolean) => { backListeners.add(listener); return { remove: () => backListeners.delete(listener) }; } };
export function emitAppState(state: string) { for (const listener of appListeners) listener(state); }
export function emitBack() { return [...backListeners].reverse().some(listener => listener()); }

import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Mock native services and bundled-asset boundaries while exercising real hooks,
// gameplay state, persistence, and both audio adapters.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'expo-audio') return nextResolve(new URL('./mocks/audio.ts', import.meta.url).href, context);
    if (specifier === 'expo-asset') return nextResolve(new URL('./mocks/audio-assets.ts', import.meta.url).href, context);
    if (specifier === './catalog' && /\/src\/audio\/playback(\.web)?\.ts$/.test(context.parentURL ?? '')) return nextResolve(new URL('./mocks/audio-assets.ts', import.meta.url).href, context);
    if (specifier === 'react-native') return nextResolve(new URL('./mocks/native.ts', import.meta.url).href, context);
    if (specifier === '@react-native-async-storage/async-storage') return nextResolve(new URL('./mocks/storage.ts', import.meta.url).href, context);
    if (specifier.startsWith('.') && context.parentURL?.endsWith('.ts') && !/\.[a-z]+$/i.test(specifier)) {
      const candidate = new URL(specifier + '.ts', context.parentURL);
      if (existsSync(fileURLToPath(candidate))) return nextResolve(candidate.href, context);
    }
    return nextResolve(specifier, context);
  },
});

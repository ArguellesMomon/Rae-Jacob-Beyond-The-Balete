export const AUDIO_SOURCES = Object.fromEntries(['afternoon', 'silong', 'garden', 'forest', 'water', 'tap', 'step', 'push', 'lever', 'bell', 'clang', 'found', 'crossing', 'hooves', 'complete'].map(source => [source, source]));
export const Asset = { fromModule: (source: string) => ({ uri: `asset://${source}.wav` }) };

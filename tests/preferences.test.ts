import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { act, create } from 'react-test-renderer';
import type { ReactTestRenderer } from 'react-test-renderer';
import { usePreferences } from '../src/hooks/usePreferences.ts';
import { PREFERENCES_KEY } from '../src/game/preferences.ts';
import { stored } from './mocks/storage.ts';
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

test('sound and camera choices save independently of adventure progress and survive remounting', async () => {
  stored.clear(); stored.set('@rae-jacob/adventure/v2', 'keep this journey');
  let options!: ReturnType<typeof usePreferences>, renderer!: ReactTestRenderer;
  function Harness() { options = usePreferences(); return null; }
  const mount = async () => { await act(async () => { renderer = create(createElement(Harness)); }); };
  await mount();
  try {
    assert.equal(options.ready, true);
    await act(async () => { options.update({ music: 0 }); options.update({ gentleCamera: false }); options.update({ waterMotion: false, ambientMotion: false, largeText: true }); options.update({ effects: .32 }); });
    assert.equal(stored.get('@rae-jacob/adventure/v2'), 'keep this journey');
    assert.deepEqual(JSON.parse(stored.get(PREFERENCES_KEY)!), { music: 0, effects: .32, gentleCamera: false, waterMotion: false, ambientMotion: false, largeText: true });
    await act(async () => renderer.unmount()); await mount();
    assert.deepEqual(options.preferences, { music: 0, effects: .32, gentleCamera: false, waterMotion: false, ambientMotion: false, largeText: true });
  } finally { await act(async () => renderer.unmount()); }
});

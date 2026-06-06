import { describe, expect, it, vi, beforeEach } from 'vitest';

/**
 * Characterization test for language_first sorting — the one sort preference the
 * other suites don't cover, and which uses a separate code path (the two-bucket
 * split, not the general comparator). Pins current behavior before the Phase-4
 * single-sort / precomputed-key refactor.
 */

vi.mock('../src/manifest', () => ({
  manifest: {
    id: 'org.easynews',
    name: 'Easynews++',
    description: 'Easynews++ Addon',
    version: '1.0.0',
    catalogs: [],
    resources: ['stream'],
    types: ['movie', 'series'],
  },
}));

function fileOf(o: { marker: string; quality: string; lang: string }) {
  return {
    '0': o.marker,
    '2': '.mkv',
    '4': '2 GB',
    '10': `Test Movie 2020 ${o.quality} ${o.marker}`,
    '11': '.mkv',
    '14': '120m',
    type: 'VIDEO',
    rawSize: 2e9,
    fullres: o.quality === '2160p' ? '3840x2160' : o.quality === '1080p' ? '1920x1080' : '1280x720',
    alangs: [o.lang],
    ts: 0,
    passwd: false,
    virus: false,
    downURL: 'https://members.easynews.com/dl',
    dlFarm: 'farm',
    dlPort: 'port',
  };
}

// Two German + two English files; within each language, qualities differ so the
// secondary quality sort is observable.
const FILES = [
  fileOf({ marker: 'E4', quality: '2160p', lang: 'eng' }),
  fileOf({ marker: 'G1', quality: '1080p', lang: 'ger' }),
  fileOf({ marker: 'G4', quality: '2160p', lang: 'ger' }),
  fileOf({ marker: 'E7', quality: '720p', lang: 'eng' }),
];

vi.mock('easynews-plus-plus-api', () => ({
  EasynewsAPI: vi.fn().mockImplementation(() => ({
    search: vi.fn().mockResolvedValue({
      data: FILES,
      downURL: 'https://members.easynews.com/dl',
      dlFarm: 'farm',
      dlPort: 'port',
    }),
  })),
}));

vi.mock('../src/meta', () => ({
  publicMetaProvider: vi.fn().mockResolvedValue({
    id: 'tt1234567',
    name: 'Test Movie',
    year: 2020,
    type: 'movie',
  }),
}));

vi.mock('../src/i18n', () => ({
  getUILanguage: vi.fn().mockReturnValue('eng'),
  translations: { eng: { errors: { authFailed: 'auth failed' } } },
  ISO_TO_LANGUAGE: { eng: 'en' },
}));

vi.mock('@stremio-addon/compat', () => ({
  addonBuilder: vi.fn().mockImplementation(() => ({
    defineStreamHandler: vi.fn().mockImplementation(handler => {
      (global as any).streamHandler = handler;
      return handler;
    }),
    getInterface: vi.fn().mockReturnValue({ manifest: {}, stream: {} }),
  })),
}));

vi.mock('easynews-plus-plus-shared', () => ({
  createLogger: vi.fn().mockReturnValue({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
  parseIntEnv: (value: string | undefined, fallback: number) => {
    if (value === undefined || value === '') return fallback;
    const n = parseInt(value, 10);
    return Number.isNaN(n) ? fallback : n;
  },
}));

vi.mock('../../../custom-titles.json', () => ({ default: {} }));
vi.mock('../src/custom-template', () => ({ default: vi.fn().mockReturnValue('<html></html>') }));

import '../src/addon';

const markerOf = (s: any) => {
  const fn: string = s.behaviorHints?.filename || String(s.description).split('\n')[0] || '';
  for (const m of ['G4', 'G1', 'E4', 'E7']) if (fn.includes(m)) return m;
  return fn;
};

async function runHandler(config: Record<string, string>) {
  const handler = (global as any).streamHandler;
  return handler({ id: 'tt1234567', type: 'movie', config });
}

describe('language_first sort characterization', () => {
  beforeEach(() => vi.clearAllMocks());

  it('puts preferred-language streams first, each group sorted by quality', async () => {
    const { streams } = await runHandler({
      username: 'u',
      password: 'p',
      baseUrl: 'https://addon.test',
      strictTitleMatching: 'false',
      sortingPreference: 'language_first',
      preferredLanguage: 'ger',
    });
    // German group first (4K before 1080p), then English group (4K before 720p).
    expect(streams.map(markerOf)).toEqual(['G4', 'G1', 'E4', 'E7']);
  });
});

import type { HardeningStep } from '../types.ts';

const del = (plist: string, key: string, sudo = true): string =>
  `${sudo ? 'sudo ' : ''}defaults delete ${plist} "${key}"`;

const bt = (key: string): HardeningStep => ({
  id: `meta.bt.${key.toLowerCase().replace(/[^a-z]/g, '-')}`,
  title: `Clear Bluetooth ${key}`,
  description: `Remove ${key} from Bluetooth preferences`,
  category: 'metadata',
  commands: [del('/Library/Preferences/com.apple.Bluetooth.plist', key)],
  dangerLevel: 'medium',
  requiresSudo: true,
  tolerateFailure: true,
});

const finder = (key: string): HardeningStep => ({
  id: `meta.finder.${key.toLowerCase().replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`,
  title: `Clear Finder ${key}`,
  description: `Remove ${key} from Finder preferences`,
  category: 'metadata',
  commands: [del('~/Library/Preferences/com.apple.finder.plist', key, false)],
  dangerLevel: 'low',
  requiresSudo: false,
  tolerateFailure: true,
});

const itunes = (key: string): HardeningStep => ({
  id: `meta.itunes.${key.toLowerCase().replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`,
  title: `Clear iTunes ${key}`,
  description: `Remove ${key} from iTunes/Music preferences`,
  category: 'metadata',
  commands: [del('~/Library/Preferences/com.apple.iTunes.plist', key, false)],
  dangerLevel: 'low',
  requiresSudo: false,
  tolerateFailure: true,
});

const clearAndLock = (id: string, title: string, desc: string, paths: string[], sudo = false): HardeningStep => ({
  id,
  title,
  description: desc,
  category: 'metadata',
  commands: [
    ...paths.map(p => `${sudo ? 'sudo ' : ''}rm -rf ${p}`),
    ...paths.map(p => `${sudo ? 'sudo ' : ''}mkdir -p ${p}`),
    ...paths.map(p => `${sudo ? 'sudo ' : ''}chmod -R 000 ${p}`),
    ...paths.map(p => `${sudo ? 'sudo ' : ''}chflags -R uchg ${p}`),
  ],
  dangerLevel: 'critical',
  requiresSudo: sudo,
  warning: 'Permanently locks these directories. Some apps may break.',
});

export const metadataSteps: HardeningStep[] = [
  bt('DeviceCache'),
  bt('IDSPairedDevices'),
  bt('PANDevices'),
  bt('PANInterfaces'),
  bt('SCOAudioDevices'),

  {
    id: 'meta.cups.jobs',
    title: 'Clear printer job cache',
    description: 'Remove cached print job data',
    category: 'metadata',
    commands: ['sudo rm -rf /var/spool/cups/c0*', 'sudo rm -rf /var/spool/cups/tmp/*', 'sudo rm -rf /var/spool/cups/cache/job.cache*'],
    dangerLevel: 'low',
    requiresSudo: true,
    tolerateFailure: true,
  },

  {
    id: 'meta.ios.user-prefs',
    title: 'Clear iOS device history (user)',
    description: 'Remove connected iOS device records from user preferences',
    category: 'metadata',
    commands: [
      del(`/Users/$USER/Library/Preferences/com.apple.iPod.plist`, 'conn:128:Last Connect', true),
      del(`/Users/$USER/Library/Preferences/com.apple.iPod.plist`, 'Devices', true),
    ],
    dangerLevel: 'medium',
    requiresSudo: true,
    tolerateFailure: true,
  },
  {
    id: 'meta.ios.system-prefs',
    title: 'Clear iOS device history (system)',
    description: 'Remove connected iOS device records from system preferences',
    category: 'metadata',
    commands: [
      del('/Library/Preferences/com.apple.iPod.plist', 'conn:128:Last Connect'),
      del('/Library/Preferences/com.apple.iPod.plist', 'Devices'),
    ],
    dangerLevel: 'medium',
    requiresSudo: true,
    tolerateFailure: true,
  },
  {
    id: 'meta.ios.lockdown',
    title: 'Clear iOS pairing lockdown records',
    description: 'Remove device pairing records from lockdown database',
    category: 'metadata',
    commands: ['sudo rm -rf /var/db/lockdown/*'],
    dangerLevel: 'medium',
    requiresSudo: true,
    tolerateFailure: true,
  },

  {
    id: 'meta.ql.reset',
    title: 'Reset QuickLook cache',
    description: 'Clear and disable QuickLook thumbnail caches',
    category: 'metadata',
    commands: [
      'qlmanage -r cache 2>/dev/null || true',
      'qlmanage -r disablecache 2>/dev/null || true',
      'rm -rf "$(getconf DARWIN_USER_CACHE_DIR)/com.apple.QuickLook.thumbnailcache"',
    ],
    dangerLevel: 'low',
    requiresSudo: false,
    tolerateFailure: true,
  },

  finder('FXDesktopVolumePositions'),
  finder('FXRecentFolders'),
  finder('RecentMoveAndCopyDestinations'),
  finder('RecentSearches'),
  finder('SGTRecentFileSearches'),

  {
    id: 'meta.wifi.nvram-current',
    title: 'Clear Wi-Fi current network from NVRAM',
    description: 'Remove current network info stored in firmware',
    category: 'metadata',
    commands: ['sudo nvram -d 36C28AB5-6566-4C50-9EBD-CBB920F83843:current-network'],
    dangerLevel: 'medium',
    requiresSudo: true,
    tolerateFailure: true,
  },
  {
    id: 'meta.wifi.nvram-preferred',
    title: 'Clear Wi-Fi preferred networks from NVRAM',
    description: 'Remove preferred network list stored in firmware',
    category: 'metadata',
    commands: ['sudo nvram -d 36C28AB5-6566-4C50-9EBD-CBB920F83843:preferred-networks'],
    dangerLevel: 'medium',
    requiresSudo: true,
    tolerateFailure: true,
  },
  {
    id: 'meta.wifi.nvram-count',
    title: 'Clear Wi-Fi preferred count from NVRAM',
    description: 'Remove preferred network count stored in firmware',
    category: 'metadata',
    commands: ['sudo nvram -d 36C28AB5-6566-4C50-9EBD-CBB920F83843:preferred-count'],
    dangerLevel: 'medium',
    requiresSudo: true,
    tolerateFailure: true,
  },

  clearAndLock(
    'meta.typing.lock',
    'Clear and lock typing suggestions',
    'Remove and permanently lock language modeling, spelling, and suggestions data',
    ['~/Library/LanguageModeling', '~/Library/Spelling', '~/Library/Suggestions'],
  ),

  {
    id: 'meta.siri.analytics',
    title: 'Clear Siri analytics',
    description: 'Remove and lock Siri analytics database',
    category: 'metadata',
    commands: ['rm -rf ~/Library/Assistant/SiriAnalytics.db', 'mkdir -p ~/Library/Assistant/SiriAnalytics.db', 'chmod -R 000 ~/Library/Assistant/SiriAnalytics.db', 'chflags -R uchg ~/Library/Assistant/SiriAnalytics.db'],
    dangerLevel: 'medium',
    requiresSudo: false,
  },

  itunes('recentSearches'),
  itunes('StoreUserInfo'),
  itunes('WirelessBuddyID'),

  clearAndLock(
    'meta.doc-revisions.lock',
    'Clear and lock document revisions',
    'Remove and permanently lock /.DocumentRevisions-V100',
    ['/.DocumentRevisions-V100'],
    true,
  ),

  clearAndLock(
    'meta.saved-state.lock',
    'Clear and lock saved application state',
    'Remove and permanently lock ~/Library/Saved Application State',
    ['~/Library/Saved\\ Application\\ State'],
  ),

  clearAndLock(
    'meta.autosave.lock',
    'Clear and lock autosave information',
    'Remove and permanently lock ~/Library/Autosave Information',
    ['~/Library/Autosave\\ Information'],
  ),

  {
    id: 'meta.ql.app-support',
    title: 'Clear and lock Quick Look app support',
    description: 'Remove and permanently lock Quick Look application support data',
    category: 'metadata',
    commands: [
      'rm -rf ~/Library/Application\\ Support/Quick\\ Look/*',
      'chmod -R 000 ~/Library/Application\\ Support/Quick\\ Look',
      'chflags -R uchg ~/Library/Application\\ Support/Quick\\ Look',
    ],
    dangerLevel: 'critical',
    requiresSudo: false,
    warning: 'Quick Look previews will stop working',
  },
];

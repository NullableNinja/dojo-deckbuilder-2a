// GitHub Pages repositories share an origin. Keep 2a's browser data independent
// of the original game and 2b; leave their legacy storage entries untouched.
export const SITE_STORAGE = {
  match: "ddb-2a-field-match",
  settings: "ddb-2a-field-settings",
  motion: "ddb-2a-vfx-mode",
  gameMode: "ddb-2a-selected-game-mode",
  bouts: "ddb-2a-bout-history-v1",
  binder: "ddb-2a-binder-v1",
  profile: "ddb-2a-user-profile-v1",
  legacyLab: "ddb-2a-design-lab-v2",
  theme: "ddb-2a-theme",
} as const;

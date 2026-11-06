# Squeek Orchestra

A little wheel. A whole orchestra.

A working browser music studio driven by Squeekchain's public wheel telemetry and settled Sepolia state. Compose original music with a six-track, sixteen-step sequencer. The user writes the rhythm and melody; the hamster influences tempo, dynamics and harmony.

## Run

No build step or package installation is required. Use a current browser with Web Audio, JavaScript modules, Fetch and AbortSignal.timeout support.

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. Audio starts only after pressing Play. Opening index.html directly as a file is not supported because the app loads JavaScript modules and a deployment reference.

To deploy on your own domain, upload the CONTENTS of `dist/` to the web root of any static HTTPS host. Keep the files together. Do not upload only index.html. Google Fonts are optional; system fonts remain available if they cannot load.

## Features

- Six synthesized instruments: kick, snare, hi-hat, bass, keys and bells. No sampled recordings or audio service fees.
- Click steps to toggle them; use Pitch mode to cycle melodic notes. Right-click a melodic step to select its note. Arrow keys navigate the grid.
- Per-track mute and volume, master volume, three starting compositions and manual 50–160 BPM control.
- Follow the wheel: fresh IDLE telemetry selects 66 BPM and softer instruments; ACTIVE maps RPM to 72–150 BPM. Changes land at the next bar boundary.
- A deterministic seed from the pinned release, settled round, cumulative work and cumulative block units selects a minor pentatonic key. Consecutive rounds can select the same key. Safe Ethereum block updates alone do not change it.
- Local session storage (latest 12), composition links that preserve all musical settings, four-bar WAV export with a 1.5-second decay tail.
- Stage view with fullscreen control and a spectrum computed from the actual audio output.
- Responsive mobile layout with a horizontally scrolling sequencer.

## Data integrity and limitations

Reads only `GET https://api.squeekchain.com/v1/status` and `/v1/core`. No wallets, private keys, accounts, signatures, transactions, betting, tokens or rewards.

`dist/deployment.json` is a snapshot of the official deployment record retrieved on 2026-11-06: release `core-sepolia-20261103`, revision 7. The app checks the consumed response fields, schema version, reported chain ID and confirmation depth, Core proxy/implementation/admin identities, runtime/layout hashes, stream identity, unsigned integer strings and settlement transaction reference. This is API-level validation, not an independent onchain deployment verification or full JSON Schema validator. The official API and deployment record remain trust dependencies. A deployment change blocks new live harmony until the reference and integration are reviewed.

An HTTP 200 `status: unavailable`, stale measurement, counter fault, invalid payload or identity mismatch is not zero activity. Missing telemetry leaves musical settings unchanged and displays an unavailable status. A stalled safe block is marked stale after two minutes. Status polls every 15 seconds, chain state every 30 seconds, with timeouts and Retry-After backoff; polling pauses while the document is hidden. Rest is a valid state and never requires the hamster to move.

Composition links hold only musical data in a URL fragment. They do not prove authorship or chain provenance. Saved/shared compositions are frozen musical snapshots and open with live following off. Browser storage is device-specific and may be cleared. A private host's access restrictions still apply to shared links. No public collaboration, leaderboard or server persistence is claimed.

The seed is for musical variety, not cryptographically secure randomness. All values consumed for the seed remain decimal strings to avoid integer precision loss. No prices, return estimates or financial actions are present.

## Verify

```sh
npm test
```

Eleven tests cover presets, exact Unicode share round trips, malformed inputs, scale generation, idle/stale/fault telemetry, RPM mapping, deployment mismatch handling, stable settled seeds and PCM WAV encoding.

Browser checks performed on 2026-11-06: actual public API read, start/pause, step edit, save/load, share-link restoration, four-bar WAV download and its PCM header, desktop layout, 390-pixel mobile layout. See `docs/GENESIS_SUBMISSION.md` for the direct submission checklist and a ready project description. Test fixtures are historical evidence, never production fallback data.

## Files

| File | Purpose |
|---|---|
| `dist/index.html`, `style.css` | Studio interface and original SVG artwork |
| `dist/music.js` | Patterns, music rules, share validation, API guards |
| `dist/audio.js` | Web Audio synthesis, scheduling, WAV rendering |
| `dist/app.js` | Editing, storage, sharing, live signal and stage view |
| `dist/deployment.json` | Pinned official Sepolia deployment record |
| `tests/` | Deterministic tests and historical public API fixtures |

Independent community project. Not affiliated with or endorsed by Squeekchain. No Genesis submission or approval is implied.

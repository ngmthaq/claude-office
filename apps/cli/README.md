# @ngmthaq20/claude-office

Claude Office in your browser. One package holds the server and the web app, so there is nothing to clone or build.

## Requirements

- Node 24 or newer
- Claude Code set up on your machine (the app uses your Claude login)

## Usage

```sh
npx @ngmthaq20/claude-office install
npx @ngmthaq20/claude-office open [PORT]
npx @ngmthaq20/claude-office upgrade
npx @ngmthaq20/claude-office uninstall [--yes]
```

- `install` creates the data folder, sets up the database, and installs the package globally. After that you can run `claude-office open`.
- `open [PORT]` starts the server and opens `http://127.0.0.1:<PORT>` in your browser. The default port is 4317. Press Ctrl+C to stop. If the port is busy, the command shows an error and exits with code 1.
- `upgrade` installs the latest version globally, then runs that version's database migrations on your data folder. Restart any running `open` afterwards.
- `uninstall` asks before it deletes the data folder, then removes the global package. `--yes` skips the question. Without a terminal and without `--yes`, the data is kept.
- `help` shows the usage text.

## Data folder

Rooms and history are stored in `~/.@ngmthaq20-claude-office`. The server listens on `127.0.0.1` only.

## Publish

From the repo root (it builds everything first):

```sh
pnpm publish:cli
```

Do not use `npm publish`. `pnpm publish` replaces the `workspace:*` dev dependencies with real versions.

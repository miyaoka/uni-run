# uni-run

[![JSR](https://jsr.io/badges/@miyaoka/uni-run)](https://jsr.io/@miyaoka/uni-run)
[![GitHub](https://img.shields.io/github/license/miyaoka/uni-run)](https://github.com/miyaoka/uni-run/blob/main/LICENSE)

> Universal script runner for npm, yarn, pnpm, bun, and deno projects

A command-line tool that provides a unified interface for running scripts across different package
managers (npm, yarn, pnpm, bun, deno). It automatically detects the project type and executes
scripts with the appropriate commands.

## Features

- Automatic project type detection (npm, yarn, pnpm, bun, deno)
- Interactive script selection UI
- Script selection history caching
  - Remembers your last used script for each project directory
  - Makes repetitive script execution faster by pre-selecting your previously used script

## Installation / Upgrade

```bash
deno install -grf -n uni-run \
  --allow-read=. \
  --allow-run=npm,yarn,pnpm,bun,deno \
  jsr:@miyaoka/uni-run/cli
```

> Note: The `-f` flag forces overwriting of any existing installation. The `-r` flag forces
> reloading all dependencies, ensuring you get the latest version. You can safely run this command
> for first-time installation or to upgrade to the latest version.

Permissions are restricted for better security:

- `--allow-read=.`: Only read from current directory
  - Required to detect project type
- `--allow-run=npm,yarn,pnpm,bun,deno`: Only run specific package managers
  - Required to execute scripts with the appropriate package manager

### Recent Updates

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history and updates.

### Uninstall

```bash
# Remove the executable
deno uninstall -g uni-run
```

## Usage

### Basic usage

```bash
# Detect project type and select script interactively
uni-run

# Run a specific script
uni-run dev

# Run a script with arguments (using -- separator)
uni-run test -- --watch
uni-run build -- --mode production
uni-run start -- --port 3000
```

## Supported Package Managers

| Package Manager | Detection Method     | Command Transformation |
| --------------- | -------------------- | ---------------------- |
| npm             | package-lock.json    | `npm run [script]`     |
| yarn            | yarn.lock            | `yarn [script]`        |
| pnpm            | pnpm-lock.yaml       | `pnpm run [script]`    |
| bun             | bun.lockb            | `bun run [script]`     |
| deno            | deno.json/deno.jsonc | `deno task [script]`   |

## Options

| Option          | Description              |
| --------------- | ------------------------ |
| `-l, --list`    | List available scripts   |
| `-v, --version` | Show version information |
| `-h, --help`    | Show help                |

## Development

```bash
# Copy settings.template.json to settings.json for VSCode configuration
cp .vscode/settings.template.json .vscode/settings.json

# Run in development mode
deno task dev

# Build binary
deno task compile
```

## License

MIT © [miyaoka](https://github.com/miyaoka)

# uni-run

[![JSR](https://jsr.io/badges/@miyaoka/uni-run)](https://jsr.io/@miyaoka/uni-run)
[![GitHub](https://img.shields.io/github/license/miyaoka/uni-run)](https://github.com/miyaoka/uni-run/blob/main/LICENSE)

> Universal script runner for npm, yarn, pnpm, bun, and deno projects

A command-line tool that provides a unified interface for running scripts across different package managers (npm, yarn, pnpm, bun, deno). It automatically detects the project type and executes scripts with the appropriate commands.

## Features

- Automatic project type detection (npm, yarn, pnpm, bun, deno)
- Interactive script selection UI
- Script selection history caching
  - Remembers your last used script for each project directory
  - Makes repetitive script execution faster by pre-selecting your previously used script

## Installation

### Install from JSR

```bash
deno install -g -n uni-run \
  --allow-read=.,$HOME/.cache/uni-run \
  --allow-write=$HOME/.cache/uni-run \
  --allow-env=HOME,USERPROFILE \
  --allow-run=npm,yarn,pnpm,bun,deno \
  jsr:@miyaoka/uni-run/cli
```

Permissions are restricted for better security:

- `--allow-read=.,$HOME/.cache/uni-run`: Only read from current directory and cache
  - Required to detect project type and read stored preferences
- `--allow-write=$HOME/.cache/uni-run`: Only write to cache directory
  - Required to save script selection history
- `--allow-env=HOME,USERPROFILE`: Only access specific environment variables
  - Required to locate user's home directory for cache
- `--allow-run=npm,yarn,pnpm,bun,deno`: Only run specific package managers
  - Required to execute scripts with the appropriate package manager

### Uninstall

```bash
# Remove the executable
deno uninstall -g uni-run

# Remove cache directory (optional)
# This cache stores your command selection history
rm -rf $HOME/.cache/uni-run
```

## Usage

### Basic usage

```bash
# Detect project type and select script interactively
uni-run

# List available scripts
uni-run --list
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
# Run in development mode
deno task dev

# Build binary
deno task compile
```

## License

MIT © [miyaoka](https://github.com/miyaoka)

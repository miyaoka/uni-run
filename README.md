# uni-run

[![JSR](https://jsr.io/badges/@miyaoka/uni-run)](https://jsr.io/@miyaoka/uni-run)
[![GitHub](https://img.shields.io/github/license/miyaoka/uni-run)](https://github.com/miyaoka/uni-run/blob/main/LICENSE)

> Universal script runner for npm, yarn, pnpm, bun, and deno projects

A command-line tool that provides a unified interface for running scripts across different package managers (npm, yarn, pnpm, bun, deno). It automatically detects the project type and executes scripts with the appropriate commands.

## Features

- Automatic project type detection
- Interactive script selection UI
- Script selection history caching
- Silent mode to suppress extra output
- Support for multiple package managers (npm, yarn, pnpm, bun, deno)

## Installation

### Install from JSR

```bash
deno install -g -A -n uni-run jsr:@miyaoka/uni-run/cli
```

### Uninstall

```bash
deno uninstall -g uni-run
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

# Run tests
deno task test

# Build binary
deno task compile
```

## License

MIT © [miyaoka](https://github.com/miyaoka)

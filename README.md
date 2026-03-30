<div align="center">

<img src="docs/macbonk.png?v=2" alt="macbonk" width="300">

<h1>macbonk</h1>

<p>an interactive macOS security and privacy hardening CLI tool, built on top of <a href="https://github.com/drduh/macos-security-and-privacy-guide">drduh/macos-security-and-privacy-guide</a></p>

</div>

This automation script operationalizes a curated set of hardening techniques for macOS security and privacy. The guide is targeted to power users who wish to adopt enterprise-standard security, but is also suitable for novice users with an interest in improving their privacy and security on a Mac.

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/0xhsn/macbonk/main/install.sh | bash
```

This installs Bun (if missing), clones the repo, and creates the `macbonk` command.

**Or from source:**

```bash
git clone https://github.com/0xhsn/macbonk.git
cd macbonk
bun install
bun bin/macbonk.ts
```


## Usage

```bash
# Interactive mode - walk through each category and step
macbonk

# Preview what would change without executing anything
macbonk --dry-run

# Run everything without prompting
macbonk --yolo

# Run everything in dry-run (audit mode)
macbonk --yolo --dry-run

# Run a single category
macbonk --category firewall

# List all categories and steps
macbonk --list
```


## How it works

Each hardening recommendation from the [drduh guide](https://github.com/drduh/macos-security-and-privacy-guide) is defined as a declarative step:

```typescript
{
  id: 'fw.enable-stealth',
  title: 'Enable Stealth Mode',
  description: "Don't respond to ping or connection attempts from closed ports",
  commands: ['sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setstealthmode on'],
  dangerLevel: 'low',
  requiresSudo: true,
}
```

Steps are grouped into categories. In interactive mode, you see each step with its description, danger level, and the actual command - then choose to **apply**, **skip**, **info**, or **quit**. A summary report is shown at the end.

- 62 hardening steps across 11 categories
- Interactive step-by-step walkthrough with apply/skip per item
- `--yolo` flag to run everything without prompting
- `--dry-run` mode to preview changes without touching anything
- Built with [Ink](https://github.com/vadimdemedes/ink) (React for CLIs) and [Bun](https://bun.sh)

## What it covers

| Category | Steps | Description |
|----------|-------|-------------|
| System Hardening | 9 | `defaults write`, umask, hostname |
| Firewall | 6 | ALF, stealth mode, pf kernel firewall |
| DNS | 5 | Hosts blocklist, DNSCrypt, Dnsmasq |
| Privoxy | 4 | Local filtering proxy |
| Homebrew | 2 | Analytics, security settings |
| SSH | 3 | Hardened client/server configuration |
| Metadata Cleanup | 27 | Clear caches, history, artifacts |
| Privacy | 1 | Browser hardening |
| Encryption | 2 | GnuPG setup |
| Monitoring | 1 | Audit and monitoring tools |
| Verification | 2 | SIP, FileVault status checks |


## Danger levels

| Level | Description |
|-------|-------------|
| LOW | Safe, cosmetic, or informational changes |
| MEDIUM | Functional changes that may affect behavior |
| HIGH | Network/system changes that could break things if misconfigured |
| CRITICAL | Destructive operations (e.g., locking directories with `chmod 000`) |

Steps marked HIGH or CRITICAL include a warning explaining the risk.


## Requirements

- macOS (any version)
- That's it - the install script handles everything else


## Contributing

PRs welcome. To add a new hardening step, create an entry in the appropriate file under `src/steps/`. Each step is just a TypeScript object - no code to write, just data.

**What makes a good step:**
- Has a clear security or privacy benefit
- Can be automated via a shell command
- Is documented in the drduh guide or similar reputable source

**Running tests:**

```bash
bun test
```


#!/bin/bash
set -e

REPO="https://github.com/0xhsn/macbonk.git"
INSTALL_DIR="$HOME/.macbonk"
BIN_LINK="/usr/local/bin/macbonk"

echo "Installing macbonk..."

if [ "$(uname)" != "Darwin" ]; then
  echo "Error: macbonk only runs on macOS"
  exit 1
fi

if ! command -v bun &>/dev/null; then
  echo "Installing Bun..."
  if command -v brew &>/dev/null; then
    brew install oven-sh/bun/bun
  else
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
  fi
fi

if [ -d "$INSTALL_DIR" ]; then
  echo "Updating macbonk..."
  cd "$INSTALL_DIR" && git pull --quiet
else
  echo "Downloading macbonk..."
  git clone --quiet --depth 1 "$REPO" "$INSTALL_DIR"
fi

cd "$INSTALL_DIR"
bun install --silent

mkdir -p "$(dirname "$BIN_LINK")" 2>/dev/null || true

cat > "$INSTALL_DIR/macbonk" << 'WRAPPER'
#!/bin/bash
exec bun "$HOME/.macbonk/bin/macbonk.ts" "$@"
WRAPPER
chmod +x "$INSTALL_DIR/macbonk"

if [ -w "$(dirname "$BIN_LINK")" ]; then
  ln -sf "$INSTALL_DIR/macbonk" "$BIN_LINK"
else
  sudo ln -sf "$INSTALL_DIR/macbonk" "$BIN_LINK"
fi

echo ""
echo "macbonk installed! Run it with:"
echo "  macbonk"
echo "  macbonk --dry-run"
echo "  macbonk --yolo"
echo "  macbonk --help"

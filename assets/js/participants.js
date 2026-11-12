export function parseBulk(text) {
  // Only line separators are removed; every character on each nonempty line survives.
  return text.split(/\r\n|\n|\r/).filter(line => line.length > 0);
}
export function entryType(name) {
  return name.startsWith(' ') ? 'excluded' : name.endsWith(' ') ? 'priority' : 'normal';
}
export function visibleName(name) {
  // Make boundary spaces visible without modifying the stored value.
  const match = name.match(/^( *)(.*?)( *)$/s);
  return match ? '·'.repeat(match[1].length) + match[2] + '·'.repeat(match[3].length) : name;
}

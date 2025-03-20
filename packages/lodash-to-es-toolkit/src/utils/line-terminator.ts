export default function detectLineTerminator(source: string) {
  return source?.includes('\r\n') ? '\r\n' : '\n';
}

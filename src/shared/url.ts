/**
 * 拼接 URL 路径段，确保相邻段之间只有一个 '/'。
 *
 * 示例：
 *   joinPath('http://example.com:1105', 'svc', 'router/')
 *   → 'http://example.com:1105/svc/router/'
 */
export function joinPath(...segments: string[]): string {
  return segments
    .map((s, i) => {
      if (i === 0) return s.replace(/\/+$/, "");
      return s.replace(/^\/+/, "").replace(/\/+$/, "");
    })
    .join("/");
}

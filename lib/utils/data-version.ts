export function toEtagFromData(value: unknown): string {
  const json = JSON.stringify(value) ?? "";
  let hash = 2166136261;

  for (let index = 0; index < json.length; index += 1) {
    hash ^= json.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `"${(hash >>> 0).toString(16)}"`;
}

function normalizeEtag(etag: string): string {
  const trimmed = etag.trim();
  return trimmed.startsWith("W/") ? trimmed.slice(2).trim() : trimmed;
}

export function etagMatches(requestHeader: string | null, currentEtag: string): boolean {
  if (!requestHeader) return false;

  const normalizedCurrent = normalizeEtag(currentEtag);
  return requestHeader.split(",").some((token) => {
    const candidate = token.trim();
    if (candidate === "*") return true;
    return normalizeEtag(candidate) === normalizedCurrent;
  });
}


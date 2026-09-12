type AdminSearchParamUpdates = Record<string, string | null | undefined>;

export function mergeAdminSearchParams(
  current: URLSearchParams,
  updates: AdminSearchParamUpdates,
): string {
  const params = new URLSearchParams(current.toString());

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) {
      continue;
    }

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  }

  params.set('tab', 'analytics');
  return params.toString();
}

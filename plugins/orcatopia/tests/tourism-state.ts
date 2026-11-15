export function collectionSnapshot(value: string | object | null) {
  if (value === null) return null;
  const { tourism: _, ...collection } =
    typeof value === 'string' ? JSON.parse(value) : value;
  return collection;
}

export function listToMap(list: any[], key: string) {
  const map = new Map();
  list.forEach(item => map.set(item[key], item));
  return map;
}

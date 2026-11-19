import { links as raw } from '../routes';

const flatLinks = raw.flatMap((g) => g.items);

// "/basic/:skin" -> "/basic/willow"
export function withSkin(route, skin) {
  return route.replace(':skin', skin);
}

// alias route ("/base/:skin") -> canonical entry
const aliases = new Map();
flatLinks.forEach((a) =>
  a[3]?.aliases?.forEach((alias) => aliases.set(alias, a)),
);

export function findLink(route) {
  return flatLinks.find((a) => a[0] === route) ?? aliases.get(route);
}

export function getLinks() {
  return raw;
}

export function getFlatLinks() {
  return flatLinks;
}

export function getAliases() {
  return aliases;
}

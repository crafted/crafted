import {Item} from '../app-types/item';

/**
 * Returns a lower-cased string that contains the searchable tokens of Item.
 * TODO: Fill in more info, including labels
 */
export function tokenizeItem(item: Item) {
  const title = item.title || '';
  const body = item.body || '';
  const reporter = item.reporter || '';
  const itemNumber = item.number || '';
  const str = title + body + reporter + itemNumber;
  return str.toLowerCase();
}

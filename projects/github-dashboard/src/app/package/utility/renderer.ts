import {combineLatest, Observable} from 'rxjs';
import {auditTime, debounceTime, map, startWith} from 'rxjs/operators';
import {Group} from '../data-source/grouper';

export interface RendererState<T> {
  groups: Group<T>[];
  count: number;
  total: number;
}

export function renderItemGroups<T>(
    scroll: Observable<Event>, resetCount = 20, incrementCount = 20) {
  return (itemGroups: Observable<Group<T>[]>) => {
    let issuesToDisplay = 0;
    return combineLatest(
               itemGroups.pipe(debounceTime(50)), scroll.pipe(auditTime(200), startWith(null)))
        .pipe(map(result => {
          let itemGroups = result[0];

          const scrollEvent = result[1];

          if (!scrollEvent) {
            issuesToDisplay = resetCount;
          } else {
            const el = scrollEvent.target as HTMLElement;
            if (isNearTop(el)) {
              issuesToDisplay = resetCount;
            } else if (isNearBottom(el)) {
              issuesToDisplay += incrementCount;
            }
          }

          return getRenderState(itemGroups, issuesToDisplay);
        }));
  };
}

function isNearBottom(el: HTMLElement) {
  const viewHeight = el.getBoundingClientRect().height;
  const scrollTop = el.scrollTop;
  const scrollHeight = el.scrollHeight;

  const distanceFromBottom = scrollHeight - scrollTop - viewHeight;
  return distanceFromBottom <= 1000;
}

function isNearTop(el: HTMLElement) {
  return el.scrollTop <= 200;
}

function getRenderState<T>(itemGroups: Group<T>[], issuesToDisplay: number): RendererState<T> {
  let total = 0;
  itemGroups.forEach(g => total += g.items.length);

  if (!itemGroups.length) {
    return {groups: [], count: 0, total};
  }

  const renderedItemGroups = [];
  let count = 0;

  let itemsToRender = issuesToDisplay;
  let index = 0;
  do {
    const itemGroup = itemGroups[index];
    const items = itemGroup.items.slice(0, itemsToRender);
    renderedItemGroups.push({...itemGroup, items});
    itemsToRender -= itemGroup.items.length;
    count += items.length;
    index++;
  } while (itemsToRender > 0 && itemGroups.length !== itemGroups.length);

  return {groups: renderedItemGroups, count, total};
}

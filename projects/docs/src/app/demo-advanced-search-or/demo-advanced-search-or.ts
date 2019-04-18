import {Component} from '@angular/core';
import {DataSource, Filterer, Viewer} from '@crafted/data';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {EXAMPLE_ITEMS} from '../data';
import {ExampleFiltererMetadata} from '../data-resources/filterer-metadata';
import {ExampleViewerMetadata} from '../data-resources/viewer-metadata';


@Component({
  selector: 'demo-advanced-search-or',
  templateUrl: 'demo-advanced-search-or.html',
  styleUrls: ['demo-advanced-search-or.scss'],
})
export class DemoAdvancedSearchOr {
  dataSource = new DataSource({data: EXAMPLE_ITEMS});
  viewer = new Viewer({metadata: ExampleViewerMetadata});
  filterer1 = new Filterer({metadata: ExampleFiltererMetadata});
  filterer2 = new Filterer({metadata: ExampleFiltererMetadata});

  exampleItems = this.dataSource.data.pipe(orFilter(this.filterer1, this.filterer2));
}

export function orFilter(...filterers: Filterer[]): (items: Observable<any[]>) =>
    Observable<any[]> {
  return (items$: Observable<any[]>) => {
    const filteredItems = filterers.map(filterer => items$.pipe(filterer.filter()));
    return combineLatest(filteredItems).pipe(map(result => {
      const itemsSet = new Set();
      result.forEach(items => items.forEach(item => itemsSet.add(item)));
      const itemsList = [];
      itemsSet.forEach(i => itemsList.push(i));
      return itemsList;
    }));
  }
}

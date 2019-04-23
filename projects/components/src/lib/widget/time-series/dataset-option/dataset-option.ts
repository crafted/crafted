import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlContainer, FormArray} from '@angular/forms';
import {DataSource, Filterer} from '@crafted/data';
import {Subject} from 'rxjs';
import {startWith, takeUntil} from 'rxjs/operators';
import {SavedFiltererState} from '../../../form/filter-state-option/filter-state-option';
import {TimeSeriesDataResourcesMap} from '../time-series';

@Component({
  selector: 'dataset-option',
  templateUrl: 'dataset-option.html',
  styleUrls: ['dataset-option.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetOption {
  dataSourceTypeOptions: {id: string, label: string}[] = [];

  // TODO: Should be determined by data source
  datePropertyIdOptions: {id: string, label: string}[] = [
    {id: 'opened', label: 'Opened'},
    {id: 'closed', label: 'Closed'},
  ];

  seriesTypeOptions: {id: string, label: string}[] = [
    {id: 'count', label: 'Count'},
    {id: 'accumulate', label: 'Accumulate'},
  ];

  actionTypeOptions: {id: string, label: string}[] = [
    {id: 'increment', label: 'Increment'},
    {id: 'decrement', label: 'Decrement'},
  ];

  filterer: Filterer<any, any>;

  dataSource: DataSource<any>;

  actionsFormArray: FormArray;

  private destroyed = new Subject();

  @Input() savedFiltererStates: SavedFiltererState[];

  @Input() dataResourcesMap: TimeSeriesDataResourcesMap;

  @Output() remove = new EventEmitter();

  @Output() duplicate = new EventEmitter();

  @Output() addAction = new EventEmitter();

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit() {
    this.actionsFormArray = this.controlContainer.control.get('actions') as FormArray;

    this.dataResourcesMap.forEach(
        dataResource =>
            this.dataSourceTypeOptions.push({id: dataResource.id, label: dataResource.label}));

    const dataSourceTypeControl = this.controlContainer.control!.get('dataSourceType')!;
    if (!dataSourceTypeControl.value) {
      dataSourceTypeControl.setValue(this.dataSourceTypeOptions[0].id);
    }

    dataSourceTypeControl.valueChanges
        .pipe(takeUntil(this.destroyed), startWith(dataSourceTypeControl.value))
        .subscribe(value => {
          const dataSourceProvider = this.dataResourcesMap.get(value)!;
          this.dataSource = dataSourceProvider.dataSource();
          this.filterer = dataSourceProvider.filterer();
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  removeAction(index: number) {
    this.actionsFormArray.removeAt(index);
  }
}

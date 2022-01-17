import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlContainer, FormArray} from '@angular/forms';
import {SavedFiltererState} from 'projects/github-dashboard/src/app/components';
import {DataSource, Filterer} from 'projects/github-dashboard/src/app/data';
import {Subject} from 'rxjs';
import {startWith, takeUntil} from 'rxjs/operators';
import {TimeSeriesDataResourcesMap} from '../time-series';

@Component({
  selector: 'dataset-option',
  templateUrl: 'dataset-option.html',
  styleUrls: ['dataset-option.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetOption {
  dataTypeOptions: {id: string, label: string}[] = [];

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

    this.dataResourcesMap.forEach(d => this.dataTypeOptions.push({id: d.type, label: d.label}));

    const dataTypeForm = this.controlContainer.control.get('dataType');
    if (!dataTypeForm.value) {
      dataTypeForm.setValue(this.dataTypeOptions[0].id);
    }

    dataTypeForm.valueChanges.pipe(takeUntil(this.destroyed), startWith(dataTypeForm.value))
        .subscribe(value => {
          const dataSourceProvider = this.dataResourcesMap.get(value);
          this.dataSource = dataSourceProvider.dataSource();
          this.filterer =
              dataSourceProvider.filterer(this.controlContainer.control.get('filtererState').value);
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

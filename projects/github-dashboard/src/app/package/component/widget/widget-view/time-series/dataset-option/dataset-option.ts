import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlContainer, FormArray} from '@angular/forms';
import {DataSource, Filterer} from '@crafted/data';
import {Subject} from 'rxjs';
import {startWith, takeUntil} from 'rxjs/operators';
import {ButtonToggleOption} from '../../../edit-widget/button-toggle-option/button-toggle-option';
import {SavedFiltererState} from '../../../edit-widget/edit-widget';
import {TimeSeriesDataResourcesMap} from '../time-series';

@Component({
  selector: 'dataset-option',
  templateUrl: 'dataset-option.html',
  styleUrls: ['dataset-option.scss', '../../../edit-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetOption {
  dataSourceTypeOptions: ButtonToggleOption[] = [];

  // TODO: Should be determined by data source
  datePropertyIdOptions: ButtonToggleOption[] = [
    {id: 'opened', label: 'Opened'},
    {id: 'closed', label: 'Closed'},
  ];

  seriesTypeOptions: ButtonToggleOption[] = [
    {id: 'count', label: 'Count'},
    {id: 'accumulate', label: 'Accumulate'},
  ];

  actionTypeOptions: ButtonToggleOption[] = [
    {id: 'increment', label: 'Increment'},
    {id: 'decrement', label: 'Decrement'},
  ];

  filterer: Filterer<any, any>;

  dataSource: DataSource<any>;

  private destroyed = new Subject();

  @Input() savedFiltererStates: SavedFiltererState[];

  @Input() dataResources: TimeSeriesDataResourcesMap;

  @Output() remove = new EventEmitter();

  @Output() duplicate = new EventEmitter();

  @Output() addAction = new EventEmitter();

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit() {
    this.dataResources.forEach(
        dataSource =>
            this.dataSourceTypeOptions.push({id: dataSource.id, label: dataSource.label}));

    const dataSourceTypeControl = this.controlContainer.control!.get('dataSourceType')!;
    if (!dataSourceTypeControl.value) {
      dataSourceTypeControl.setValue(this.dataSourceTypeOptions[0].id);
    }

    dataSourceTypeControl.valueChanges
        .pipe(takeUntil(this.destroyed), startWith(dataSourceTypeControl.value))
        .subscribe(value => {
          const dataSourceProvider = this.dataResources.get(value)!;
          this.dataSource = dataSourceProvider.dataSource();
          this.filterer = dataSourceProvider.filterer();
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  removeAction(index: number) {
    const actionsFormArray = this.controlContainer.control!.get('actions') as FormArray;
    actionsFormArray.removeAt(index);
  }
}

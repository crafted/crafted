import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {DataSource} from '@crafted/data';

@Component({
  selector: 'action-option',
  templateUrl: 'action-option.html',
  styleUrls: ['action-option.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionOption {
  dataOptions: {id: string, label: string}[] = [];

  countPropertyIdOptions: {id: string, label: string}[] = [];

  datePropertyIdOptions: {id: string, label: string}[] = [];

  actionTypeOptions: {id: string, label: string}[] = [
    {id: 'increment', label: 'Increment'},
    {id: 'decrement', label: 'Decrement'},
  ];

  @Input() dataSource: DataSource;

  @Input() canRemove: boolean;

  @Output() remove = new EventEmitter();

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit() {
    this.datePropertyIdOptions = this.dataSource.getDataLabelsWithType('date');
    this.countPropertyIdOptions = this.dataSource.getDataLabelsWithType('number');

    const typeFormControl = this.controlContainer.control.get('type');
    if (!typeFormControl.value) {
      typeFormControl.setValue(this.actionTypeOptions[0].id);
    }

    const datePropertyIdFormControl = this.controlContainer.control.get('datePropertyId');
    if (!datePropertyIdFormControl.value) {
      datePropertyIdFormControl.setValue(this.datePropertyIdOptions[0].id);
    }

    const countPropertyIdFormControl = this.controlContainer.control.get('countPropertyId');
    if (!countPropertyIdFormControl.value) {
      countPropertyIdFormControl.setValue(this.countPropertyIdOptions[0].id);
    }
  }
}

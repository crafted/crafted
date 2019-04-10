import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {DataSource} from '@crafted/data';
import {ButtonToggleOption} from '../../../edit-widget/button-toggle-option/button-toggle-option';

@Component({
  selector: 'action-option',
  templateUrl: 'action-option.html',
  styleUrls: ['action-option.scss', '../../../edit-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionOption {
  dataOptions: ButtonToggleOption[] = [];

  datePropertyIdOptions: ButtonToggleOption[] = [];

  actionTypeOptions: ButtonToggleOption[] = [
    {id: 'increment', label: 'Increment'},
    {id: 'decrement', label: 'Decrement'},
  ];

  @Input() dataSource: DataSource;

  @Input() canRemove: boolean;

  @Output() remove = new EventEmitter();

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit() {
    this.datePropertyIdOptions = this.dataSource.getDataLabelsWithType('date');

    const typeFormControl = this.controlContainer.control!.get('type')!;
    if (!typeFormControl.value) {
      typeFormControl.setValue(this.actionTypeOptions[0].id);
    }

    const datePropertyIdFormControl = this.controlContainer.control!.get('datePropertyId')!;
    if (!datePropertyIdFormControl.value) {
      datePropertyIdFormControl.setValue(this.datePropertyIdOptions[0].id);
    }
  }
}

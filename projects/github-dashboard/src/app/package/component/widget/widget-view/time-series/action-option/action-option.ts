import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {
  DataSourceMetadata
} from 'projects/github-dashboard/src/app/package/data-source/data-source';
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

  @Input() providerMetadata: Map<string, DataSourceMetadata<any>>;

  @Input() canRemove: boolean;

  @Output() remove = new EventEmitter();

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit() {
    this.providerMetadata.forEach(metadata => {
      this.datePropertyIdOptions.push({
        id: metadata.id,
        label: metadata.label,
      });
    });

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

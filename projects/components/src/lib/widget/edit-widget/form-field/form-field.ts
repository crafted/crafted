import {CdkPortal} from '@angular/cdk/portal';
import {ChangeDetectionStrategy, Component, ContentChild, Directive, Input} from '@angular/core';

/** Used to flag tab labels for use with the portal directive */
@Directive({
  selector: '[formFieldLabel]',
})
export class FormFieldLabel extends CdkPortal {
}

@Component({
  selector: 'form-field',
  styleUrls: ['form-field.scss'],
  templateUrl: 'form-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  @ContentChild(FormFieldLabel) templateLabel: FormFieldLabel;

  @Input() label: string;
}

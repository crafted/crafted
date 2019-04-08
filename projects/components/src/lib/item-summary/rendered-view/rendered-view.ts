import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {RenderedView} from '@crafted/data';
import {Observable} from 'rxjs';

@Component({
  selector: 'item-rendered-view',
  template: `
    {{text}}

    <item-rendered-view *ngFor="let view of childrenViews"
                        [class]="view.classList || ''"
                        [ngStyle]="view.styles || {}"
                        [text]="view.text" [childrenViews]="view.children">
    </item-rendered-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemRenderedView {
  views: Observable<RenderedView[]>;

  @Input() text: string;

  @Input() childrenViews: RenderedView[] = [];
}

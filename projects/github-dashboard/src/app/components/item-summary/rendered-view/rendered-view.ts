import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {RenderedView} from 'projects/github-dashboard/src/app/data';
import {Observable} from 'rxjs';

@Component({
  selector: 'item-rendered-view',
  template: `
    {{text}}

    <ng-container *ngFor="let view of childrenViews">
      <item-rendered-view *ngIf="view"
                          [class]="view.classList || ''"
                          [ngStyle]="view.styles || {}"
                          [text]="view.text" [childrenViews]="view.children">
      </item-rendered-view>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemRenderedView {
  views: Observable<RenderedView[]>;

  @Input() text: string;

  @Input() childrenViews: RenderedView[] = [];
}

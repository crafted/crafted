import {CdkPortal} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {Title as WindowTitle} from '@angular/platform-browser';
import {Header} from '../../services/header';

export interface HeaderContentAction<T = string> {
  id: T;
  text?: string;
  icon?: string;
  tooltip?: string;
  isPrimary?: boolean;
  isDisabled?: boolean;
}

@Component({
  selector: 'header-content',
  templateUrl: 'header-content.html',
  styleUrls: ['header-content.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderContent<T> {
  @Input() name: string;

  @Input() actions: HeaderContentAction[];

  @Output() actionSelected = new EventEmitter<T>();

  @ViewChild(CdkPortal, { static: true }) headerPortal: CdkPortal;

  constructor(public header: Header, private windowTitle: WindowTitle) {
  }

  trackById = (_index: number, action: HeaderContentAction) => action.id;

  ngOnInit() {
    this.header.toolbarOutlet.next(this.headerPortal);
  }

  ngOnChanges() {
    if (this.name) {
      this.windowTitle.setTitle(this.name);
    }
  }

  ngOnDestroy() {
    this.header.toolbarOutlet.next(null);
  }
}


import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {Header} from '../../services/header';

@Component({
  selector: 'app-header',
  templateUrl: 'header.html',
  styleUrls: ['header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonHeader {
  @Input() sidenav: MatSidenav;

  constructor(public header: Header) {}
}

import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {MatTabNav} from '@angular/material';

@Component({
  selector: 'config-page',
  styleUrls: ['config-page.scss'],
  templateUrl: 'config-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigPage {
  @ViewChild(MatTabNav) tabNav: MatTabNav;

  navLinks: {label: string, path: string}[] = [
    {label: 'GitHub Data', path: 'database'},
    {label: 'Recommendations', path: 'recommendations'},
  ];

  ngAfterViewInit() {
    this.tabNav._alignInkBar();
  }
}

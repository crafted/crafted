import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'config-page',
  styleUrls: ['config-page.scss'],
  templateUrl: 'config-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigPage {
  navLinks: {label: string, path: string}[] = [
    {label: 'GitHub Data', path: 'database'},
    {label: 'Recommendations', path: 'recommendations'},
  ];
}

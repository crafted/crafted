import {CdkPortal} from '@angular/cdk/portal';
import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';

@Injectable()
export class Header {
  goBack: boolean;

  toolbarOutlet = new ReplaySubject<CdkPortal>(1);
}

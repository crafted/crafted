import {CdkPortal} from '@angular/cdk/portal';
import {Injectable} from '@angular/core';
import {Title as WindowTitle} from '@angular/platform-browser';
import {NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

const TOP_LEVEL_SECTIONS =
    new Set<string>(['queries', 'recommendations', 'dashboards', 'database']);

@Injectable()
export class Header {
  goBack: boolean;

  title = new BehaviorSubject<string>('Loading...');

  toolbarOutlet = new BehaviorSubject<CdkPortal|null>(null);

  destroyed = new Subject();

  constructor(private windowTitle: WindowTitle, private router: Router) {
    this.title.pipe(takeUntil(this.destroyed)).subscribe(title => this.windowTitle.setTitle(title));
    this.router.events.pipe(filter(e => e instanceof NavigationEnd), takeUntil(this.destroyed))
        .subscribe(e => {
          const sections = (e as NavigationEnd).urlAfterRedirects.split('/');
          const section = sections[3];

          switch (section) {
            case 'recommendations':
              this.title.next('Recommendations');
              break;
            case 'dashboards':
              this.title.next('Dashboards');
              break;
            case 'database':
              this.title.next('Database');
              break;
            case 'queries':
              this.title.next('Queries');
              break;
          }

          if (TOP_LEVEL_SECTIONS.has(section)) {
            this.goBack = false;
          }
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

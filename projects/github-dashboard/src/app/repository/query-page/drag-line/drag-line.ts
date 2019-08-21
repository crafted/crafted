import {CdkDrag, CdkDragRelease} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'drag-line',
  styleUrls: ['drag-line.scss'],
  templateUrl: 'drag-line.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragLine {
  @Output() dragged = new EventEmitter<number>();

  @ViewChild(CdkDrag, { static: true }) draggable: CdkDrag;

  private destroyed = new Subject<any>();

  ngAfterViewInit() {
    this.draggable.released.subscribe((releasedEvent: CdkDragRelease) => {
      const transformStyle = releasedEvent.source.element.nativeElement.style.transform;
      const dragDistance = +transformStyle.match(/-*\d+px/g)[0].match(/-*\d+/g)[0];
      this.dragged.next(dragDistance);
      this.draggable.reset();
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

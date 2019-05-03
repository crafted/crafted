import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';
import {Markdown} from '../../../services/markdown';

@Component({
  selector: 'item-message',
  styleUrls: ['item-message.scss'],
  templateUrl: 'item-message.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemMessage {
  @Input() user: string;

  @Input() dateTime: string;

  @Input() message: string;

  messageMarkdown: SafeHtml;

  constructor(private markdown: Markdown) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.message) {
      this.messageMarkdown = this.markdown.render(this.message);
    }
  }
}

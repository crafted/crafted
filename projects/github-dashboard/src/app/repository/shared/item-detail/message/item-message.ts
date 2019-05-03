import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';
import {UserComment} from 'projects/github-dashboard/src/app/service/github';
import {Markdown} from '../../../services/markdown';

@Component({
  selector: 'item-message',
  styleUrls: ['item-message.scss'],
  templateUrl: 'item-message.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemMessage {
  @Input() comment: UserComment;

  @Input() user: string;

  @Input() dateTime: string;

  @Input() message: string;

  messageMarkdown: SafeHtml;

  constructor(private markdown: Markdown) {}

  ngOnInit() {
    this.messageMarkdown = this.markdown.render(this.message);
  }
}

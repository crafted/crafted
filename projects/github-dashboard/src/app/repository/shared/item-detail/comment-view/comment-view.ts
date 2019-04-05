import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';
import {UserComment} from 'projects/github-dashboard/src/app/service/github';
import {Markdown} from '../../../services/markdown';

@Component({
  selector: 'comment-view',
  styleUrls: ['comment-view.scss'],
  templateUrl: 'comment-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentView {
  @Input() comment: UserComment;

  messageMarkdown: SafeHtml;

  constructor(private markdown: Markdown) {}

  ngOnInit() {
    this.messageMarkdown = this.markdown.render(this.comment.message);
  }
}

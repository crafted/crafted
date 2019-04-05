import {Injectable} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as hljs from 'highlight.js';
import * as Remarkable from 'remarkable';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DataStore} from './dao/data-dao';

@Injectable()
export class Markdown {
  highlightFn =
      (str: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (err) {
          }
        }

        try {
          return hljs.highlightAuto(str).value;
        } catch (err) {
        }

        return '';  // use external default escaping
      }

  md = new Remarkable({html: true, breaks: true, linkify: true, highlight: this.highlightFn});

  constructor(private sanitizer: DomSanitizer) {}

  getItemBodyMarkdown(store: DataStore, itemId: string): Observable<SafeHtml> {
    return store.items.get(itemId).pipe(map(item => this.render(item ? item.body : '')));
  }

  render(text: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.md.render(text || '[No item body]'));
  }
}

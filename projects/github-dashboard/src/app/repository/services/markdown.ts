import {Injectable} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as hljs from 'highlight.js';
import * as Remarkable from 'remarkable';

@Injectable()
export class Markdown {

  md = new Remarkable({
    html: true, breaks: true, linkify: true, highlight: (str: string, lang: string) => {
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
  });

  constructor(private sanitizer: DomSanitizer) {
  }

  render(text: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.md.render(text || '[No item body]'));
  }
}

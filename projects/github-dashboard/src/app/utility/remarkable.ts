import * as hljs from 'highlight.js';
import * as Remarkable from 'remarkable';

export const markdown = new Remarkable({
  html: true,
  breaks: true,
  linkify: true,
  highlight: (str, lang) => {
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

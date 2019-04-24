import {combineLatest, EMPTY, Observable, ReplaySubject} from 'rxjs';
import {map, startWith, take} from 'rxjs/operators';

export interface ViewerState {
  views: string[];
}

interface RenderedViewWithText {
  text: string;
  classList?: string;
  styles?: {[key in string]: string};
}

interface RenderedViewWithChildren {
  children: RenderedView[];
  classList?: string;
  styles?: {[key in string]: string};
}

export type RenderedView = RenderedViewWithText|RenderedViewWithChildren;

export interface ViewerMetadata<T = any, C = any> {
  label: string;
  render: (item: T, context: C) => RenderedView | null;
}

export interface ViewLabel {
  id: string;
  label: string;
}

export type ViewerContextProvider<T, C> = Observable<(item: T) => C>;

export interface ViewerOptions<T, C> {
  metadata?: Map<string, ViewerMetadata<T, C>>;
  contextProvider?: ViewerContextProvider<T, C>;
  initialState?: ViewerState;
}

/** The viewer carries information to render the items to the view. */
export class Viewer<T = any, C = any> {
  private metadata: Map<string, ViewerMetadata<T, C>>;

  private contextProvider: ViewerContextProvider<T, C>;

  state = new ReplaySubject<ViewerState>(1);

  constructor(options: ViewerOptions<T, C> = {}) {
    this.metadata = options.metadata || new Map();
    this.state.next(options.initialState || {views: this.getViews().map(v => v.id)});
    this.contextProvider = options.contextProvider || EMPTY.pipe(startWith(() => null));
  }

  getViews(): ViewLabel[] {
    const views: ViewLabel[] = [];
    this.metadata.forEach((value, key) => views.push({id: key, label: value.label}));
    return views;
  }

  toggle(view: string) {
    this.state.pipe(take(1)).subscribe(state => {
      const views = state.views;

      const newViews = [...views];
      const index = views.indexOf(view);
      if (index !== -1) {
        newViews.splice(index, 1);
      } else {
        newViews.push(view);
      }

      this.setState({views: newViews});
    });
  }

  setState(state: ViewerState) {
    this.state.next({...state});
  }

  isEquivalent(otherState?: ViewerState): Observable<boolean> {
    return this.state.pipe(map(state => {
      if (!otherState) {
        return false;
      }
      const thisViews = state.views.slice().sort();
      const otherViews = otherState.views.slice().sort();

      return thisViews.length === otherViews.length &&
          thisViews.every((v, i) => otherViews[i] === v);
    }));
  }

  getRenderedViews(item: T): Observable<RenderedView[]> {
    return combineLatest(this.state, this.contextProvider).pipe(map(results => {
      const views = results[0].views.map(v => this.metadata.get(v));
      const context = results[1](item);
      return views.map(view => view.render(item, context));
    }));
  }
}

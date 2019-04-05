import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {map, take} from 'rxjs/operators';

export interface ViewerState<V = any> {
  views: V[];
}

export interface RenderedView {
  label: string;
  containerClassList?: string;
  containerStyles?: {[key in string]: string};
  renderedParts: RenderedPart[];
}

export interface RenderedPart {
  text: string;
  classList?: string;
  styles?: {[key in string]: string};
}

export interface ViewerMetadata<V, C> {
  id: V;
  label: string;
  containerClassList?: string;
  containerStyles?: {[key in string]: string};
  renderParts: (context: C) => RenderedPart[];
}

export type ViewerContextProvider<T, C> = Observable<(item: T) => C>;

/** The viewer carries information to render the items to the view. */
export class Viewer<T = any, V = any, C = any> {
  state = new ReplaySubject<ViewerState<V>>(1);

  constructor(
      public metadata: Map<V, ViewerMetadata<V, C>>,
      private contextProvider: ViewerContextProvider<T, C>) {}

  getViews(): ViewerMetadata<V, C>[] {
    const views: ViewerMetadata<V, C>[] = [];
    this.metadata.forEach(view => views.push(view));
    return views;
  }

  toggle(view: V) {
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

  setState(state: ViewerState<V>) {
    this.state.next({...state});
  }

  isEquivalent(otherState?: ViewerState<V>): Observable<boolean> {
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
      const views = results[0].views.map(v => this.metadata.get(v)!);
      const context = results[1](item);

      return views.map(view => {
        const renderedView: RenderedView = {
          label: view.label,
          containerClassList: view.containerClassList,
          containerStyles: view.containerStyles,
          renderedParts: view.renderParts(context)
        };
        return renderedView;
      });
    }));
  }
}

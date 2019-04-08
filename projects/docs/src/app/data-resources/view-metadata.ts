import {Viewer, ViewerMetadata, ViewerState} from '@crafted/data';
import {of} from 'rxjs';
import {DocumentationData} from '../data';

export function getViewerProvider(): (initialState?: ViewerState) =>
    Viewer<DocumentationData, ViewContext> {
  return (initialState?: ViewerState) => {
    const viewer = new Viewer(ViewerMetadata, of());
    viewer.setState(initialState || {views: viewer.getViews().map(v => v.id)});
    return viewer;
  };
}

interface ViewContext {
  d: DocumentationData;
}

const ViewerMetadata = new Map<string, ViewerMetadata<ViewContext>>([
  [
    'id',
    {label: 'ID', render: (c: ViewContext) => ({text: `${c.d.id}`})},
  ],
]);

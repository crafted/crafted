import {Viewer, ViewerMetadata, ViewerState} from '@crafted/data';
import {of} from 'rxjs';
import {DocumentationData} from '../data';

export function getViewerProvider(): (initialState?: ViewerState) =>
    Viewer<DocumentationData, DocumentationDataView, ViewContext> {
  return (initialState?: ViewerState) => {
    const viewer = new Viewer(ViewerMetadata, of());
    viewer.setState(initialState || {views: viewer.getViews().map(v => v.id)});
    return viewer;
  };
}

type DocumentationDataView = 'id'|'name'|'color'|'age'|'anniversary';

interface ViewContext {
  d: DocumentationData;
}

const ViewerMetadata =
    new Map<DocumentationDataView, ViewerMetadata<DocumentationDataView, ViewContext>>([
      [
        'id',
        {
          id: 'id',
          label: 'ID',
          containerClassList: 'title theme-text',
          containerStyles: {
            marginBottom: '4px',
            fontSize: '15px',
          },
          renderParts: (c: ViewContext) => [{text: `${c.d.id}`}],
        },
      ],
    ]);

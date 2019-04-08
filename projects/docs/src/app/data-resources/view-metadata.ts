import {ViewerMetadata} from '@crafted/data';
import {DocumentationData} from '../data';

interface ViewContext {
  d: DocumentationData;
}

export const DocsDataViewerMetadata = new Map<string, ViewerMetadata<ViewContext>>([
  [
    'id',
    {
      label: 'ID',
      render: (docData: DocumentationData) => ({text: `${docData.id}`}),
    },
  ],
]);

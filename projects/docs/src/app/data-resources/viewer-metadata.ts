import {DatePipe} from '@angular/common';
import {ViewerMetadata} from '@crafted/data';
import {ExampleItem} from '../data';

export const DocsDataViewerMetadata = new Map<string, ViewerMetadata>([
  [
    'title',
    {
      label: 'Title',
      render: (exampleData: ExampleItem) => ({
        styles: {fontWeight: 'bold'},
        text: `${exampleData.name} (#${exampleData.id})`,
      }),
    },
  ],
  [
    'color',
    {
      label: 'Color',
      render: (docData: ExampleItem) => ({
        text: `Favorite color: ${docData.color}`,
      }),
    },
  ],
  [
    'age',
    {
      label: 'Age',
      render: (docData: ExampleItem) => ({
        text: `${docData.age} years old`,
      }),
    },
  ],
  [
    'anniversary',
    {
      label: 'Anniversary',
      render: (docData: ExampleItem) => {
        const datePipe = new DatePipe('en-us');
        return {
          text: `Aniversary ${datePipe.transform(docData.anniversary)}`,
        };
      },
    },
  ],
]);

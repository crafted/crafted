import {DatePipe} from '@angular/common';
import {ViewerMetadata} from '@crafted/data';
import {ExampleItem} from '../data';

export const ExampleViewerMetadata = new Map<string, ViewerMetadata<ExampleItem>>([
  [
    'title',
    {
      label: 'Title',
      render: item => ({
        styles: {fontWeight: 'bold'},
        text: `${item.name} (#${item.id})`,
      }),
    },
  ],
  [
    'color',
    {
      label: 'Color',
      render: item => ({
        text: `Favorite color: ${item.color}`,
      }),
    },
  ],
  [
    'age',
    {
      label: 'Age',
      render: item => ({
        text: `${item.age} years old`,
      }),
    },
  ],
  [
    'anniversary',
    {
      label: 'Anniversary',
      render: item => {
        const datePipe = new DatePipe('en-us');
        return {
          text: `Aniversary ${datePipe.transform(item.anniversary)}`,
        };
      },
    },
  ],
]);

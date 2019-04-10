import {DatePipe} from '@angular/common';
import {ViewerMetadata} from '@crafted/data';
import {ExampleItem} from '../data';

export const ExampleViewerMetadata = new Map<string, ViewerMetadata<ExampleItem>>([
  [
    'title',
    {
      label: 'Title',
      render: item => ({
        styles: {fontWeight: 'bold', display: 'block'},
        text: `${item.name} (#${item.id})`,
      }),
    },
  ],
  [
    'color',
    {
      label: 'Color',
      render: item => ({
        styles: {display: 'block'},
        text: `Favorite color: ${item.color}`,
      }),
    },
  ],
  [
    'age',
    {
      label: 'Age',
      render: item => ({
        styles: {display: 'block'},
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
          styles: {display: 'block'},
          text: `Aniversary ${datePipe.transform(item.anniversary)}`,
        };
      },
    },
  ],
]);

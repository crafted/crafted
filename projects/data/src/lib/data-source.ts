import {Observable, of} from 'rxjs';

export interface DataSourceMetadata<T> {
  label: string;
  type: string;
  accessor: (item: T) => any;
}

export interface DataLabel {
  id: string;
  label: string;
}

export class DataSource<T = any> {
  data: Observable<T[]>;

  constructor(
      private _data: Observable<T[]>|T[],
      public metadata: Map<string, DataSourceMetadata<T>> = new Map()) {
    if (_data instanceof Observable) {
      this.data = this._data as Observable<T[]>;
    } else if (Array.isArray(_data)) {
      this.data = of(_data);
    }
  }

  getDataLabelsWithType(type: string): DataLabel[] {
    const dataLabelsWithType: DataLabel[] = [];
    this.metadata.forEach((value, key) => {
      if (value.type === type) {
        dataLabelsWithType.push({id: key, label: value.label});
      }
    });
    return dataLabelsWithType;
  }
}

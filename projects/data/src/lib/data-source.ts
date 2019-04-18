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

export interface DataSourceOptions<T> {
  data?: Observable<T[]>|T[];
  metadata?: Map<string, DataSourceMetadata<T>>;
}

export class DataSource<T = any> {
  // TODO: Make this private
  public metadata: Map<string, DataSourceMetadata<T>>;

  data: Observable<T[]>;

  constructor(options: DataSourceOptions<T> = {}) {
    if (options.data instanceof Observable) {
      this.data = options.data as Observable<T[]>;
    } else if (Array.isArray(options.data)) {
      this.data = of(options.data);
    } else {
      this.data = of([]);
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

export type TextEquality = 'contains'|'is'|'notContains'|'notIs';
export type NumberEquality = 'greaterThan'|'lessThan'|'equalTo';
export type DateEquality = 'before'|'after'|'on';
export type StateEquality = 'is'|'notIs';

export interface TextFilter {
  id: string;
  type: 'text';
  value: string;
  equality: TextEquality;
}

export interface NumberFilter {
  id: string;
  type: 'number';
  value: number;
  equality: NumberEquality;
}

export interface DateFilter {
  id: string;
  type: 'date';
  date: string;
  equality: DateEquality;
}

export interface StateFilter {
  id: string;
  type: 'state';
  state: string;
  equality: StateEquality;
}

export type Filter = TextFilter|NumberFilter|DateFilter|StateFilter;

export type FilterType = 'text'|'number'|'date'|'state';

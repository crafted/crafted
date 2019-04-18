export type InputEquality = 'contains'|'is'|'notContains'|'notIs';
export type NumberEquality = 'greaterThan'|'lessThan'|'equalTo';
export type DateEquality = 'before'|'after'|'on';
export type StateEquality = 'is'|'notIs';

export interface InputFilter {
  id: string;
  type: 'input';
  input: string;
  equality: InputEquality;
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

export type Filter = InputFilter|NumberFilter|DateFilter|StateFilter;

export type FilterType = 'input'|'number'|'date'|'state';

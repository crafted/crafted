import {DateEquality, NumberEquality, StateEquality, TextEquality} from '../filterer-types';

const OR = ' OR ';
const AND = ' AND ';

export function textMatchesEquality(
    inputValue: string, filterValue: string, equality: TextEquality): boolean {
  if (!inputValue) {
    return false;
  }

  if (!filterValue) {
    return true;
  }

  if (filterValue === '""') {
    filterValue = '';
  }

  // If it contains OR, split it up and try again for each piece (one has to be true)
  if (filterValue.indexOf(OR) !== -1) {
    return filterValue.split(OR).some(inputToken => {
      return textMatchesEquality(inputValue, inputToken, equality);
    });
  }

  // If it contains AND, split it up and try again for each piece (every one has to be true)
  if (filterValue.indexOf(AND) !== -1) {
    return filterValue.split(AND).every(inputToken => {
      return textMatchesEquality(inputValue, inputToken, equality);
    });
  }

  switch (equality) {
    case 'contains':
      return inputValue.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
    case 'is':
      return inputValue.toLowerCase() === filterValue.toLowerCase();
    case 'notContains':
      return inputValue.toLowerCase().indexOf(filterValue.toLowerCase()) === -1;
    case 'notIs':
      return inputValue.toLowerCase() !== filterValue.toLowerCase();
    default:
      throw Error(`Unknown equality: ${equality}`);
  }
}

export function numberMatchesEquality(
    inputNumber: number, filterNumber: number, equality: NumberEquality): boolean {
  if (!filterNumber && filterNumber !== 0) {
    return true;
  }

  switch (equality) {
    case 'greaterThan':
      return inputNumber > filterNumber;
    case 'lessThan':
      return inputNumber < filterNumber;
    case 'equalTo':
      // Double-equals to cast in cases where the number was stored as a string
      return inputNumber == filterNumber;
    default:
      throw Error(`Unknown equality: ${equality}`);
  }
}

export function dateMatchesEquality(
    inputDateStr: string, filterDateStr: string, equality: DateEquality): boolean {
  if (!filterDateStr) {
    return true;
  }

  if (!inputDateStr) {
    return false;
  }

  const inputDate = new Date(inputDateStr);
  const filterDate = new Date(filterDateStr);

  switch (equality) {
    case 'after':
      return inputDate > filterDate;
    case 'before':
      return inputDate < filterDate;
    case 'on':
      return inputDate.toISOString() === filterDate.toISOString();
    default:
      throw Error(`Unknown equality: ${equality}`);
  }
}


export function stateMatchesEquality(
    inputState: boolean, filterState: string, equality: StateEquality): boolean {
  if (!filterState) {
    return true;
  }

  switch (equality) {
    case 'is':
      return inputState;
    case 'notIs':
      return !inputState;
    default:
      throw Error(`Unknown equality: ${equality}`);
  }
}

export function textArrayMatchesEquality(
    input: string[], filterValue: string, equality: TextEquality): boolean {
  // If it contains OR, split it up and try again for each piece (one has to be true)
  if (filterValue.indexOf(OR) !== -1) {
    return filterValue.split(OR).some(inputToken => {
      return textArrayMatchesEquality(input, inputToken, equality);
    });
  }

  // If it contains AND, split it up and try again for each piece (every one has to be true)
  if (filterValue.indexOf(AND) !== -1) {
    return filterValue.split(AND).every(inputToken => {
      return textArrayMatchesEquality(input, inputToken, equality);
    });
  }

  const transformedInput = input.map(v => `"${v}"`).sort().toString() || '[]';
  const transformedFilterValue =
      filterValue ? filterValue.split(',').map(v => `"${v}"`).sort().toString() : '[]';

  return textMatchesEquality(transformedInput, transformedFilterValue, equality);
}

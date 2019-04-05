import {Label} from '../app-types/label';

/** Create a map of labels keyed by their ID and name. */
export function createLabelsMap(labels: Label[]) {
  const labelsMap = new Map<string, Label>();
  labels.forEach(label => {
    labelsMap.set(label.id, label);
    labelsMap.set(label.name, label);
  });
  return labelsMap;
}

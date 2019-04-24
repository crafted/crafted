import {filterItems, searchItems} from '@crafted/data';
import {Item} from '../../github/app-types/item';
import {Label} from '../../github/app-types/label';
import {ITEM_FILTERER_METADATA} from '../../github/data-source/item-filterer-metadata';
import {tokenizeItem} from '../../github/utility/tokenize-item';
import {Recommendation} from '../services/dao/config/recommendation';

export function getRecommendations(
    item: Item, recommendations: Recommendation[],
    labelsMap: Map<string, Label>): Recommendation[] {
  if (!item) {
    return [];
  }

  return recommendations.filter(recommendation => {
    const contextProvider = {
      labelsMap,
      // Cannot create recommendations based on recommendations (circular loop)
      getRecommendations: () => [],
    };

    const filters = recommendation.filtererState ? recommendation.filtererState.filters : [];
    const filteredItems = filterItems([item], filters, contextProvider, ITEM_FILTERER_METADATA);

    const search = recommendation.filtererState ? recommendation.filtererState.search : '';
    const searchedItems = searchItems(filteredItems, search, tokenizeItem);

    return !!searchedItems.length;
  });
}

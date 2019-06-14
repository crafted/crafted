import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {Remover} from '../services/remover';
import {AppState} from '../store';
import {selectContributorTotal} from '../store/contributor/contributor.reducer';
import {selectItemTotal} from '../store/item/item.reducer';
import {selectLabelIds, selectLabelTotal} from '../store/label/label.reducer';
import {selectRepositoryName} from '../store/name/name.reducer';

@Component({
  selector: 'database-page',
  styleUrls: ['database-page.scss'],
  templateUrl: 'database-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatabasePage {
  activeRepository = this.store.select(selectRepositoryName);

  repoLabels = this.store.select(selectLabelIds);

  counts = {
    items: this.store.select(selectItemTotal),
    labels: this.store.select(selectLabelTotal),
    contributors: this.store.select(selectContributorTotal),
  };

  constructor(public remover: Remover, private store: Store<AppState>) {}

  remove() {
    this.remover.removeAllData(true);
  }
}

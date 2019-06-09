import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {LoadedRepos} from '../../service/loaded-repos';
import {Remover} from '../services/remover';
import {AppState, selectIsRepoStateEmpty} from '../store';
import {selectContributorTotal} from '../store/contributor/contributor.reducer';
import {selectItemTotal} from '../store/item/item.reducer';
import {selectLabelIds, selectLabelTotal} from '../store/label/label.reducer';
import {selectRepositoryName} from '../store/repository/repository.reducer';

@Component({
  selector: 'database-page',
  styleUrls: ['database-page.scss'],
  templateUrl: 'database-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatabasePage {
  activeRepository = this.store.select(selectRepositoryName);

  isLoading = false;

  isEmpty = this.store.select(selectIsRepoStateEmpty);

  isLoaded = combineLatest(this.activeRepository, this.loadedRepos.repos$)
                 .pipe(map(([repository, repos]) => repos.indexOf(repository) !== -1));

  repoLabels = this.store.select(selectLabelIds);

  counts = {
    items: this.store.select(selectItemTotal),
    labels: this.store.select(selectLabelTotal),
    contributors: this.store.select(selectContributorTotal),
  };

  constructor(
      private loadedRepos: LoadedRepos, public remover: Remover, private store: Store<AppState>) {}

  remove() {
    this.remover.removeAllData(true);
  }
}

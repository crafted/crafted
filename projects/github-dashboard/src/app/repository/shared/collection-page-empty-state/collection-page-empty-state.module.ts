import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {CollectionPageEmptyState} from './collection-page-empty-state';

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [CollectionPageEmptyState],
  exports: [CollectionPageEmptyState],
})
export class CollectionPageEmptyStateModule {
}

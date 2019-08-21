import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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

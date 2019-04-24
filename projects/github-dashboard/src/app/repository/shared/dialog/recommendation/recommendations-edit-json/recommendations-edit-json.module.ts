import {TextFieldModule} from '@angular/cdk/text-field';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule
} from '@angular/material';
import {RecommendationsEditJson} from './recommendations-edit-json';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    TextFieldModule,
    MatExpansionModule,
    MatIconModule,
  ],
  declarations: [RecommendationsEditJson],
  exports: [RecommendationsEditJson],
  entryComponents: [RecommendationsEditJson]
})
export class RecommendationsEditJsonModule {
}

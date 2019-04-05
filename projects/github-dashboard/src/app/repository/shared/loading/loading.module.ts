import {NgModule} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material';
import {Loading} from './loading';

@NgModule({
  imports: [MatProgressSpinnerModule],
  declarations: [Loading],
  exports: [Loading],
})
export class LoadingModule {
}

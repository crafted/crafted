import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {RateLimitReached} from './rate-limit.reached';

@NgModule({
  imports: [MatIconModule, MatButtonModule, CommonModule],
  declarations: [RateLimitReached],
  exports: [RateLimitReached],
  entryComponents: [RateLimitReached],
})
export class RateLimitReachedModule {
}

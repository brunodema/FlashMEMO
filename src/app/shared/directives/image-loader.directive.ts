/**
 * Directive idea stolen from here: https://stackoverflow.com/questions/29742508/show-loading-gif-while-image-is-loading. PS: Don't forget to declare/export your directives :D
 */

import { Directive, HostListener, Input, HostBinding } from '@angular/core';
@Directive({ selector: '[imageLoader]' })
export class ImageLoaderDirective {
  @Input('src') imageSrc: any;
  @HostListener('load')
  loadImage() {
    this.srcAttr = this.imageSrc;
  }

  @HostBinding('attr.src') srcAttr = 'assets/loading.svg';
  constructor() {}
}

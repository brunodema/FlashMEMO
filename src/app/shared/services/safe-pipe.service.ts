import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
@Pipe({ name: 'safe' })
export class SafePipeService implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url : string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

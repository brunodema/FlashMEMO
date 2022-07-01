import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

export enum SpinnerType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOADING = 'loading',
  SEARCHING = 'searching',
}

@Injectable({
  providedIn: 'root',
})
export abstract class GenericSpinnerService {
  constructor(protected spinnerService: NgxSpinnerService) {}

  // I tried to create a function that took 'work' as an argument (i.e., make an API request or something), and showed the spinner while the work was being done, but it didn't work :((((

  showSpinner(spinnerType: SpinnerType) {
    this.spinnerService.show(spinnerType);
  }

  hideSpinner(spinnerType: SpinnerType) {
    this.spinnerService.hide(spinnerType);
  }

  /** To be used to avoid screen-locking with spinners in certain situations (ex: errors thrown). */
  killAllSpinners() {
    this.spinnerService.hide(SpinnerType.LOGIN);
    this.spinnerService.hide(SpinnerType.LOGOUT);
    this.spinnerService.hide(SpinnerType.LOADING);
    this.spinnerService.hide(SpinnerType.SEARCHING);
  }
}

@Injectable({
  providedIn: 'root',
})
export class SpinnerService extends GenericSpinnerService {
  constructor(protected spinnerService: NgxSpinnerService) {
    super(spinnerService);
  }
}

import { Injectable } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';

export abstract class GenericNotificationService {
  abstract showSuccess(message: string, title?: string): ActiveToast<any>;
  abstract showInfo(message: string, title?: string): ActiveToast<any>;
  abstract showWarning(message: string, title?: string): ActiveToast<any>;
  abstract showError(message: string, title?: string): ActiveToast<any>;
}

@Injectable()
export class NotificationService implements GenericNotificationService {
  constructor(protected service: ToastrService) {}

  showSuccess(message: string, title?: string): ActiveToast<any> {
    return this.service.success(message, title ?? 'Success!');
  }
  showInfo(message: string, title?: string): ActiveToast<any> {
    return this.service.info(message, title ?? 'Info:');
  }
  showWarning(message: string, title?: string): ActiveToast<any> {
    return this.service.warning(message, title ?? 'Warning!');
  }
  showError(message: string, title?: string): ActiveToast<any> {
    return this.service.error(message, title ?? 'Error!');
  }
}

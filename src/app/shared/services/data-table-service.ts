// To be honest, I'm not even sure what this does at the moment. I'll leave it here for safety reasons

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IServiceSearchParams } from '../models/other/api-query-types';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataTableService<Type> {
  search: (searchParams: IServiceSearchParams) => Observable<Type[]>;
}

// To be honest, I'm not even sure what this does at the moment. I'll leave it here for safety reasons

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IServiceSearchParams } from '../models/other/api-query-types';

// Declaring this as an abstract class per recomendation of other Angular users, since interfaces can't be used for 'providers: [{ provide: NonInterfaceClass, useClass: ActualImplementationClass }]' declarations

@Injectable()
/**
 * Abstract class that defines behavior for types that are used in DataTable objects. Ex: News objects can be shown in a DataTable with filtering, sorting, and ordering.
 */
export abstract class GeneralDataTableService<Type> {
  abstract search(searchParams: IServiceSearchParams): Observable<Type[]>;
}

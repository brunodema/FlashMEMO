import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IServiceSearchParams } from 'src/app/shared/models/IServiceSearchParams';

@Injectable({
  providedIn: 'root',
})
export class DataTableService<Type> {
  search: (searchParams: IServiceSearchParams) => Observable<Type[]>;
}

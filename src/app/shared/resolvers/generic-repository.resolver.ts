import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { Deck } from 'src/app/deck/models/deck.model';
import { GenericDeckService } from 'src/app/deck/services/deck.service';
import { User } from 'src/app/user/models/user.model';
import { GenericUserService } from 'src/app/user/services/user.service';
import { GenericRepositoryService } from '../services/general-repository.service';

@Injectable()
export class GenericRepositoryResolverService<Type> implements Resolve<Type> {
  constructor(
    private service: GenericRepositoryService<Type>,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Type | Observable<Type> | Promise<Type> {
    // console.log('id is: ' + route.paramMap.get('id'));
    let id = route.params['id'];
    console.log('resolver: id is ' + id);
    if (id) {
      console.log('resolver: id is not empty, underlying service is:', this.service)
      return this.service.getById(id).pipe(
        map((r) => {
          console.log('resolver: mapping result', r)
          if (r) {
            console.log('resolver: result from service is: ', r);
            return r;
          } else {
            console.log(
              'resolver: provided id does not provide a valid object.'
            );
            this.router.navigate(['']);
            throw new Error('Provided id does not provide a valid object.');
          }
        })
      );
    }
    this.router.navigate(['']);
    console.log("resolver: provided id is likely 'null' or 'undefined'.");
    throw new Error('Provided id does not provide a valid object.');
  }
}

@Injectable()
export class DeckRepositoryResolverService extends GenericRepositoryResolverService<Deck> {
  constructor(service: GenericDeckService, router: Router) {
    super(service, router);
  }
}

@Injectable()
export class UserRepositoryResolverService extends GenericRepositoryResolverService<User> {
  constructor(service: GenericUserService, router: Router) {
    super(service, router);
  }
}

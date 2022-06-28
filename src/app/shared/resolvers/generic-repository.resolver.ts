import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { map, tap } from 'rxjs/operators';
import { Deck } from 'src/app/deck/models/deck.model';
import { GenericDeckService } from 'src/app/deck/services/deck.service';
import { News } from 'src/app/news/models/news.model';
import { GenericNewsService } from 'src/app/news/services/news.service';
import { User } from 'src/app/user/models/user.model';
import { GenericUserService } from 'src/app/user/services/user.service';
import { GenericRepositoryService } from '../services/general-repository.service';
import { GenericLoggerService } from '../services/logging/logger.service';

export class GenericRepositoryResolverService<Type> implements Resolve<Type> {
  constructor(
    protected service: GenericRepositoryService<Type>,
    protected router: Router,
    @Inject('GenericLoggerService')
    protected loggerService: GenericLoggerService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Type | Observable<Type> | Promise<Type> {
    let id = route.params['id'];
    this.loggerService.logDebug('resolver: id is ' + id);
    if (id) {
      this.loggerService.logDebug(
        'resolver: id is not empty, underlying service is:',
        this.service
      );

      return this.service.getById(id).pipe(
        map((r) => {
          this.loggerService.logDebug('resolver: mapping result', r);

          if (r) {
            this.loggerService.logDebug(
              'resolver: result from service is: ',
              r
            );

            return r;
          } else {
            this.loggerService.logDebug(
              'resolver: provided id does not provide a valid object.'
            );
            this.router.navigate(['']);
            throw new Error('Provided id does not provide a valid object.');
          }
        })
      );
    }
    this.router.navigate(['']);
    this.loggerService.logDebug(
      "resolver: provided id is likely 'null' or 'undefined'."
    );
    throw new Error('Provided id does not provide a valid object.');
  }
}

@Injectable()
export class DeckRepositoryResolverService extends GenericRepositoryResolverService<Deck> {
  constructor(
    @Inject('GenericDeckService') service: GenericDeckService,
    router: Router,
    @Inject('GenericLoggerService')
    protected loggerService: GenericLoggerService
  ) {
    super(service, router, loggerService);
  }
}

@Injectable()
export class UserRepositoryResolverService extends GenericRepositoryResolverService<User> {
  constructor(
    @Inject('GenericUserService') service: GenericUserService,
    router: Router,
    @Inject('GenericLoggerService')
    protected loggerService: GenericLoggerService
  ) {
    super(service, router, loggerService);
  }
}

@Injectable()
export class NewsRepositoryResolverService {
  constructor(
    @Inject('GenericNewsService') protected service: GenericNewsService,
    @Inject('GenericUserService') protected userService: GenericUserService,
    protected router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): News | Observable<News> | Promise<News> {
    let id = route.params['id'];
    if (id) {
      return this.service.getById(id).pipe(tap((r) => r));
    }
    this.router.navigate(['']);
    throw new Error('Provided id does not provide a valid object.');
  }
}

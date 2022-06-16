import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap } from 'rxjs/operators';
import { Deck } from 'src/app/deck/models/deck.model';
import { GenericDeckService } from 'src/app/deck/services/deck.service';
import { ExtendedNews, News } from 'src/app/news/models/news.model';
import { GenericNewsService } from 'src/app/news/services/news.service';
import { User } from 'src/app/user/models/user.model';
import { GenericUserService } from 'src/app/user/services/user.service';
import { GenericRepositoryService } from '../services/general-repository.service';

export class GenericRepositoryResolverService<Type> implements Resolve<Type> {
  constructor(
    protected service: GenericRepositoryService<Type>,
    protected router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Type | Observable<Type> | Promise<Type> {
    // console.log('id is: ' + route.paramMap.get('id'));
    let id = route.params['id'];
    console.log('resolver: id is ' + id);
    if (id) {
      console.log(
        'resolver: id is not empty, underlying service is:',
        this.service
      );
      return this.service.getById(id).pipe(
        map((r) => {
          console.log('resolver: mapping result', r);
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
  constructor(
    @Inject('GenericDeckService') service: GenericDeckService,
    router: Router
  ) {
    super(service, router);
  }
}

@Injectable()
export class UserRepositoryResolverService extends GenericRepositoryResolverService<User> {
  constructor(
    @Inject('GenericUserService') service: GenericUserService,
    router: Router
  ) {
    super(service, router);
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
  ): ExtendedNews | Observable<ExtendedNews> | Promise<ExtendedNews> {
    console.log('id is: ' + route.paramMap.get('id'));
    let id = route.params['id'];
    console.log('resolver: id is ' + id);
    if (id) {
      console.log(
        'resolver: id is not empty, underlying service is:',
        this.service
      );

      return this.service.getById(id).pipe(
        switchMap((r) =>
          this.userService.getById(r.ownerId).pipe(
            map(
              (u) =>
                new ExtendedNews({
                  content: r.content,
                  creationDate: r.creationDate,
                  lastUpdated: r.lastUpdated,
                  newsId: r.newsId,
                  subtitle: r.subtitle,
                  title: r.title,
                  thumbnailPath: r.thumbnailPath,
                  ownerId: r.ownerId,
                  ownerInfo: u,
                })
            )
          )
        )
      );
    }
    this.router.navigate(['']);
    console.log("resolver: provided id is likely 'null' or 'undefined'.");
    throw new Error('Provided id does not provide a valid object.');
  }
}

import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { News } from 'src/app/news/models/news.model';
import { NewsService } from 'src/app/news/services/news.service';
import { GeneralRepositoryService } from 'src/app/shared/services/general-repository-service';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { Deck } from 'src/app/deck/models/deck.model';
import { Flashcard } from 'src/app/shared/models/flashcard';
import {
  DeckService,
  MockDeckService,
} from 'src/app/deck/services/deck.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [{ provide: GeneralRepositoryService, useClass: MockDeckService }],
})
export class UserListComponent implements AfterViewInit {
  routes: RouteMap[] = [{ label: 'Create User', route: 'create' }];

  @ViewChild('lol') dataTable: DataTableComponent<Deck>;
  @ViewChild('lolo') dataTable2: DataTableComponent<Flashcard>;

  constructor(public service: GeneralRepositoryService<News>) {}

  ngAfterViewInit(): void {
    console.log(this.dataTable);
    console.log(this.dataTable2);
  }
}

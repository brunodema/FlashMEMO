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
import { MockFlashcardService } from 'src/app/shared/services/shared-services';

@Component({
  selector: 'app-user',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [
    { provide: 'DeckService', useClass: MockDeckService },
    { provide: 'FlashcardService', useClass: MockFlashcardService },
  ],
})

// this component is a complete shitshow at the moment... pretty much a sandbox for weird shit I want to implement
export class UserListComponent implements AfterViewInit {
  routes: RouteMap[] = [{ label: 'Create User', route: 'create' }];

  @ViewChild('lol') dataTable: DataTableComponent<Deck>;
  @ViewChild('lolo') dataTable2: DataTableComponent<Flashcard>;

  deckData: Deck[];
  flashcardData: Flashcard[];

  constructor(
    @Inject('DeckService') public deckService: GeneralRepositoryService<Deck>,
    @Inject('FlashcardService')
    public flashcardService: GeneralRepositoryService<Flashcard>
  ) {
    this.deckService
      .search({ pageSize: 100, pageNumber: 1 })
      .subscribe((r) => (this.deckData = r));
    this.flashcardService
      .search({ pageSize: 100, pageNumber: 1 })
      .subscribe((r) => (this.flashcardData = r));
  }

  ngAfterViewInit(): void {}
}

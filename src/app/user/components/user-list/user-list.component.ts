import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { RouteMap } from 'src/app/shared/models/routing/route-map';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { Deck } from 'src/app/deck/models/deck.model';
import { IFlashcard } from 'src/app/shared/models/flashcard.model';
import { GenericDeckService } from 'src/app/deck/services/deck.service';
import { GenericFlashcardService } from 'src/app/shared/services/flashcard.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})

// this component is a complete shitshow at the moment... pretty much a sandbox for weird shit I want to implement
export class UserListComponent implements AfterViewInit {
  routes: RouteMap[] = [{ label: 'Create User', route: 'create' }];

  @ViewChild('lol') dataTable: DataTableComponent<Deck>;
  @ViewChild('lolo') dataTable2: DataTableComponent<IFlashcard>;

  deckData: Deck[];
  flashcardData: IFlashcard[];

  constructor(
    public deckService: GenericDeckService,
    public flashcardService: GenericFlashcardService
  ) {
    this.deckService.getAll().subscribe((r) => (this.deckData = r));
    this.flashcardService.getAll().subscribe((r) => (this.flashcardData = r));
  }

  ngAfterViewInit(): void {}
}

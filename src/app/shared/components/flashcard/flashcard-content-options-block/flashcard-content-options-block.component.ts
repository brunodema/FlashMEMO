import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import {
  IPaginatedListResponse,
  PaginatedListResponse,
} from 'src/app/shared/models/http/http-response-types';
import {
  GeneralImageAPIService,
  IImageAPIResult,
  MockImageAPIService,
} from 'src/app/shared/services/api-services';

/* TIL about the 'host'property

Apparently we can use this property to set things related to the wrapper element that Angular will add to the DOM after compiling the app. 
In this case, I add all those classes so the layout of the rows/columns is the way I want. */

@Component({
  selector: 'app-flashcard-content-options-block',
  host: { class: 'd-flex flex-fill align-items-center justify-content-center' },
  templateUrl: './flashcard-content-options-block.component.html',
  styleUrls: ['./flashcard-content-options-block.component.css'],
  providers: [
    { provide: GeneralImageAPIService, useClass: MockImageAPIService },
  ],
})
export class FlashcardContentOptionsBlock implements OnInit {
  closeResult: string;
  modalTitle: string;

  // Image API section
  imageAPIData$: Observable<PaginatedListResponse<IImageAPIResult>>;
  imageResults: IImageAPIResult[];
  hasPrevious: boolean;
  hasNext: boolean;

  constructor(
    private modalService: NgbModal,
    private imageAPIService: GeneralImageAPIService
  ) {}

  ngOnInit(): void {}

  openXl(content: any, type: string) {
    this.modalTitle = type;
    this.modalService.open(content, { size: 'xl', scrollable: true });
  }

  searchImage() {
    console.log('search');
    this.imageAPIData$ = of(this.imageAPIService.searchImage('lol', 1));
    this.imageAPIData$.subscribe((r) => {
      this.imageResults = r.data.results;
      this.hasPrevious = r.data.hasPreviousPage;
      this.hasNext = r.data.hasNextPage;
    });
  }
}

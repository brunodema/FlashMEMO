import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TouchSequence } from 'selenium-webdriver';
import {
  DataTableColumnOptions,
  DataTableComponent,
} from 'src/app/shared/components/data-table/data-table.component';
import { Flashcard, FlashcardLayout } from 'src/app/shared/models/flashcard';
import { GenericFlashcardService } from 'src/app/shared/services/flashcard.service';
import { GenericLanguageService } from 'src/app/shared/services/language.service';
import { Deck } from '../../models/deck.model';
import { GenericDeckService } from '../../services/deck.service';

@Component({
  selector: 'app-deck-detail',
  styleUrls: ['./deck-detail.component.css'],
  templateUrl: './deck-detail.component.html',
})
export class DeckDetailComponent {
  closeResult = '';
  layoutEnum: typeof FlashcardLayout = FlashcardLayout;
  // implementation stolen from: https://stackoverflow.com/questions/56036446/typescript-enum-values-as-array
  possibleLayouts = Object.values(FlashcardLayout).filter(
    (f) => typeof f === 'string'
  );
  flashcardLayout: FlashcardLayout = FlashcardLayout.SINGLE_BLOCK;

  // form stuff for deck info
  form = new FormGroup({});
  model = {}; // apparently has to be of 'any' type
  fields: FormlyFieldConfig[] = [
    {
      // id is not necessary
      key: 'name',
      type: 'input',
      templateOptions: {
        label: 'Deck Name',
        placeholder: 'Enter the Deck name',
        required: true,
      },
      className: 'd-block mb-2',
    },
    {
      key: 'description',
      type: 'textarea',
      templateOptions: {
        label: 'Description',
        placeholder: 'Describe your deck',
        required: false,
        rows: 5,
        grow: false,
      },
      className: 'd-block mb-2',
    },
    {
      key: 'language',
      type: 'select',
      templateOptions: {
        label: 'Language',
        options: [], // is assigned in constructor
      },
    },
  ];

  // deck info
  deck: Deck;

  // flashcard info
  flashcardData: Flashcard[];
  columnOptions: DataTableColumnOptions[] = [{ name: 'flashcardId' }];
  pageSizeOptions: number[] = [5, 10, 25];

  @ViewChild(DataTableComponent) dataTable: DataTableComponent<Flashcard>;

  constructor(
    private modalService: NgbModal,
    private languageService: GenericLanguageService,
    private flashcardService: GenericFlashcardService,
    private deckService: GenericDeckService,
    private route: ActivatedRoute
  ) {
    this.deckService
      .getById(this.route.snapshot.params['id'])
      .subscribe((r) => {
        if (r === undefined || null)
          throw Error('what the fuck is this id bro');
        this.deck = r;
      });

    this.languageService.getAll().subscribe((x) => {
      this.fields.find(
        (f) => f.key === 'language' // this 'find' commands gets the corresponding 'field' object
      )!.templateOptions!.options = [
        // all these '!' signifies that the coder ensures that 'null' won't re returned for the nullable objects
        ...x.map((r) => {
          return {
            label: r.name,
            value: r.languageISOCode,
          };
        }), // this 'map' operation translates what is coming from the service to the structure used by the 'options' property
      ];
    });
    this.flashcardService
      .getAllFlashcardsFromDeck(this.route.snapshot.params['id'])
      .subscribe((x) => (this.flashcardData = x));
  }

  open(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        windowClass: 'flashcard-modal',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

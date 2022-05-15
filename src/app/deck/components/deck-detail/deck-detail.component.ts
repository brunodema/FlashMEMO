import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BehaviorSubject, map } from 'rxjs';
import {
  DataTableColumnOptions,
  DataTableComponent,
  DataTableComponentClickEventArgs,
} from 'src/app/shared/components/data-table/data-table.component';
import { Flashcard, IFlashcard } from 'src/app/shared/models/flashcard-models';
import { IDataResponse } from 'src/app/shared/models/http/http-response-types';
import { GenericAuthService } from 'src/app/shared/services/auth.service';
import { GenericFlashcardService } from 'src/app/shared/services/flashcard.service';
import { GenericLanguageService } from 'src/app/shared/services/language.service';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import { theNewFlashcardSeeder } from 'src/assets/test_assets/flashcard-seeder';
import { Deck } from '../../models/deck.model';
import { GenericDeckService } from '../../services/deck.service';

@Component({
  selector: 'app-deck-detail',
  styleUrls: ['./deck-detail.component.css'],
  templateUrl: './deck-detail.component.html',
})
export class DeckDetailComponent {
  closeResult = '';
  isNewDeck: boolean = false;

  // form stuff for deck info
  form = new FormGroup({});
  deckModel: Deck = {} as Deck; // apparently has to be of 'any' type
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
      key: 'languageISOCode',
      type: 'select',
      templateOptions: {
        label: 'Language',
        options: this.languageService.getAll().pipe(
          map((x) =>
            x.map((y) => {
              return { label: y.name, value: y.isoCode };
            })
          )
        ),
        required: true,
      },
    },
  ];

  // flashcard info
  flashcardData$ = new BehaviorSubject<IFlashcard[]>([]);
  refreshFlashcardDataSource() {
    this.flashcardService
      .getAllFlashcardsFromDeck(this.route.snapshot.params['id'])
      .subscribe((flashcardArray) => this.flashcardData$.next(flashcardArray));
  }

  activeFlashcard: IFlashcard;
  columnOptions: DataTableColumnOptions[] = [
    { name: 'flashcardId' },
    { name: 'dueDate' },
  ];
  pageSizeOptions: number[] = [5, 10, 25];

  @ViewChild(DataTableComponent) dataTable: DataTableComponent<IFlashcard>;
  flashcardModal: NgbModalRef; // this variable is assigned as soon as the modal is opened (return of the 'open' method)

  constructor(
    private modalService: NgbModal,
    private languageService: GenericLanguageService,
    private flashcardService: GenericFlashcardService,
    private deckService: GenericDeckService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: GenericNotificationService,
    private authService: GenericAuthService
  ) {
    this.deckModel = this.route.snapshot.data['deck'];
    if (this.deckModel) {
      // 'detail' mode
      this.refreshFlashcardDataSource();

      // sets the default language value according to the one coming from the route (DeckId),
      this.fields.find((f) => f.key === 'languageISOCode')!.defaultValue =
        this.deckModel.languageISOCode;
    } else {
      this.isNewDeck = true;
      this.deckModel = new Deck({
        ownerId: authService.loggedUserId.getValue(),
      });
      console.log(this.deckModel.ownerId);
    }
  }

  openFlashcardModal(content: any, flashcard: IFlashcard | null) {
    if (flashcard === null)
      this.activeFlashcard = new Flashcard({ deckId: this.deckModel.deckId });
    else this.activeFlashcard = flashcard!;

    //console.log(theNewFlashcardSeeder(250));

    this.flashcardModal = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'flashcard-modal',
    });
    this.flashcardModal.result.then(
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

  handleFlashcardDelete(args: DataTableComponentClickEventArgs<IFlashcard>) {
    if (confirm('Are you sure you want to delete this flashcard?')) {
      this.flashcardService.delete(args.rowData.flashcardId).subscribe((x) => {
        this.notificationService.showSuccess('Flashcard deleted.');
        this.refreshFlashcardDataSource();
      });
    }
  }

  handleFlashcardSave(flashcard: IFlashcard) {
    if (flashcard.flashcardId) {
      flashcard.lastUpdated = new Date().toISOString();
      this.flashcardService
        .update(flashcard.flashcardId, flashcard)
        .subscribe((x) => {
          this.notificationService.showSuccess('Flashcard updated.');
          this.refreshFlashcardDataSource();
          this.flashcardModal.close('flashcard update');
        });
    } else {
      this.flashcardService.create(flashcard).subscribe((x) => {
        this.notificationService.showSuccess('Flashcard created.');
        this.refreshFlashcardDataSource();
        this.flashcardModal.close('flashcard create');
      });
    }
  }

  saveDeck() {
    if (this.form.valid) {
      if (this.deckModel?.deckId) {
        this.deckModel.lastUpdated = new Date().toISOString();
        this.deckService
          .update(this.deckModel.deckId, this.deckModel)
          .subscribe((x) => {
            this.notificationService.showSuccess('Deck updated.');
          });
      } else {
        this.deckService.create(this.deckModel).subscribe((x) => {
          this.notificationService.showSuccess('Deck Created');
          this.router.navigate(['/deck', x.data]);
        });
      }
    } else {
      this.notificationService.showError(
        'there is something wrong with the form 🙄'
      );
      this.notificationService.showError(this.form.errors!.tostring()); // potenttialy dangerous, might show 'raw' information
    }
  }
}

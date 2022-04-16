import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  forwardRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { PaginatedListResponse } from 'src/app/shared/models/http/http-response-types';
import {
  GeneralImageAPIService,
  IImageAPIResult,
  ImageAPIService,
  MockImageAPIService,
} from 'src/app/shared/services/api-services';
import { CKEditor4, CKEditorComponent } from 'ckeditor4-angular';

export enum FlashcardContentType {
  NONE = 'NONE',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
}

/**
 * TIL about the 'host'property
 * Apparently we can use this property to set things related to the wrapper element that Angular will add to the DOM after compiling the app.
 * In this case, I add all those classes so the layout of the rows/columns is the way I want.
 */

@Component({
  selector: 'app-flashcard-content-options-block',
  host: {
    class: 'd-flex flex-fill align-items-center justify-content-center',
    style: 'border: 1px solid black', // optional, just to debug section sizes
  },
  templateUrl: './flashcard-content-options-block.component.html',
  styleUrls: ['./flashcard-content-options-block.component.css'],
  providers: [
    { provide: GeneralImageAPIService, useClass: MockImageAPIService },
  ],
})
export class FlashcardContentOptionsBlock implements OnInit {
  componentHeight: string;

  closeResult: string;
  modalTitle: string;
  contentType: FlashcardContentType = FlashcardContentType.NONE;
  contentValue: string = '';

  flashcardContentEnumType = FlashcardContentType;

  // Image API section
  imageAPIData$: Observable<PaginatedListResponse<IImageAPIResult>>;
  imageResults: IImageAPIResult[];
  hasPrevious: boolean;
  hasNext: boolean;
  currentPageIndex: number;
  currentKeyword: string = '';

  // Text/Dictionary API section
  editorComponent: string;
  textEditorContent: string = '<p>Insert your text here! </p>';
  editorType: CKEditor4.EditorType = CKEditor4.EditorType.CLASSIC;
  editorConfig: CKEditor4.Config = {
    toolbar: [
      { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
      {
        name: 'paragraph',
        items: [
          'NumberedList',
          'BulletedList',
          'Blockquote',
          'JustifyLeft',
          'JustifyCenter',
          'JustifyRight',
          'JustifyBlock',
          'Language',
        ],
      },
      { name: 'colors', items: ['TextColor', 'BGColor'] },
      { name: 'about', items: ['About'] },
    ],
  };

  /**
   * Access modal element using implementation described here: https://stackoverflow.com/questions/40382319/how-to-programmatically-close-ng-bootstrap-modal
   * Bonus: in this specific case, using 'ViewChild' to access the element does not work, because after the reference is set on the 'open' call, for some fucking reason, the type of the object becomes 'TemplateRef' instead of the correct 'NgbModalRef'. Using this current approach avoids this.
   */
  contentEditor: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private imageAPIService: GeneralImageAPIService,
    private hostElement: ElementRef, // A way to check the parent's height, and use it after an image is selected by the user
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.componentHeight = this.hostElement.nativeElement.offsetHeight + 'px';
  }

  openXl(content: any, contentType: string): void {
    this.modalTitle = contentType;
    this.contentEditor = this.modalService.open(content, {
      size: 'xl',
      scrollable: true,
    });
  }

  searchImage(keyword: string, pageIndex?: number): void {
    if (pageIndex === undefined) pageIndex = 1;

    this.imageAPIData$ = this.imageAPIService.searchImage(keyword, pageIndex);
    this.imageAPIData$.subscribe((r) => {
      this.currentKeyword = keyword;
      this.currentPageIndex = r.data.pageIndex as number;
      this.imageResults = r.data.results;
      this.hasPrevious = r.data.hasPreviousPage;
      this.hasNext = r.data.hasNextPage;
    });
  }

  selectImage(imageLink: string): void {
    this.contentType = this.flashcardContentEnumType.IMAGE;
    this.contentValue = imageLink;
    this.contentEditor.close('image selected');
  }

  resetContent(): void {
    this.contentType = this.flashcardContentEnumType.NONE;
    this.contentValue = '';
  }

  saveText() {
    if (this.textEditorContent.trim().length === 0) {
      this.contentType = this.flashcardContentEnumType.NONE;
      this.contentValue = '';
      this.contentEditor.close('empty text input');
    } else {
      this.contentType = this.flashcardContentEnumType.TEXT;
      this.contentValue = this.textEditorContent;
      this.contentEditor.close('text selected');
    }
  }
}

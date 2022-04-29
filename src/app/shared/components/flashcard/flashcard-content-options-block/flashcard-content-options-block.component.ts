import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import {
  IDataAPIResponse,
  PaginatedListResponse,
} from 'src/app/shared/models/http/http-response-types';
import {
  AudioAPIProvider,
  DictionaryAPIProvider,
  GeneralAudioAPIService,
  GeneralDictionaryAPIService,
  GeneralImageAPIService,
  IAudioAPIResult,
  IDictionaryAPIResult,
  IImageAPIResult,
  ImageAPIService,
  MockAudioService,
  MockDictionaryService,
  MockImageAPIService,
} from 'src/app/shared/services/api-services';
import { CKEditor4 } from 'ckeditor4-angular';
import { ClipboardService } from 'ngx-clipboard';

export enum FlashcardContentType {
  NONE = 'NONE',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
}

export class FlashcardContentOptionsBlockContentSaveEventArgs {
  contentValue: string;
}

/**
 * TIL about the 'host'property
 * Apparently we can use this property to set things related to the wrapper element that Angular will add to the DOM after compiling the app.
 * In this case, I add all those classes so the layout of the rows/columns is the way I want.
 */

@Component({
  selector: 'app-flashcard-content-options-block',
  host: {
    class:
      'd-flex flex-fill align-items-center justify-content-center image-reset-button-parent', // having this 'handler' class here forced me to pass all associated CSS to the main styles sheet :/
    style: 'border: 1px solid black', // optional, just to debug section sizes
  },
  templateUrl: './flashcard-content-options-block.component.html',
  styleUrls: ['./flashcard-content-options-block.component.css'],
  providers: [
    { provide: GeneralImageAPIService, useClass: MockImageAPIService },
    { provide: GeneralDictionaryAPIService, useClass: MockDictionaryService },
    { provide: GeneralAudioAPIService, useClass: MockAudioService },
  ],
})
export class FlashcardContentOptionsBlockComponent implements OnInit {
  componentHeight: string;

  closeResult: string;
  modalTitle: string;
  contentType: FlashcardContentType = FlashcardContentType.NONE;
  contentValue: string = '';
  currentKeyword: string = ''; // shared between search boxes

  flashcardContentEnumType = FlashcardContentType;

  // Image API section
  imageAPIData$: Observable<PaginatedListResponse<IImageAPIResult>>;
  imageResults: IImageAPIResult[];
  hasPrevious: boolean;
  hasNext: boolean;
  currentPageIndex: number;

  // Audio API section
  audioProviderEnum: typeof AudioAPIProvider = AudioAPIProvider;
  // implementation stolen from: https://stackoverflow.com/questions/56036446/typescript-enum-values-as-array
  possibleAudioProviders = Object.values(AudioAPIProvider).filter(
    (f) => typeof f === 'string'
  );
  audioProvider: AudioAPIProvider = AudioAPIProvider.OXFORD;
  audioAPIData$: Observable<IDataAPIResponse<IAudioAPIResult>>;
  audioAPIResults: string[];

  // Text/Dictionary API section
  dictProviderEnum: typeof DictionaryAPIProvider = DictionaryAPIProvider;
  // implementation stolen from: https://stackoverflow.com/questions/56036446/typescript-enum-values-as-array
  possibleDictProviders = Object.values(DictionaryAPIProvider).filter(
    (f) => typeof f === 'string'
  );
  dictProvider: DictionaryAPIProvider = DictionaryAPIProvider.OXFORD;
  dictAPIData$: Observable<IDataAPIResponse<IDictionaryAPIResult>>;
  dictAPIparsedHMTL: string = '';

  textEditorContent: string;
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

  @Output() contentSave: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private imageAPIService: GeneralImageAPIService,
    private dictAPIService: GeneralDictionaryAPIService,
    private audioAPIService: GeneralAudioAPIService,
    private hostElement: ElementRef, // A way to check the parent's height, and use it after an image is selected by the user
    private spinnerService: NgxSpinnerService,
    private clipboardService: ClipboardService
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

  emitValue(contentValue: string) {
    this.contentSave.emit(this.contentValue);
    console.log('emitting: ' + this.contentValue);
  }

  saveAudio(audioURL: string): void {
    this.contentType = FlashcardContentType.AUDIO;
    this.contentValue = audioURL;
    this.contentEditor.close('audio selected');
    this.emitValue(this.contentValue);
  }

  saveImage(imageLink: string): void {
    this.contentType = this.flashcardContentEnumType.IMAGE;
    this.contentValue = imageLink;
    this.contentEditor.close('image selected');
    this.emitValue(this.contentValue);
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
      this.emitValue(this.contentValue);
    }
  }

  resetContent(): void {
    this.contentType = this.flashcardContentEnumType.NONE;
    this.contentValue = '';
    this.emitValue(this.contentValue);
  }

  showEditButton(): boolean {
    return this.contentType === this.flashcardContentEnumType.TEXT;
  }
  showResetButton(): boolean {
    return this.contentType !== this.flashcardContentEnumType.NONE;
  }

  searchWord(keyword: string, languageCode: string): void {
    this.dictAPIData$ = this.dictAPIService.searchWord(keyword, languageCode);
    this.dictAPIData$.subscribe(
      (r) =>
        (this.dictAPIparsedHMTL = this.dictAPIService.ParseResultsIntoHTML(
          r.data
        ))
    );
  }

  showDictionaryToolbar(): boolean {
    return this.dictAPIparsedHMTL !== '' ? true : false;
  }

  clearDictionaryResults(): void {
    this.dictAPIparsedHMTL = '';
  }

  copyToRTE(): void {
    this.clipboardService.copyFromContent(this.dictAPIparsedHMTL); // copies to user's clipboard as an extra, even though it copies the HTML content, which is wonky for the un-initiated
    this.textEditorContent += '\n\n' + this.dictAPIparsedHMTL;
  }

  searchAudio(keyword: string, languageCode: string): void {
    this.audioAPIData$ = this.audioAPIService.searchAudio(
      keyword,
      languageCode
    );
    this.audioAPIData$.subscribe(
      (r) => (this.audioAPIResults = r.data.results.audioFiles)
    );
  }

  showAudioToolbar(): boolean {
    return this.audioAPIResults?.length > 0 ? true : false;
  }

  clearAudioResults(): void {
    this.audioAPIResults = [];
  }
}

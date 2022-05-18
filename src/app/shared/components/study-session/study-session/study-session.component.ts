import { Component, OnInit } from '@angular/core';

export enum StudySessionStep {
  START,
  STUDY,
  END,
}

export class StudySessionImageTools {
  studySessionImages = [
    'assets\\study_session\\study-session-1.jpg',
    'assets\\study_session\\study-session-2.jpg',
    'assets\\study_session\\study-session-3.jpg',
  ];

  pickRandomImage(): string {
    return this.studySessionImages[
      Math.floor(Math.random() * this.studySessionImages.length)
    ];
  }
}

@Component({
  selector: 'app-study-session',
  templateUrl: './study-session.component.html',
  styleUrls: ['./study-session.component.css'],
  host: { class: 'd-flex flex-column h-100' },
})
export class StudySessionComponent implements OnInit {
  StudySessionStepEnum = StudySessionStep;
  currentStep: StudySessionStep = StudySessionStep.START;

  startImg: string;
  endImg: string;

  constructor() {
    this.startImg = new StudySessionImageTools().pickRandomImage();
    this.endImg = new StudySessionImageTools().pickRandomImage();
  }

  ngOnInit(): void {}
}

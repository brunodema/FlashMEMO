import { Component, OnInit } from '@angular/core';

export enum StudySessionStep {
  START,
  STUDY,
  END,
}

@Component({
  selector: 'app-study-session',
  templateUrl: './study-session.component.html',
  styleUrls: ['./study-session.component.css'],
})
export class StudySessionComponent implements OnInit {
  StudySessionStepEnum = StudySessionStep;
  currentStep: StudySessionStep = StudySessionStep.START;

  constructor() {}

  ngOnInit(): void {}
}

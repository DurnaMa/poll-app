import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-survey-dialog',
  imports: [MatButton],
  templateUrl: './survey-dialog.html',
  styleUrl: './survey-dialog.scss',
})
export class SurveyDialog {

  constructor() {
  }
}

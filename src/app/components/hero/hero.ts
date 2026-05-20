import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SurveyDialog } from '../survey-dialog/survey-dialog';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  constructor(private dialog: MatDialog) {
    this.dialog;
  }

  openDialog() {
    this.dialog.open(SurveyDialog, {
      width:  '866px',
      height: '600px',
      maxWidth: '100vw'
    });
  }
}

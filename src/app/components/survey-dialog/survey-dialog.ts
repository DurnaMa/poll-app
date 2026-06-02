import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SurveyService } from '../../services/survey.services';
import { Question } from '../../interface/interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-survey-dialog',
  imports: [
    MatButton,
    MatInput,
    MatSelect,
    MatOption,
    MatDatepickerToggle,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatIcon,
    MatDialogModule,
    MatCheckbox,
  ],
  templateUrl: './survey-dialog.html',
  styleUrl: './survey-dialog.scss',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }],
})
export class SurveyDialog {
  showError = false;
  surveyService = inject(SurveyService);
  dialogRef = inject(MatDialogRef);
  readonly today = new Date();

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  questions: Question[] = [{ id: 0, question: '', options: [], answers: ['', ''], allowMultiple: false }];
  selectedCategory = '';
  title = '';
  description = '';

  addAnswer(qIndex: number): void {
    if (this.questions[qIndex].answers.length < 6) {
      this.questions[qIndex].answers.push('');
    }
  }

  removeAnswer(qIndex: number, aIndex: number): void {
    if (this.questions[qIndex].answers.length > 2) {
      this.questions[qIndex].answers.splice(aIndex, 1);
    }
  }

  addQuestion(): void {
    this.questions.push({ id: 0, question: '', options: [], answers: ['', ''], allowMultiple: false });
  }

  removeQuestion(qIndex: number): void {
    if (this.questions.length > 1) {
      this.questions.splice(qIndex, 1);
    }
  }

  getAnswerLabel(index: number): string {
    return String.fromCharCode(65 + index) + '.';
  }

  async createSurvey() {
    if (!this.title) {
      this.showError = true;
      return;
    }

    const result = await this.surveyService.createSurveys(
      this.title,
      this.description,
      this.range.value.end?.toISOString() ?? '',
      this.selectedCategory
    );
    const surveyId = result?.[0]?.id;

    for (const question of this.questions) {
      const questionResult = await this.surveyService.createQuestions(surveyId, [question]);
      const questionId = questionResult?.[0]?.id;
      await this.surveyService.createOptions(surveyId, questionId, question.answers);
    }

    await this.surveyService.getAllSurvey();
    this.dialogRef.close();
  }

  clearName(): void {
    this.title = '';
  }

  clearDescription(): void {
    this.description = '';
  }

  clearAnswer(qIndex: number, aIndex: number): void {
    this.questions[qIndex].answers[aIndex] = '';
  }
}

import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SurveyService } from '../../services/survey.services';
import { Question } from '../../interface/interface';

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
  showValidationError = false;
  submitted = false;

  endDate: Date | null = null;

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
    } else {
      this.questions[qIndex].answers[aIndex] = '';
    }
  }

  addQuestion(): void {
    this.questions.push({ id: 0, question: '', options: [], answers: ['', ''], allowMultiple: false });
  }

  removeQuestion(qIndex: number): void {
    if (this.questions.length > 1) {
      this.questions.splice(qIndex, 1);
    } else {
      this.questions[qIndex].question = '';
      this.questions[qIndex].answers = ['', ''];
      this.questions[qIndex].allowMultiple = false;
    }
  }

  getAnswerLabel(index: number): string {
    return String.fromCharCode(65 + index) + '.';
  }

  async createSurvey() {
    this.submitted = true;
    if (!this.isValid()) {
      this.showValidationError = true;
      return;
    }
    const surveyId = await this.saveSurvey();
    await this.saveQuestions(surveyId);
    await this.surveyService.getAllSurvey();
    this.dialogRef.close();
  }

  private isValid(): boolean {
    return this.title.trim().length > 0 && this.questions.every((q) => this.isQuestionValid(q));
  }

  private isQuestionValid(q: Question): boolean {
    return q.question.trim().length > 0 && q.answers.length >= 2 && q.answers.every((a) => a.trim().length > 0);
  }

  private async saveSurvey(): Promise<number> {
    const result = await this.surveyService.createSurveys(
      this.title,
      this.description,
      this.endDate?.toISOString() ?? null,
      this.selectedCategory
    );
    return result?.[0]?.id;
  }

  private async saveQuestions(surveyId: number) {
    for (const question of this.questions) {
      await this.saveQuestion(surveyId, question);
    }
  }

  private async saveQuestion(surveyId: number, question: Question) {
    const result = await this.surveyService.createQuestions(surveyId, [question]);
    const questionId = result?.[0]?.id;
    await this.surveyService.createOptions(surveyId, questionId, question.answers);
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

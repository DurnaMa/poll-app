import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

interface Question {
  text: string;
  answers: string[];
  allowMultiple: boolean;
}

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
  providers: [provideNativeDateAdapter()],
})
export class SurveyDialog {
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  questions: Question[] = [{ text: '', answers: ['', ''], allowMultiple: false }];
  selectedCategory = '';

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
    this.questions.push({ text: '', answers: ['', ''], allowMultiple: false });
  }

  removeQuestion(qIndex: number): void {
    if (this.questions.length > 1) {
      this.questions.splice(qIndex, 1);
    }
  }

  getAnswerLabel(index: number): string {
    return String.fromCharCode(65 + index) + '.';
  }
}

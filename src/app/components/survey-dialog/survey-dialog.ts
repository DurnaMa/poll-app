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

  /**
   * Fügt der gewählten Frage eine leere Antwortoption hinzu (maximal 6)
   * @param qIndex - Position der Frage im questions Array
   */
  addAnswer(qIndex: number): void {
    if (this.questions[qIndex].answers.length < 6) {
      this.questions[qIndex].answers.push('');
    }
  }

  /**
   * Entfernt die gewählte Antwortoption. Bei nur noch zwei Optionen wird die
   * Option nicht gelöscht, sondern nur ihr Inhalt geleert (Minimum von zwei bleibt).
   * @param qIndex - Position der Frage im questions Array
   * @param aIndex - Position der Antwort im answers Array der Frage
   */
  removeAnswer(qIndex: number, aIndex: number): void {
    if (this.questions[qIndex].answers.length > 2) {
      this.questions[qIndex].answers.splice(aIndex, 1);
    } else {
      this.questions[qIndex].answers[aIndex] = '';
    }
  }

  /**
   * Fügt eine neue Frage hinzu
   */
  addQuestion(): void {
    this.questions.push({ id: 0, question: '', options: [], answers: ['', ''], allowMultiple: false });
  }

  /**
   * Entfernt die ausgewählte Frage aus dem questions Array
   * @param qIndex - Position der Frage im questions Array
   */
  removeQuestion(qIndex: number): void {
    if (this.questions.length > 1) {
      this.questions.splice(qIndex, 1);
    } else {
      this.questions[qIndex].question = '';
      this.questions[qIndex].answers = ['', ''];
      this.questions[qIndex].allowMultiple = false;
    }
  }

  /**
   * Liefert das Buchstabenlabel einer Antwortoption (0 -> "A.", 1 -> "B.", ...).
   * @param index - Position der Antwort im Array
   * @returns Buchstabe mit Punkt als Label
   */
  getAnswerLabel(index: number): string {
    return String.fromCharCode(65 + index) + '.';
  }

  /**
   * Validiert das Formular und legt bei gültiger Eingabe eine neue Umfrage an.
   *
   * Speichert zuerst die Umfrage, dann deren Fragen, lädt anschließend die
   * Umfrageliste neu und schließt den Dialog. Bei ungültiger Eingabe wird
   * ein Validierungsfehler angezeigt und abgebrochen.
   */
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

  /**
   * Prüft, ob das Formular gültig ist: Titel gesetzt und alle Fragen gültig.
   * @returns true, wenn die Eingaben gültig sind
   */
  private isValid(): boolean {
    return this.title.trim().length > 0 && this.questions.every((q) => this.isQuestionValid(q));
  }

  /**
   * Prüft eine einzelne Frage: Fragetext gesetzt, mindestens zwei Antworten und
   * keine leere Antwortoption.
   * @param q - zu prüfende Frage
   * @returns true, wenn die Frage gültig ist
   */
  private isQuestionValid(q: Question): boolean {
    return q.question.trim().length > 0 && q.answers.length >= 2 && q.answers.every((a) => a.trim().length > 0);
  }

  /**
   * Legt die Umfrage über den SurveyService an.
   * @returns ID der neu erstellten Umfrage
   */
  private async saveSurvey(): Promise<number> {
    const result = await this.surveyService.createSurveys(
      this.title,
      this.description,
      this.endDate?.toISOString() ?? null,
      this.selectedCategory
    );
    return result?.[0]?.id;
  }

  /**
   * Speichert alle Fragen der Umfrage nacheinander.
   * @param surveyId - ID der zugehörigen Umfrage
   */
  private async saveQuestions(surveyId: number) {
    for (const question of this.questions) {
      await this.saveQuestion(surveyId, question);
    }
  }

  /**
   * Speichert eine einzelne Frage samt ihrer Antwortoptionen.
   * @param surveyId - ID der zugehörigen Umfrage
   * @param question - zu speichernde Frage
   */
  private async saveQuestion(surveyId: number, question: Question) {
    const result = await this.surveyService.createQuestions(surveyId, [question]);
    const questionId = result?.[0]?.id;
    await this.surveyService.createOptions(surveyId, questionId, question.answers);
  }

  /**
   * Leert das Titelfeld.
   */
  clearName(): void {
    this.title = '';
  }

  /**
   * Leert das Beschreibungsfeld.
   */
  clearDescription(): void {
    this.description = '';
  }
}

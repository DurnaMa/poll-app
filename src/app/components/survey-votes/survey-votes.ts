import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../services/survey.services';
import { VotesService } from '../../services/votes.services';
import { Survey } from '../../interface/interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-survey-votes',
  imports: [DatePipe],
  templateUrl: './survey-votes.html',
  styleUrl: './survey-votes.scss',
})
export class SurveyVotes {
  router = inject(Router);
  route = inject(ActivatedRoute);
  surveyService = inject(SurveyService);
  votesService = inject(VotesService);

  survey = signal<Survey | null>(null);
  questions = signal<any[]>([]);
  voted = signal<Record<number, number[]>>({});

  /**
   * Lädt beim Initialisieren die zur Route-ID passende Umfrage sowie deren Fragen
   * inklusive Antwortoptionen.
   */
  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    await this.surveyService.getAllSurvey();
    const found = this.surveyService.surveys().find((s) => s.id === id) ?? null;
    this.survey.set(found);
    const q = await this.votesService.getQuestionsWithOptions(id);
    this.questions.set(q);
  }

  /**
   * Summiert die Stimmen aller Antwortoptionen einer Frage.
   * @param options - Antwortoptionen der Frage
   * @returns Gesamtzahl der abgegebenen Stimmen
   */
  totalVotes(options: any[]): number {
    return options.reduce((sum, o) => sum + (o.vote ?? 0), 0);
  }

  /**
   * Berechnet den prozentualen Stimmenanteil einer Option (gerundet).
   * @param option - die betrachtete Antwortoption
   * @param options - alle Antwortoptionen der Frage
   * @returns Anteil in Prozent; 0, wenn keine Stimmen vorliegen
   */
  percent(option: any, options: any[]): number {
    const total = this.totalVotes(options);
    if (total === 0) return 0;
    return Math.round(((option.vote ?? 0) / total) * 100);
  }

  /**
   * Prüft, ob für die Frage bereits abgestimmt wurde.
   * @param questionId - ID der Frage
   * @returns true, wenn mindestens eine Option gewählt wurde
   */
  hasVoted(questionId: number): boolean {
    const v = this.voted()[questionId];
    return v !== undefined && v.length > 0;
  }

  /**
   * Prüft, ob eine bestimmte Option der Frage ausgewählt ist.
   * @param questionId - ID der Frage
   * @param optionId - ID der Antwortoption
   * @returns true, wenn die Option gewählt wurde
   */
  isSelected(questionId: number, optionId: number): boolean {
    return this.voted()[questionId]?.includes(optionId) ?? false;
  }

  /**
   * Gibt eine Stimme für eine Antwortoption ab. Bei Einfachauswahl wird eine bereits
   * abgegebene Stimme ignoriert; bereits gewählte Optionen werden nicht erneut gezählt.
   * Aktualisiert anschließend den lokalen Auswertungsstand.
   * @param questionId - ID der Frage
   * @param option - gewählte Antwortoption
   * @param q - zugehörige Frage (für allow_multiple)
   */
  async vote(questionId: number, option: any, q: any) {
    const allowMultiple = q.allow_multiple;
    if (!allowMultiple && this.hasVoted(questionId)) return;
    if (this.isSelected(questionId, option.id)) return;

    await this.votesService.vote(option.id, option.vote ?? 0);
    option.vote = (option.vote ?? 0) + 1;

    this.voted.update((v) => ({
      ...v,
      [questionId]: allowMultiple ? [...(v[questionId] ?? []), option.id] : [option.id],
    }));

    this.questions.set([...this.questions()]);
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
   * Beendet die Umfrageansicht und navigiert zurück zum Homescreen.
   */
  completeSurvey() {
    this.router.navigate(['/']);
  }
}

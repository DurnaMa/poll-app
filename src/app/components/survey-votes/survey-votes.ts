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

  /** Lokale Auswahl pro Frage – jederzeit änderbar bis zum Abschluss der Umfrage. */
  selected = signal<Record<number, number[]>>({});

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
   * Liefert die für die Auswertung wirksame Stimmenzahl einer Option: die bereits
   * gespeicherten Stimmen plus die noch nicht abgegebene lokale Auswahl.
   * @param questionId - ID der Frage
   * @param option - die betrachtete Antwortoption
   * @returns gespeicherte Stimmen zuzüglich der aktuellen Auswahl
   */
  effectiveVotes(questionId: number, option: any): number {
    const base = option.vote ?? 0;
    return base + (this.isSelected(questionId, option.id) ? 1 : 0);
  }

  /**
   * Summiert die wirksamen Stimmen aller Antwortoptionen einer Frage.
   * @param questionId - ID der Frage
   * @param options - Antwortoptionen der Frage
   * @returns Gesamtzahl der wirksamen Stimmen
   */
  totalVotes(questionId: number, options: any[]): number {
    return options.reduce((sum, o) => sum + this.effectiveVotes(questionId, o), 0);
  }

  /**
   * Berechnet den prozentualen Stimmenanteil einer Option inklusive der aktuellen
   * lokalen Auswahl (gerundet).
   * @param questionId - ID der Frage
   * @param option - die betrachtete Antwortoption
   * @param options - alle Antwortoptionen der Frage
   * @returns Anteil in Prozent; 0, wenn keine Stimmen vorliegen
   */
  percent(questionId: number, option: any, options: any[]): number {
    const total = this.totalVotes(questionId, options);
    if (total === 0) return 0;
    return Math.round((this.effectiveVotes(questionId, option) / total) * 100);
  }

  /**
   * Prüft, ob eine bestimmte Option der Frage aktuell ausgewählt ist.
   * @param questionId - ID der Frage
   * @param optionId - ID der Antwortoption
   * @returns true, wenn die Option gewählt wurde
   */
  isSelected(questionId: number, optionId: number): boolean {
    return this.selected()[questionId]?.includes(optionId) ?? false;
  }

  /**
   * Schaltet die Auswahl einer Antwortoption um. Wirkt nur lokal und ist bis zum
   * Abschluss der Umfrage jederzeit änderbar. Bei Einfachauswahl ersetzt die neue
   * Wahl die alte.
   * @param questionId - ID der Frage
   * @param optionId - ID der Antwortoption
   * @param allowMultiple - ob Mehrfachauswahl erlaubt ist
   */
  select(questionId: number, optionId: number, allowMultiple: boolean) {
    this.selected.update((s) => {
      const current = s[questionId] ?? [];
      if (allowMultiple) {
        const next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
        return { ...s, [questionId]: next };
      }
      const next = current.includes(optionId) ? [] : [optionId];
      return { ...s, [questionId]: next };
    });
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
   * Schließt die Umfrage ab: schreibt alle ausgewählten Stimmen aller Fragen
   * endgültig auf den Server und navigiert anschließend zurück zum Homescreen.
   */
  async completeSurvey() {
    for (const q of this.questions()) {
      const chosen = this.selected()[q.id] ?? [];
      for (const optionId of chosen) {
        const option = q.options.find((o: any) => o.id === optionId);
        if (!option) continue;
        await this.votesService.vote(option.id, option.vote ?? 0);
      }
    }
    this.router.navigate(['/']);
  }
}

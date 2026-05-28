import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../services/survey.services';
import { VotesService } from '../../services/votes.services';
import { Survey } from '../../interface/interface';
import { DatePipe } from '@angular/common';
import { Route } from '@angular/router';

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

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    await this.surveyService.getAllSurvey();
    const found = this.surveyService.surveys().find((s) => s.id === id) ?? null;
    this.survey.set(found);
    const q = await this.votesService.getQuestionsWithOptions(id);
    this.questions.set(q);
  }

  totalVotes(options: any[]): number {
    return options.reduce((sum, o) => sum + (o.vote ?? 0), 0);
  }

  percent(option: any, options: any[]): number {
    const total = this.totalVotes(options);
    if (total === 0) return 0;
    return Math.round(((option.vote ?? 0) / total) * 100);
  }

  hasVoted(questionId: number): boolean {
    const v = this.voted()[questionId];
    return v !== undefined && v.length > 0;
  }

  isSelected(questionId: number, optionId: number): boolean {
    return this.voted()[questionId]?.includes(optionId) ?? false;
  }

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

  getAnswerLabel(index: number): string {
    return String.fromCharCode(65 + index) + '.';
  }

  completeSurvey() {
    this.router.navigate(['/']);
  }
}

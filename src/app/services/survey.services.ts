import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase';
import { Option, Question, Survey } from '../interface/interface';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  supabaseService = inject(SupabaseService);

  surveys = signal<Survey[]>([]);
  questions = signal<Option[]>([]);

  async getAllSurvey() {
    const { data } = await this.supabaseService.getClient().from('surveys').select('*');
    this.surveys.set(data ?? []);
  }

  activeSurveys = computed(() =>
    this.surveys().filter((survey) => survey.endDate == null || new Date(survey.endDate) > new Date())
  );

  async createSurveys(title: string, description: string, endDate: string | null, category: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('surveys')
      .insert([{ title, description, endDate, category }])
      .select();
    if (error) console.error('konnte nicht erstellt werden', error);
    return data ?? null;
  }

  async createQuestions(survey_id: number, questionsArray: Question[]) {
    const questionsToInsert = questionsArray.map((question) => ({
      survey_id: survey_id,
      text: question.question,
      allow_multiple: question.allowMultiple ? 1 : 0,
    }));

    const { data, error } = await this.supabaseService.getClient().from('questions').insert(questionsToInsert).select();
    if (error) console.error('createQuestions konnte nicht erstellt werden', error);
    return data ?? null;
  }

  async createOptions(surveyId: number, questionId: number, answers: string[]) {
    const optionsToInsert = answers.map((option) => ({
      survey_id: surveyId,
      question_id: questionId,
      label: option,
    }));
    const { data, error } = await this.supabaseService.getClient().from('options').insert(optionsToInsert).select();
    if (error) console.error('createOptions konnte nicht erstellt werden', error);
    return data ?? null;
  }
}

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

  /**
   * Lädt alle Umfragen aus der Datenbank und legt sie im surveys-Signal ab.
   */
  async getAllSurvey() {
    const { data } = await this.supabaseService.getClient().from('surveys').select('*');
    this.surveys.set(data ?? []);
  }

  /**
   * Liefert die noch laufenden Umfragen (kein Enddatum oder Enddatum in der Zukunft).
   */
  activeSurveys = computed(() =>
    this.surveys().filter((survey) => survey.endDate == null || new Date(survey.endDate) > new Date())
  );

  /**
   * Legt eine neue Umfrage an.
   * @param title - Titel der Umfrage
   * @param description - Beschreibungstext
   * @param endDate - Enddatum als ISO-String oder null
   * @param category - Kategorie der Umfrage
   * @returns angelegte Umfrage-Datensätze oder null bei Fehler
   */
  async createSurveys(title: string, description: string, endDate: string | null, category: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('surveys')
      .insert([{ title, description, endDate, category }])
      .select();
    if (error) console.error('konnte nicht erstellt werden', error);
    return data ?? null;
  }

  /**
   * Legt die Fragen einer Umfrage an. allowMultiple wird als 1/0 gespeichert.
   * @param survey_id - ID der zugehörigen Umfrage
   * @param questionsArray - anzulegende Fragen
   * @returns angelegte Frage-Datensätze oder null bei Fehler
   */
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

  /**
   * Legt die Antwortoptionen einer Frage an.
   * @param surveyId - ID der zugehörigen Umfrage
   * @param questionId - ID der zugehörigen Frage
   * @param answers - Beschriftungen der Antwortoptionen
   * @returns angelegte Options-Datensätze oder null bei Fehler
   */
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

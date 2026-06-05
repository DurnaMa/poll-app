import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase';

@Injectable({ providedIn: 'root' })
export class VotesService {
  supabaseService = inject(SupabaseService);

  /**
   * Lädt alle Fragen einer Umfrage inklusive ihrer Antwortoptionen.
   * @param surveyId - ID der Umfrage
   * @returns Liste der Fragen mit Optionen; leeres Array bei Fehler
   */
  async getQuestionsWithOptions(surveyId: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('questions')
      .select('*, options(*)')
      .eq('survey_id', surveyId)
      .order('id', { ascending: true} )
      .order('id', { ascending: true, foreignTable:'options' });
    if (error) console.error(error);
    return data ?? [];
  }

  /**
   * Erhöht die Stimmenzahl einer Antwortoption um eins.
   * @param optionId - ID der Antwortoption
   * @param currentVotes - aktuelle Stimmenzahl der Option
   */
  async vote(optionId: number, currentVotes: number) {
    const { error } = await this.supabaseService
      .getClient()
      .from('options')
      .update({ vote: currentVotes + 1 })
      .eq('id', optionId);
    if (error) console.error(error);
  }
}

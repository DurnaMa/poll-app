import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase';

@Injectable({ providedIn: 'root' })
export class VotesService {
  supabaseService = inject(SupabaseService);

  async getQuestionsWithOptions(surveyId: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('questions')
      .select('*, options(*)')
      .eq('survey_id', surveyId);
    if (error) console.error(error);
    return data ?? [];
  }

  async vote(optionId: number, currentVotes: number) {
    const { error } = await this.supabaseService
      .getClient()
      .from('options')
      .update({ vote: currentVotes + 1 })
      .eq('id', optionId);
    if (error) console.error(error);
  }
}

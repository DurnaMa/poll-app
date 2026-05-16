import {inject, Injectable} from '@angular/core';
import {SupabaseService} from './supabase';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  supabaseService = inject(SupabaseService)

  async getAllSurvesy(){
    return await this.supabaseService.getClient().from('surveys').select('*')
  };
}

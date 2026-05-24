import {inject, Injectable, signal } from '@angular/core';
import {SupabaseService} from './supabase';
import { Poll } from '../interface/interface';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  supabaseService = inject(SupabaseService);

  surveys = signal<Poll[]>([])

  async getAllSurvey() {
    const { data } = await this.supabaseService.getClient().from('surveys').select('*');
    this.surveys.set(data ?? [])
  }
}

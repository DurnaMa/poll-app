import {computed, inject, Injectable, signal } from '@angular/core';
import {SupabaseService} from './supabase';
import { Option, Survey } from '../interface/interface';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  supabaseService = inject(SupabaseService);

  surveys = signal<Survey[]>([]);

  async getAllSurvey() {
    const { data } = await this.supabaseService.getClient().from('surveys').select('*');
    this.surveys.set(data ?? []);
  }

  activeSurveys = computed(() => this.surveys().filter((survey) => new Date(survey.endDate) > new Date()));

  async createSurveys(title: string, description: string, deadline: string) {
    const { data, error } = await this.supabaseService.getClient()
      .from('surveys')
      .insert([{ title, description, deadline }])
      .select();
  }
}

import { Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { SurveyService } from '../../services/survey.services';
import { DatePipe } from '@angular/common';
import { computed, signal } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-list',
  imports: [MatChipsModule, MatSelectModule, DatePipe, MatMenuModule],
  templateUrl: './survey-list.html',
  styleUrl: './survey-list.scss',
})
export class SurveyListComponent {
  activeTab: 'active' | 'past' = 'active';
  selectedCategory = signal<string | null>(null);

  root = inject(Router);
  surveyService = inject(SurveyService);

  categoryOptions = computed(() => {
    const all = this.surveyService.surveys().map((survey) => survey.category);
    return [...new Set(all)].filter((cat): cat is string => !!cat);
  });

  filteredSurveys = computed(() => {
    const surveys = this.surveyService.surveys();
    const cat = this.selectedCategory();
    return cat ? surveys.filter((survey) => survey.category === cat) : surveys;
  });

  selectCategory(cat: string) {
    if (cat === 'all') {
      this.selectedCategory.set(null);
      return;
    }
    this.selectedCategory.update((current) => (current === cat ? null : cat));
  }

  ngOnInit() {
    this.surveyService.getAllSurvey();
  }

  goToSurvey(id: number) {
    this.root.navigate(['/survey', id]);
  }
}

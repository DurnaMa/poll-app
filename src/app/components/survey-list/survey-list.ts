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
  activeTab = signal<'active' | 'past'>('active');
  selectedCategory = signal<string | null>(null);

  root = inject(Router);
  surveyService = inject(SurveyService);

  /**
   * Liefert alle vorhandenen Kategorien der Umfragen ohne Duplikate und ohne leere Werte.
   */
  categoryOptions = computed(() => {
    const all = this.surveyService.surveys().map((survey) => survey.category);
    return [...new Set(all)].filter((cat): cat is string => !!cat);
  });

  /**
   * Liefert die nach aktivem Reiter (laufend/abgeschlossen) und gewählter Kategorie
   * gefilterten Umfragen.
   */
  filteredSurveys = computed(() => {
    const surveys = this.surveyService.surveys();
    const cat = this.selectedCategory();
    const now = new Date();

    return surveys
      .filter((survey) =>
        this.activeTab() === 'active' ? new Date(survey.endDate) > now : new Date(survey.endDate) <= now
      )
      .filter((survey) => (cat ? survey.category === cat : true));
  });

  /**
   * Setzt die Kategoriefilterung. "all" hebt den Filter auf; ein erneuter Klick auf
   * dieselbe Kategorie schaltet den Filter ebenfalls aus (Toggle).
   * @param cat - gewählte Kategorie oder "all"
   */
  selectCategory(cat: string) {
    if (cat === 'all') {
      this.selectedCategory.set(null);
      return;
    }
    this.selectedCategory.update((current) => (current === cat ? null : cat));
  }

  /**
   * Lädt beim Initialisieren der Komponente alle Umfragen.
   */
  ngOnInit() {
    this.surveyService.getAllSurvey();
  }

  /**
   * Öffnet die Detailansicht der gewählten Umfrage.
   * @param id - ID der Umfrage
   */
  goToSurvey(id: number) {
    this.root.navigate(['/survey', id]);
  }
}

import { Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { SurveyService } from '../../services/survey.services';

@Component({
  selector: 'app-survey-list',
  imports: [MatChipsModule, MatSelectModule],
  templateUrl: './survey-list.html',
  styleUrl: './survey-list.scss',
})
export class SurveyListComponent {
  activeTab: 'active' | 'past' = 'active';

  surveyService = inject(SurveyService);

  ngOnInit() {
    this.surveyService.getAllSurvey();
  }
}

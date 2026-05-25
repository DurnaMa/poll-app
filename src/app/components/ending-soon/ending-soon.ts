import { MatCardModule } from '@angular/material/card';
import { Component, inject } from '@angular/core';
import { SurveyService } from '../../services/survey.services';

@Component({
  selector: 'app-ending-soon',
  imports: [MatCardModule],
  templateUrl: './ending-soon.html',
  styleUrl: './ending-soon.scss',
})
export class EndingSoonComponent {

  surveyService = inject(SurveyService);

  ngOnInit() {
    this.surveyService.getAllSurvey();
  }
}

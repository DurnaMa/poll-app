import { MatCardModule } from '@angular/material/card';
import { Component, inject } from '@angular/core';
import { SurveyService } from '../../services/survey.services';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ending-soon',
  imports: [MatCardModule, DatePipe],
  templateUrl: './ending-soon.html',
  styleUrl: './ending-soon.scss',
})
export class EndingSoonComponent {
  surveyService = inject(SurveyService);
  router = inject(Router);

  ngOnInit() {
    this.surveyService.getAllSurvey();
  }

  goToSurvey(id: number) {
  this.router.navigate(['/survey', id]);
}
}

import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-survey-list',
  imports: [MatChipsModule, MatSelectModule],
  templateUrl: './survey-list.html',
  styleUrl: './survey-list.scss'
})
export class SurveyListComponent {
  activeTab: 'active' | 'past' = 'active';

  surveys = [
    { category: 'Team activities', title: "Let's Plan the Next Team Event Together", daysLeft: 1 },
    { category: 'Gaming', title: 'Gaming habits and favorite games!', daysLeft: 3 },
    { category: 'Gaming', title: 'Gaming habits and favorite games!', daysLeft: 7 },
    { category: 'Healthy Lifestyle', title: 'Healthier future: Fit & wellness survey!', daysLeft: 2 },
    { category: 'Healthy Lifestyle', title: 'Healthier future: Fit & wellness survey!', daysLeft: 5 },
    { category: 'Team activities', title: "Let's Plan the Next Team Event Together", daysLeft: 1 },
  ];
}

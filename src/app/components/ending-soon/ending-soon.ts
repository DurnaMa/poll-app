import { MatCardModule } from '@angular/material/card';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ending-soon',
  imports: [MatCardModule],
  templateUrl: './ending-soon.html',
  styleUrl: './ending-soon.scss',
})
export class EndingSoonComponent {
  surveys = [
    { category: 'Team activities', title: "Let's Plan the Next Team Event Together", daysLeft: 1 },
    { category: 'Health & Wellness', title: 'Fit & wellness survey!', daysLeft: 2 },
    { category: 'Gaming & Entertainment', title: 'Gaming habits and favorite games!', daysLeft: 3 },
  ];
}

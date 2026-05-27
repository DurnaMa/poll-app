import { Component } from '@angular/core';
import {MainHeader} from '../main-header/main-header';
import { Hero } from '../hero/hero';
import { EndingSoonComponent } from '../ending-soon/ending-soon';
import { SurveyListComponent } from '../survey-list/survey-list';
import { SurveyVotes } from '../survey-votes/survey-votes';

@Component({
  selector: 'app-home',
  imports: [MainHeader, Hero, EndingSoonComponent, SurveyListComponent, SurveyVotes],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}

import { Component } from '@angular/core';
import {MainHeader} from '../main-header/main-header';
import { Hero } from '../hero/hero';
import { EndingSoonComponent } from '../ending-soon/ending-soon';
import {SurveyCard} from '../survey-card/survey-card';
import { SurveyListComponent } from '../survey-list/survey-list';

@Component({
  selector: 'app-home',
  imports: [MainHeader, Hero, EndingSoonComponent, SurveyCard, SurveyListComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}

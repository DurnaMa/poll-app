import { Component } from '@angular/core';
import {MainHeader} from '../main-header/main-header';
import {Hero} from '../hero/hero';
import {EndingSoon} from '../ending-soon/ending-soon';
import {SurveyCard} from '../survey-card/survey-card';
import {SurveyList} from '../survey-list/survey-list';

@Component({
  selector: 'app-home',
  imports: [MainHeader, Hero, EndingSoon, SurveyCard, SurveyList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}

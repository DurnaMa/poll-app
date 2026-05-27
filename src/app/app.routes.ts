import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { SurveyVotes } from './components/survey-votes/survey-votes';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'survey/:id', component: SurveyVotes },
];

import { Component, computed, HostBinding, inject, input, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SurveyDialog } from '../survey-dialog/survey-dialog';


@Component({
  selector: 'app-main-header',
  imports: [],
  templateUrl: './main-header.html',
  styleUrl: './main-header.scss',
})
export class MainHeader {
  router = inject(Router);
  currentUrl = signal(this.router.url);
  showCreateButton = input<boolean>(true);
  isSurveyVotes = computed(() => this.currentUrl().startsWith('/survey/'));
  dialog = inject(MatDialog)

  constructor() {
    const router = inject(Router);
    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentUrl.set(e.url);
    });
  }

  @HostBinding('class.main-header--light')
  get isLight() {
    return this.isSurveyVotes();
  }

  openDialog() {
    this.dialog.open(SurveyDialog, {
      width: '1166px',
      height: '844px',
      maxWidth: '100vw',
    });
  }

}

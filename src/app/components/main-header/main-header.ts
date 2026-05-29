import { Component, computed, HostBinding, inject, input, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


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
  isHomePage = computed(() => this.router.url === '/');
  isSurveyVotes = computed(() => this.currentUrl().startsWith('/survey/'));

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
}

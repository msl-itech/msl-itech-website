import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent implements OnInit, OnDestroy {
  articles: any[] = [];
  private translateSubscription: Subscription = new Subscription();

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.loadArticles();

    // S'abonner aux changements de langue
    this.translateSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadArticles();
    });
  }

  ngOnDestroy() {
    this.translateSubscription.unsubscribe();
  }

  loadArticles() {
    this.articles = [
      {
        img: '../../assets/img/accueil/img1.wepb',
        date: '20 Nov 2024',
        title: this.translate.instant(
          'COMPONENTS.BLOG.ARTICLES.ARTICLE1.TITLE'
        ),
        description: this.translate.instant(
          'COMPONENTS.BLOG.ARTICLES.ARTICLE1.DESCRIPTION'
        ),
        link: '#',
      },
      {
        img: '../../assets/img/accueil/img2.wepb',
        date: '15 Nov 2024',
        title: this.translate.instant(
          'COMPONENTS.BLOG.ARTICLES.ARTICLE2.TITLE'
        ),
        description: this.translate.instant(
          'COMPONENTS.BLOG.ARTICLES.ARTICLE2.DESCRIPTION'
        ),
        link: '#',
      },
      {
        img: '../../assets/img/accueil/img3.wepb',
        date: '10 Nov 2024',
        title: this.translate.instant(
          'COMPONENTS.BLOG.ARTICLES.ARTICLE3.TITLE'
        ),
        description: this.translate.instant(
          'COMPONENTS.BLOG.ARTICLES.ARTICLE3.DESCRIPTION'
        ),
        link: '#',
      },
    ];
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BlogArticle, BlogService } from '../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit, OnDestroy {
  articles: BlogArticle[] = [];
  private translateSubscription: Subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadArticles();

    // S'abonner aux changements de langue
    this.translateSubscription = this.translate.onLangChange.subscribe(() => {
      this.blogService.reloadArticles();
      this.loadArticles();
    });
  }

  ngOnDestroy() {
    this.translateSubscription.unsubscribe();
  }

  loadArticles() {
    // Récupérer les 3 articles les plus récents pour la section sur la page d'accueil
    this.articles = this.blogService.getRecentArticles(3);
  }

  readArticle(article: BlogArticle) {
    this.router.navigate(['/blog', article.slug]);
  }

  goToBlogPage() {
    this.router.navigate(['/blog']);
  }
}

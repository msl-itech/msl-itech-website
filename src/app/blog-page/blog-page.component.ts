import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BlogArticle, BlogService } from '../services/blog.service';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css'],
})
export class BlogPageComponent implements OnInit, OnDestroy {
  articles: BlogArticle[] = [];
  filteredArticles: BlogArticle[] = [];
  selectedTag: string = '';
  allTags: string[] = [];
  private subscription = new Subscription();

  constructor(
    private blogService: BlogService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadArticles();

    // S'abonner aux changements de langue
    this.subscription.add(
      this.translate.onLangChange.subscribe(() => {
        this.blogService.reloadArticles();
        this.loadArticles();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadArticles(): void {
    this.subscription.add(
      this.blogService.getArticles().subscribe((articles) => {
        this.articles = articles;
        this.filteredArticles = [...articles];
        this.extractTags();
      })
    );
  }

  private extractTags(): void {
    const tagSet = new Set<string>();
    this.articles.forEach((article) => {
      article.tags.forEach((tag) => tagSet.add(tag));
    });
    this.allTags = Array.from(tagSet);
  }

  filterByTag(tag: string): void {
    this.selectedTag = tag;
    if (tag === '') {
      this.filteredArticles = [...this.articles];
    } else {
      this.filteredArticles = this.blogService.getArticlesByTag(tag);
    }
  }

  clearFilter(): void {
    this.selectedTag = '';
    this.filteredArticles = [...this.articles];
  }

  readArticle(article: BlogArticle): void {
    this.router.navigate(['/blog', article.slug]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

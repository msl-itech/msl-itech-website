import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BlogArticle, BlogService } from '../services/blog.service';
import { SeoService } from '../services/seo.service';

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
    private translate: TranslateService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    // Configuration SEO
    this.seoService.updateMetaTags({
      title: 'Blog MSL iTech - Actualités Odoo & ERP',
      description: 'Découvrez nos articles sur Odoo, les ERP, les bonnes pratiques, études de cas et actualités du monde des solutions de gestion d\'entreprise.',
      keywords: 'blog Odoo, actualités ERP, études de cas, bonnes pratiques Odoo, tutoriels ERP, conseils gestion',
      url: '/blog',
      type: 'website'
    });

    // Ajouter BreadcrumbList
    const breadcrumbSchema = this.seoService.generateBreadcrumbSchema([
      { name: 'Accueil', url: '/accueil' },
      { name: 'Blog', url: '/blog' }
    ]);
    this.seoService.addJsonLdSchema(breadcrumbSchema);

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
    this.seoService.removeAllJsonLdSchemas();
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

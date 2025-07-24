import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BlogArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
  slug: string;
  readTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private articlesSubject = new BehaviorSubject<BlogArticle[]>([]);
  public articles$ = this.articlesSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.loadArticles();
  }

  private loadArticles(): void {
    const articles: BlogArticle[] = [
      {
        id: '1',
        title: this.translate.instant('BLOG.ARTICLES.ARTICLE1.TITLE'),
        description: this.translate.instant(
          'BLOG.ARTICLES.ARTICLE1.DESCRIPTION'
        ),
        content: this.translate.instant('BLOG.ARTICLES.ARTICLE1.CONTENT'),
        image: '../../assets/img/accueil/img1.webp',
        date: '2024-12-15',
        author: 'MSL-iTECH',
        tags: ['Odoo', 'Trésorerie', 'Gestion financière'],
        slug: 'modernisez-gestion-tresorerie-odoo',
        readTime: 8,
      },
      {
        id: '2',
        title: this.translate.instant('BLOG.ARTICLES.ARTICLE2.TITLE'),
        description: this.translate.instant(
          'BLOG.ARTICLES.ARTICLE2.DESCRIPTION'
        ),
        content: this.translate.instant('BLOG.ARTICLES.ARTICLE2.CONTENT'),
        image: '../../assets/img/accueil/img2.webp',
        date: '2024-12-10',
        author: 'MSL-iTECH',
        tags: ['Odoo', 'Facturation', 'Automatisation'],
        slug: 'automatisez-factures-odoo',
        readTime: 6,
      },
      {
        id: '3',
        title: this.translate.instant('BLOG.ARTICLES.ARTICLE3.TITLE'),
        description: this.translate.instant(
          'BLOG.ARTICLES.ARTICLE3.DESCRIPTION'
        ),
        content: this.translate.instant('BLOG.ARTICLES.ARTICLE3.CONTENT'),
        image: '../../assets/img/accueil/img3.webp',
        date: '2024-12-05',
        author: 'MSL-iTECH',
        tags: ['Digitalisation', 'Projet', 'Transformation'],
        slug: 'reussir-projet-digitalisation',
        readTime: 10,
      },
    ];

    this.articlesSubject.next(articles);
  }

  public getArticles(): Observable<BlogArticle[]> {
    return this.articles$;
  }

  public getAllArticles(): BlogArticle[] {
    return this.articlesSubject.value;
  }

  public getArticleById(id: string): BlogArticle | undefined {
    return this.articlesSubject.value.find((article) => article.id === id);
  }

  public getArticleBySlug(slug: string): BlogArticle | undefined {
    return this.articlesSubject.value.find((article) => article.slug === slug);
  }

  public getRecentArticles(limit: number = 3): BlogArticle[] {
    return this.articlesSubject.value
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  public getArticlesByTag(tag: string): BlogArticle[] {
    return this.articlesSubject.value.filter((article) =>
      article.tags.some(
        (articleTag) => articleTag.toLowerCase() === tag.toLowerCase()
      )
    );
  }

  // Méthode pour recharger les articles lors du changement de langue
  public reloadArticles(): void {
    this.loadArticles();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BlogArticle, BlogService } from '../services/blog.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  article: BlogArticle | null = null;
  relatedArticles: BlogArticle[] = [];
  loading = true;
  error = false;
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadArticle();

    // S'abonner aux changements de paramètres de route (slug)
    this.subscription.add(
      this.route.params.subscribe((params) => {
        if (params['slug']) {
          console.log('Nouveau slug détecté:', params['slug']);
          this.loadArticle();
        }
      })
    );

    // S'abonner aux changements de langue
    this.subscription.add(
      this.translate.onLangChange.subscribe(() => {
        this.blogService.reloadArticles();
        this.loadArticle();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadArticle(): void {
    // Réinitialiser l'état
    this.loading = true;
    this.error = false;
    this.article = null;
    this.relatedArticles = [];

    const slug = this.route.snapshot.params['slug'];
    console.log("Chargement de l'article avec slug:", slug);

    if (!slug) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.subscription.add(
      this.blogService.getArticles().subscribe((articles) => {
        console.log('Articles reçus:', articles.length);
        this.article = this.blogService.getArticleBySlug(slug) || null;
        console.log('Article trouvé:', this.article?.title || 'Aucun');

        if (!this.article) {
          this.error = true;
          console.error('Article non trouvé pour le slug:', slug);
        } else {
          this.loadRelatedArticles();
          // Scroll to top when new article loads
          window.scrollTo(0, 0);
        }

        this.loading = false;
      })
    );
  }

  private loadRelatedArticles(): void {
    if (!this.article) return;

    // Trouver des articles avec des tags similaires
    const allArticles = this.blogService.getAllArticles();
    const relatedByTags = allArticles.filter(
      (a) =>
        a.id !== this.article!.id &&
        a.tags.some((tag) => this.article!.tags.includes(tag))
    );

    // Si pas assez d'articles similaires, prendre les plus récents
    if (relatedByTags.length < 2) {
      this.relatedArticles = allArticles
        .filter((a) => a.id !== this.article!.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2);
    } else {
      this.relatedArticles = relatedByTags.slice(0, 2);
    }
  }

  backToBlog(): void {
    this.router.navigate(['/blog']);
  }

  readRelatedArticle(article: BlogArticle): void {
    if (!article || !article.slug) {
      console.error('Article ou slug manquant:', article);
      return;
    }

    console.log(
      "Navigation vers l'article:",
      article.title,
      'slug:',
      article.slug
    );

    // Navigation vers le nouvel article - ngOnInit() gèrera le rechargement
    this.router.navigate(['/blog', article.slug]).catch((error) => {
      console.error('Erreur de navigation:', error);
      // Fallback: recharger la page complète
      window.location.href = `/blog/${article.slug}`;
    });
  }

  shareArticle(platform: string): void {
    if (!this.article) {
      console.error('Aucun article à partager');
      return;
    }

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.article.title);
    const description = encodeURIComponent(this.article.description);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${description}%0A%0A${url}`;
        break;
      default:
        console.error('Plateforme de partage non supportée:', platform);
        return;
    }

    try {
      if (platform === 'email') {
        window.location.href = shareUrl;
      } else {
        const popup = window.open(
          shareUrl,
          '_blank',
          'width=600,height=400,scrollbars=yes,resizable=yes'
        );

        // Vérifier si le popup a été bloqué
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          // Si le popup est bloqué, ouvrir dans un nouvel onglet
          window.open(shareUrl, '_blank');
        }
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      // Fallback : copier le lien
      this.copyLink();
    }
  }

  copyLink(): void {
    const url = window.location.href;

    // Méthode moderne avec navigator.clipboard (fonctionne avec HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          this.showCopySuccessMessage();
        })
        .catch(() => {
          this.fallbackCopyTextToClipboard(url);
        });
    } else {
      // Fallback pour les environnements non-HTTPS
      this.fallbackCopyTextToClipboard(url);
    }
  }

  private fallbackCopyTextToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      this.showCopySuccessMessage();
    } catch (err) {
      console.error('Impossible de copier le lien', err);
      // Afficher le lien pour que l'utilisateur puisse le copier manuellement
      prompt('Copiez ce lien:', text);
    }

    document.body.removeChild(textArea);
  }

  private showCopySuccessMessage(): void {
    // Créer un message temporaire
    const message = document.createElement('div');
    message.textContent = 'Lien copié !';
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #114d5a;
      color: white;
      padding: 12px 20px;
      border-radius: 50px;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 5px 15px rgba(17, 77, 90, 0.3);
      transition: all 0.3s ease;
    `;

    document.body.appendChild(message);

    // Retirer le message après 3 secondes
    setTimeout(() => {
      message.style.opacity = '0';
      message.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 3000);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Méthode pour convertir le markdown en HTML (simple)
  convertMarkdownToHtml(markdown: string): string {
    return markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gm, '<p>$1</p>')
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
      .replace(/<p><ul>/g, '<ul>')
      .replace(/<\/ul><\/p>/g, '</ul>');
  }
}

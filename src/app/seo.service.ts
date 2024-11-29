import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private titleService: Title, private metaService: Meta){}
  
  updateTitle(title: string) {
    this.titleService.setTitle(title);
  }

  updateMetaTags(tags: { name: string, content: string }[]) {
    tags.forEach(tag => this.metaService.updateTag(tag));
  }
  updateHreflangTags(tags: { hrefLang: string, href: string }[]) {
    this.metaService.removeTag("name='hreflang'");
    tags.forEach(tag => {
      this.metaService.addTag({ name: 'hreflang', content: tag.hrefLang });
      this.metaService.addTag({ rel: 'alternate', hreflang: tag.hrefLang, href: tag.href });
    });
  }
}

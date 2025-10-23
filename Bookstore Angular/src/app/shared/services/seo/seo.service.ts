import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private defaultData: SEOData = {
    title: 'Bookstore - Your Ultimate Online Book Store | Buy Books Online',
    description: 'Discover and buy books online from our extensive collection. Find bestsellers, new releases, and classic literature. Fast shipping, great prices, and excellent customer service.',
    keywords: 'books, bookstore, online books, buy books, novels, literature, bestsellers, fiction, non-fiction, textbooks',
    image: 'https://bookstore.com/assets/images/bookstore-og-image.jpg',
    url: 'https://bookstore.com',
    type: 'website',
    author: 'Bookstore'
  };

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router
  ) {
    this.initializeDefaultMeta();
  }

  private initializeDefaultMeta(): void {
    this.setMetaData(this.defaultData);
  }

  setMetaData(data: SEOData): void {
    const mergedData = { ...this.defaultData, ...data };

    // Set title
    if (mergedData.title) {
      this.title.setTitle(mergedData.title);
    }

    // Set basic meta tags
    this.setMetaTag('description', mergedData.description);
    this.setMetaTag('keywords', mergedData.keywords);
    this.setMetaTag('author', mergedData.author);

    // Set Open Graph tags
    this.setMetaTag('og:title', mergedData.title, 'property');
    this.setMetaTag('og:description', mergedData.description, 'property');
    this.setMetaTag('og:image', mergedData.image, 'property');
    this.setMetaTag('og:url', mergedData.url || this.router.url, 'property');
    this.setMetaTag('og:type', mergedData.type || 'website', 'property');
    this.setMetaTag('og:site_name', 'Bookstore', 'property');

    // Set Twitter Card tags
    this.setMetaTag('twitter:card', 'summary_large_image', 'name');
    this.setMetaTag('twitter:title', mergedData.title, 'name');
    this.setMetaTag('twitter:description', mergedData.description, 'name');
    this.setMetaTag('twitter:image', mergedData.image, 'name');
    this.setMetaTag('twitter:url', mergedData.url || this.router.url, 'name');

    // Set article specific tags if provided
    if (mergedData.publishedTime) {
      this.setMetaTag('article:published_time', mergedData.publishedTime, 'property');
    }
    if (mergedData.modifiedTime) {
      this.setMetaTag('article:modified_time', mergedData.modifiedTime, 'property');
    }
    if (mergedData.author) {
      this.setMetaTag('article:author', mergedData.author, 'property');
    }
    if (mergedData.section) {
      this.setMetaTag('article:section', mergedData.section, 'property');
    }
    if (mergedData.tags) {
      this.setMetaTag('article:tag', mergedData.tags.join(','), 'property');
    }
  }

  private setMetaTag(name: string, content: string | undefined, attribute: string = 'name'): void {
    if (content) {
      this.meta.updateTag({ [attribute]: name, content });
    }
  }

  updateCanonicalUrl(url?: string): void {
    const canonicalUrl = url || `https://bookstore.com${this.router.url}`;

    // Remove existing canonical link
    const existingCanonical = this.meta.getTag('rel="canonical"');
    if (existingCanonical) {
      this.meta.removeTag('rel="canonical"');
    }

    // Add new canonical link
    this.meta.addTag({ rel: 'canonical', href: canonicalUrl });
  }

  updateRobots(content: string): void {
    this.meta.updateTag({ name: 'robots', content });
  }

  addStructuredData(data: any): void {
    // Remove existing structured data script
    const existingScript = document.querySelector('script[type="application/ld+json"]#structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Predefined SEO data for common pages
  setBookPageSEO(bookData: { title: string; author: string; description: string; image: string; isbn?: string }): void {
    const seoData: SEOData = {
      title: `${bookData.title} by ${bookData.author} | Bookstore`,
      description: bookData.description || `Buy ${bookData.title} by ${bookData.author}. Available now at Bookstore with fast shipping and great prices.`,
      keywords: `${bookData.title}, ${bookData.author}, book, novel, literature, ${bookData.isbn || ''}`,
      image: bookData.image,
      type: 'book',
      author: bookData.author
    };

    this.setMetaData(seoData);

    // Add book-specific structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Book",
      "name": bookData.title,
      "author": {
        "@type": "Person",
        "name": bookData.author
      },
      "description": bookData.description,
      "image": bookData.image,
      "isbn": bookData.isbn,
      "url": `https://bookstore.com/books/${encodeURIComponent(bookData.title.toLowerCase().replace(/\s+/g, '-'))}`
    };

    this.addStructuredData(structuredData);
  }

  setCategoryPageSEO(category: string, description?: string): void {
    const seoData: SEOData = {
      title: `${category} Books | Bookstore`,
      description: description || `Browse our collection of ${category.toLowerCase()} books. Find the best ${category.toLowerCase()} novels, textbooks, and literature at Bookstore.`,
      keywords: `${category}, ${category} books, ${category} novels, ${category} literature`,
      type: 'website'
    };

    this.setMetaData(seoData);
  }

  setHomePageSEO(): void {
    this.setMetaData(this.defaultData);
  }
}

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit {
  searchTerm: string = '';
  activeCategory: string = 'all';
  faqItems: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.faqItems = Array.from(document.querySelectorAll('.faq-item'));
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    // Category filter buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        this.activeCategory = target.getAttribute('data-category') || 'all';
        this.filterFAQs();
      });
    });

    // Search input
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        this.searchTerm = target.value.toLowerCase();
        this.filterFAQs();
      });
    }

    // FAQ toggle functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', (e) => {
        const faqItem = (e.target as HTMLElement).closest('.faq-item');
        if (faqItem) {
          faqItem.classList.toggle('active');
        }
      });
    });
  }

  filterFAQs() {
    if (isPlatformBrowser(this.platformId)) {
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach((item: Element) => {
        const htmlItem = item as HTMLElement;
        const category = htmlItem.getAttribute('data-category');
        const questionText = htmlItem.querySelector('h3')?.textContent?.toLowerCase() || '';
        const answerText = htmlItem.querySelector('p')?.textContent?.toLowerCase() || '';

        const matchesCategory = this.activeCategory === 'all' || category === this.activeCategory;
        const matchesSearch = !this.searchTerm ||
          questionText.includes(this.searchTerm) ||
          answerText.includes(this.searchTerm);

        if (matchesCategory && matchesSearch) {
          htmlItem.style.display = 'block';
        } else {
          htmlItem.style.display = 'none';
        }
      });

      // Update active category button
      const categoryButtons = document.querySelectorAll('.category-btn');
      categoryButtons.forEach(button => {
        const htmlButton = button as HTMLElement;
        htmlButton.classList.toggle('active', htmlButton.getAttribute('data-category') === this.activeCategory);
      });
    }
  }
}

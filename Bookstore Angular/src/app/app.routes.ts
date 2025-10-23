import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.component').then(m => m.ShopComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/about/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/about/privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/about/terms/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/about/faq/faq.component').then(m => m.FaqComponent)
  }
];

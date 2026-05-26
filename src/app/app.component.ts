import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './core/services/cart.service';
import { AuthService } from './core/services/auth.service';

@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive],template:`
<header class="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
  <nav class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
    <a routerLink="/" class="font-bold">Market MVP</a>
    <a routerLink="/search" routerLinkActive="font-semibold" class="text-sm">Поиск</a>
    <a routerLink="/orders" routerLinkActive="font-semibold" class="text-sm">Заказы</a>
    <span class="flex-1"></span>
    @if (auth.user(); as user) { <span class="hidden text-sm sm:inline">{{user.name}}</span><button class="text-sm" (click)="auth.logout()">Выйти</button> } @else { <a routerLink="/auth/login" class="text-sm">Войти</a> }
    <a routerLink="/cart" class="rounded-xl bg-slate-950 px-3 py-2 text-sm text-white">Корзина {{cart.totalQty()}}</a>
  </nav>
</header>
<main class="mx-auto max-w-7xl px-4 py-6"><router-outlet /></main>`})
export class AppComponent{cart=inject(CartService);auth=inject(AuthService)}

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
export const routes:Routes=[
 {path:'',loadComponent:()=>import('./features/catalog/home.page').then(m=>m.HomePage)},
 {path:'search',loadComponent:()=>import('./features/catalog/search.page').then(m=>m.SearchPage)},
 {path:'products/:id',loadComponent:()=>import('./features/catalog/product-detail.page').then(m=>m.ProductDetailPage)},
 {path:'cart',loadComponent:()=>import('./features/cart/cart.page').then(m=>m.CartPage)},
 {path:'checkout',canActivate:[authGuard],loadComponent:()=>import('./features/cart/checkout.page').then(m=>m.CheckoutPage)},
 {path:'orders',canActivate:[authGuard],loadComponent:()=>import('./features/orders/orders.page').then(m=>m.OrdersPage)},
 {path:'orders/:id',canActivate:[authGuard],loadComponent:()=>import('./features/orders/order-detail.page').then(m=>m.OrderDetailPage)},
 {path:'auth/login',loadComponent:()=>import('./features/auth/login.page').then(m=>m.LoginPage)},
 {path:'auth/register',loadComponent:()=>import('./features/auth/register.page').then(m=>m.RegisterPage)},
 {path:'**',redirectTo:''}
];

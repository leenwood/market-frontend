import { Injectable, inject, signal } from '@angular/core';import { HttpClient } from '@angular/common/http';import { Router } from '@angular/router';import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';import { User } from '../models';
interface TokenResponse{access_token:string;refresh_token:string;expires_in:number}
interface UserResponse{id:string;email:string;name:string;role:string}
@Injectable({providedIn:'root'}) export class AuthService{
 private http=inject(HttpClient);private router=inject(Router);
 user=signal<User|null>(this.loadUser());
 guestUserId=signal<string|null>(localStorage.getItem('guest_user_id'));
 constructor(){if(!this.user())this.ensureGuestSession()}
 get token(){return localStorage.getItem('access_token')}
 get refreshToken(){return localStorage.getItem('refresh_token')}
 login(email:string,password:string):Observable<void>{
  return this.http.post<TokenResponse>('/auth/login',{email,password}).pipe(
   tap(r=>{localStorage.setItem('access_token',r.access_token);localStorage.setItem('refresh_token',r.refresh_token)}),
   switchMap(()=>this.mergeGuestCartIfNeeded()),switchMap(()=>this.me()),map(()=>void 0))}
 register(name:string,email:string,password:string):Observable<void>{
  return this.http.post<UserResponse>('/auth/register',{name,email,password}).pipe(switchMap(()=>this.login(email,password)))}
 me():Observable<User>{
  return this.http.get<UserResponse>('/auth/me').pipe(tap(u=>{const user:User={id:u.id,name:u.name,email:u.email};localStorage.setItem('user',JSON.stringify(user));this.user.set(user)}),map(u=>({id:u.id,name:u.name,email:u.email})))}
 logout(){const rt=this.refreshToken;if(rt)this.http.post('/auth/logout',{refresh_token:rt}).subscribe({error:()=>{}});localStorage.removeItem('access_token');localStorage.removeItem('refresh_token');localStorage.removeItem('user');this.user.set(null);this.ensureGuestSession();this.router.navigateByUrl('/auth/login')}
 private loadUser():User|null{try{return JSON.parse(localStorage.getItem('user')??'null') as User|null}catch{return null}}
 private getUserIdFromToken():string|null{const t=localStorage.getItem('access_token');if(!t)return null;try{return JSON.parse(atob(t.split('.')[1])).sub}catch{return null}}
 ensureGuestSession():void{const g=localStorage.getItem('guest_user_id');this.http.post<{access_token:string;guest_user_id:string;expires_in:number}>('/auth/guest',g?{guest_id:g}:{}).subscribe({next:r=>{localStorage.setItem('guest_token',r.access_token);localStorage.setItem('guest_user_id',r.guest_user_id);this.guestUserId.set(r.guest_user_id)},error:()=>{}})}
 private mergeGuestCartIfNeeded():Observable<void>{const guestUserId=localStorage.getItem('guest_user_id');const userId=this.getUserIdFromToken();if(!guestUserId||!userId)return of(void 0);return this.http.post<void>(`/cart/${userId}/merge`,{guest_user_id:guestUserId}).pipe(tap(()=>this.clearGuestSession()),catchError(()=>of(void 0)))}
 private clearGuestSession():void{localStorage.removeItem('guest_token');localStorage.removeItem('guest_user_id');this.guestUserId.set(null)}}

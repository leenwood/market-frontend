import { Injectable, inject, signal } from '@angular/core';import { HttpClient } from '@angular/common/http';import { Router } from '@angular/router';import { Observable, map, switchMap, tap } from 'rxjs';import { User } from '../models';
interface TokenResponse{access_token:string;refresh_token:string;expires_in:number}
interface UserResponse{id:string;email:string;name:string;role:string}
@Injectable({providedIn:'root'}) export class AuthService{
 private http=inject(HttpClient);private router=inject(Router);
 user=signal<User|null>(this.loadUser());
 get token(){return localStorage.getItem('access_token')}
 get refreshToken(){return localStorage.getItem('refresh_token')}
 login(email:string,password:string):Observable<void>{
  return this.http.post<TokenResponse>('/auth/login',{email,password}).pipe(
   tap(r=>{localStorage.setItem('access_token',r.access_token);localStorage.setItem('refresh_token',r.refresh_token)}),
   switchMap(()=>this.me()),map(()=>void 0))}
 register(name:string,email:string,password:string):Observable<void>{
  return this.http.post<UserResponse>('/auth/register',{name,email,password}).pipe(switchMap(()=>this.login(email,password)))}
 me():Observable<User>{
  return this.http.get<UserResponse>('/auth/me').pipe(tap(u=>{const user:User={id:u.id,name:u.name,email:u.email};localStorage.setItem('user',JSON.stringify(user));this.user.set(user)}),map(u=>({id:u.id,name:u.name,email:u.email})))}
 logout(){const rt=this.refreshToken;if(rt)this.http.post('/auth/logout',{refresh_token:rt}).subscribe({error:()=>{}});localStorage.removeItem('access_token');localStorage.removeItem('refresh_token');localStorage.removeItem('user');this.user.set(null);this.router.navigateByUrl('/auth/login')}
 private loadUser():User|null{try{return JSON.parse(localStorage.getItem('user')??'null') as User|null}catch{return null}}}

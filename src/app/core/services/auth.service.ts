import { Injectable, signal } from '@angular/core';import { Router } from '@angular/router';import { User } from '../models';
@Injectable({providedIn:'root'}) export class AuthService{private tokenKey='access_token';user=signal<User|null>(this.loadUser());constructor(private router:Router){}
 get token(){return localStorage.getItem(this.tokenKey)} login(email:string,_password:string){const user={id:'1',name:email.split('@')[0]||'User',email};this.persist(user);return true}
 register(name:string,email:string,_password:string){this.persist({id:'1',name,email});return true} logout(){localStorage.removeItem(this.tokenKey);localStorage.removeItem('user');this.user.set(null);this.router.navigateByUrl('/auth/login')}
 private persist(user:User){localStorage.setItem(this.tokenKey,'mvp-token');localStorage.setItem('user',JSON.stringify(user));this.user.set(user)} private loadUser(){try{return JSON.parse(localStorage.getItem('user')??'null') as User|null}catch{return null}}
}

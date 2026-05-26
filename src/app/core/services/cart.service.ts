import { Injectable, computed, signal } from '@angular/core';import { CartItem, Product } from '../models';
@Injectable({providedIn:'root'}) export class CartService{private readonly key='mvp_cart';items=signal<CartItem[]>(this.load());totalQty=computed(()=>this.items().reduce((s,i)=>s+i.qty,0));total=computed(()=>this.items().reduce((s,i)=>s+i.qty*i.product.price,0));
 add(product:Product){this.items.update(items=>{const ex=items.find(i=>i.product.id===product.id);const next=ex?items.map(i=>i.product.id===product.id?{...i,qty:i.qty+1}:i):[...items,{product,qty:1}];this.save(next);return next})}
 dec(id:string){this.items.update(items=>{const next=items.map(i=>i.product.id===id?{...i,qty:i.qty-1}:i).filter(i=>i.qty>0);this.save(next);return next})}
 remove(id:string){this.items.update(items=>{const next=items.filter(i=>i.product.id!==id);this.save(next);return next})}
 clear(){this.items.set([]);localStorage.removeItem(this.key)} qty(id:string){return this.items().find(i=>i.product.id===id)?.qty??0}
 private load(){try{return JSON.parse(localStorage.getItem(this.key)??'[]') as CartItem[]}catch{return []}} private save(v:CartItem[]){localStorage.setItem(this.key,JSON.stringify(v))}}

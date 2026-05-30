import { Injectable, computed, effect, inject, signal } from '@angular/core';import { HttpClient } from '@angular/common/http';import { CartItem, Product } from '../models';import { AuthService } from './auth.service';
interface ApiItem{product_id:string;name:string;price:number;quantity:number}
interface ApiCart{user_id:string;items:Record<string,ApiItem>;updated_at:string}
@Injectable({providedIn:'root'}) export class CartService{
 private http=inject(HttpClient);private auth=inject(AuthService);
 items=signal<CartItem[]>([]);
 totalQty=computed(()=>this.items().reduce((s,i)=>s+i.qty,0));
 total=computed(()=>this.items().reduce((s,i)=>s+i.qty*i.product.price,0));
 constructor(){effect(()=>{const user=this.auth.user();if(user){this.http.get<ApiCart>(`/cart/${user.id}`).subscribe({next:c=>this.items.set(this.fromApi(c)),error:()=>this.items.set([])})}else{this.items.set([])}})}
 add(product:Product){const user=this.auth.user();if(!user)return;const ex=this.items().find(i=>i.product.id===product.id);if(ex){this.http.patch<ApiCart>(`/cart/${user.id}/items/${product.id}`,{quantity:ex.qty+1}).subscribe(c=>this.items.set(this.fromApi(c)))}else{this.http.post<ApiCart>(`/cart/${user.id}/items`,{product_id:product.id,name:product.title,price:product.price,quantity:1}).subscribe(c=>this.items.set(this.fromApi(c)))}}
 dec(id:string){const user=this.auth.user();if(!user)return;const item=this.items().find(i=>i.product.id===id);if(!item)return;if(item.qty<=1){this.remove(id)}else{this.http.patch<ApiCart>(`/cart/${user.id}/items/${id}`,{quantity:item.qty-1}).subscribe(c=>this.items.set(this.fromApi(c)))}}
 remove(id:string){const user=this.auth.user();if(!user)return;this.http.delete<ApiCart>(`/cart/${user.id}/items/${id}`).subscribe(c=>this.items.set(this.fromApi(c)))}
 clear(){this.items.set([]);const user=this.auth.user();if(user)this.http.delete(`/cart/${user.id}`).subscribe({error:()=>{}})}
 qty(id:string){return this.items().find(i=>i.product.id===id)?.qty??0}
 private fromApi(cart:ApiCart):CartItem[]{return Object.values(cart.items).map(i=>({product:{id:i.product_id,title:i.name,brand:'',price:i.price,rating:0,reviews:0,image:`https://picsum.photos/seed/${i.product_id}/600/600`,category:'',inStock:true,description:'',attributes:{}},qty:i.quantity}))}
}

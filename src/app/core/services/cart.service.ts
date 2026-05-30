import { Injectable, computed, effect, inject, signal } from '@angular/core';import { HttpClient } from '@angular/common/http';import { CartItem, Product } from '../models';import { AuthService } from './auth.service';
interface ApiItem{product_id:string;name:string;price:number;quantity:number}
interface ApiCart{user_id:string;items:Record<string,ApiItem>;updated_at:string}
@Injectable({providedIn:'root'}) export class CartService{
 private http=inject(HttpClient);private auth=inject(AuthService);
 private guestId=this.auth.guestUserId;
 items=signal<CartItem[]>([]);
 totalQty=computed(()=>this.items().reduce((s,i)=>s+i.qty,0));
 total=computed(()=>this.items().reduce((s,i)=>s+i.qty*i.product.price,0));
 constructor(){effect(()=>{const user=this.auth.user();const guestId=this.guestId();const cartUserId=user?.id??guestId;if(cartUserId){this.http.get<ApiCart>(`/cart/${cartUserId}`).subscribe({next:c=>this.items.set(this.fromApi(c)),error:()=>this.items.set([])})}else{this.items.set([])}})}
 add(product:Product){const user=this.auth.user();const guestId=this.guestId();const cartUserId=user?.id??guestId;if(!cartUserId)return;const ex=this.items().find(i=>i.product.id===product.id);if(ex){this.http.patch<ApiCart>(`/cart/${cartUserId}/items/${product.id}`,{quantity:ex.qty+1}).subscribe({next:c=>this.items.set(this.fromApi(c)),error:e=>console.error('cart patch error',e)})}else{this.http.post<ApiCart>(`/cart/${cartUserId}/items`,{product_id:product.id,name:product.title,price:product.price,quantity:1}).subscribe({next:c=>this.items.set(this.fromApi(c)),error:e=>console.error('cart add error',e)})}}
 dec(id:string){const cartUserId=this.auth.user()?.id??this.guestId();if(!cartUserId)return;const item=this.items().find(i=>i.product.id===id);if(!item)return;if(item.qty<=1){this.remove(id)}else{this.http.patch<ApiCart>(`/cart/${cartUserId}/items/${id}`,{quantity:item.qty-1}).subscribe({next:c=>this.items.set(this.fromApi(c)),error:e=>console.error('cart dec error',e)})}}
 remove(id:string){const cartUserId=this.auth.user()?.id??this.guestId();if(!cartUserId)return;this.http.delete<ApiCart>(`/cart/${cartUserId}/items/${id}`).subscribe({next:c=>this.items.set(this.fromApi(c)),error:e=>console.error('cart remove error',e)})}
 clear(){this.items.set([]);const cartUserId=this.auth.user()?.id??this.guestId();if(cartUserId)this.http.delete(`/cart/${cartUserId}`).subscribe({error:()=>{}})}
 qty(id:string){return this.items().find(i=>i.product.id===id)?.qty??0}
 private fromApi(cart:ApiCart):CartItem[]{return Object.values(cart.items).map(i=>({product:{id:i.product_id,title:i.name,brand:'',price:i.price,rating:0,reviews:0,image:`https://picsum.photos/seed/${i.product_id}/600/600`,category:'',inStock:true,description:'',attributes:{}},qty:i.quantity}))}
}

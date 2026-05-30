import { Injectable, inject, signal } from '@angular/core';import { HttpClient } from '@angular/common/http';import { Observable, map, tap } from 'rxjs';import { Order } from '../models';
interface ApiOrderItem{product_id:string;name:string;price:number;quantity:number;subtotal:number}
interface ApiOrder{id:string;user_id:string;status:string;items:ApiOrderItem[];total_amount:number;delivery_address:{city:string;street:string;zip:string};payment_method:string;created_at:string;updated_at:string}
interface ListResponse{items:ApiOrder[];total:number;page:number;page_size:number;total_pages:number}
@Injectable({providedIn:'root'}) export class OrdersService{
 private http=inject(HttpClient);
 orders=signal<Order[]>([]);
 private toOrder=(o:ApiOrder):Order=>({id:o.id,createdAt:o.created_at,status:o.status as Order['status'],items:o.items.map(i=>({product:{id:i.product_id,title:i.name,brand:'',price:i.price,rating:0,reviews:0,image:`https://picsum.photos/seed/${i.product_id}/600/600`,category:'',inStock:true,description:'',attributes:{}},qty:i.quantity})),address:o.delivery_address,total:o.total_amount});
 load():Observable<Order[]>{return this.http.get<ListResponse>('/orders').pipe(map(r=>r.items.map(o=>this.toOrder(o))),tap(list=>this.orders.set(list)))}
 create(address:Order['address'],paymentMethod:string):Observable<Order>{return this.http.post<ApiOrder>('/orders',{delivery_address:address,payment_method:paymentMethod}).pipe(map(o=>this.toOrder(o)),tap(order=>this.orders.update(list=>[order,...list])))}
 get(id:string):Observable<Order>{return this.http.get<ApiOrder>(`/orders/${id}`).pipe(map(o=>this.toOrder(o)))}
 cancel(id:string):Observable<Order>{return this.http.post<ApiOrder>(`/orders/${id}/cancel`,{}).pipe(map(o=>this.toOrder(o)),tap(updated=>this.orders.update(list=>list.map(o=>o.id===id?updated:o))))}}

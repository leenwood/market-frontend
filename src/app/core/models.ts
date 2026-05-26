export interface Category{ id:string; name:string }
export interface Product{ id:string; title:string; brand:string; price:number; rating:number; reviews:number; image:string; category:string; inStock:boolean; description:string; attributes:Record<string,string> }
export interface CartItem{ product:Product; qty:number }
export interface User{ id:string; name:string; email:string }
export type OrderStatus='pending'|'confirmed'|'shipped'|'delivered'|'cancelled';
export interface Order{ id:string; createdAt:string; status:OrderStatus; items:CartItem[]; address:{city:string;street:string;zip:string}; total:number }

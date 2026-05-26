import { Injectable } from '@angular/core';import { delay, map, of } from 'rxjs';import { categories, products } from '../data/mock-data';
@Injectable({providedIn:'root'}) export class CatalogService{
 getCategories(){return of(categories).pipe(delay(150))}
 getProducts(page=1,category='all'){const pageSize=12;return of(products).pipe(map(list=>category==='all'?list:list.filter(p=>p.category===category)),map(list=>({items:list.slice((page-1)*pageSize,page*pageSize),hasMore:page*pageSize<list.length})),delay(250))}
 getProduct(id:string){return of(products.find(p=>p.id===id)??null).pipe(delay(150))}
 search(q='',filters:{category?:string;brand?:string;min?:number;max?:number;inStock?:boolean;sort?:string}){return of(products).pipe(map(list=>list.filter(p=>(!q||p.title.toLowerCase().includes(q.toLowerCase())||p.brand.toLowerCase().includes(q.toLowerCase()))&&(!filters.category||filters.category==='all'||p.category===filters.category)&&(!filters.brand||p.brand===filters.brand)&&(!filters.min||p.price>=filters.min)&&(!filters.max||p.price<=filters.max)&&(!filters.inStock||p.inStock))),map(list=>filters.sort==='price'?list.sort((a,b)=>a.price-b.price):filters.sort==='popular'?list.sort((a,b)=>b.reviews-a.reviews):list),delay(250))}
 autocomplete(q:string){return of(products.filter(p=>p.title.toLowerCase().includes(q.toLowerCase())).slice(0,5).map(p=>p.title)).pipe(delay(100))}
}

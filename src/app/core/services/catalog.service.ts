import { Injectable, inject } from '@angular/core';import { HttpClient } from '@angular/common/http';import { Observable, map } from 'rxjs';import { Category, Product } from '../models';
interface ApiProduct{id:string;name:string;brand:string;price:number;rating:number;rating_count:number;category_id:string;in_stock:boolean;description:string;attributes:Record<string,any>}
interface ApiCategory{id:string;name:string;slug:string;children?:ApiCategory[]}
interface ApiWrapped<T>{data:T}
interface ProductListData{items:ApiProduct[];total:number;page:number;page_size:number;total_pages:number}
interface SearchData{items:ApiProduct[];total:number;page:number;page_size:number;total_pages:number}
interface AutocompleteData{suggestions:string[]}
@Injectable({providedIn:'root'}) export class CatalogService{
 private http=inject(HttpClient);
 private toProduct=(p:ApiProduct):Product=>({id:p.id,title:p.name,brand:p.brand,price:p.price,rating:p.rating,reviews:p.rating_count,image:`https://picsum.photos/seed/${p.id}/600/600`,category:p.category_id,inStock:p.in_stock,description:p.description,attributes:p.attributes as Record<string,string>});
 getCategories():Observable<Category[]>{return this.http.get<ApiWrapped<ApiCategory[]>>('/categories').pipe(map(r=>[{id:'all',name:'Все'},...r.data.map(c=>({id:c.id,name:c.name}))]))}
 getProducts(page=1,category='all',pageSize=12):Observable<{items:Product[];hasMore:boolean}>{
  const params:Record<string,string>={page:String(page),page_size:String(pageSize)};
  if(category!=='all')params['category_id']=category;
  return this.http.get<ApiWrapped<ProductListData>>('/products',{params}).pipe(map(r=>({items:r.data.items.map(p=>this.toProduct(p)),hasMore:r.data.page<r.data.total_pages})))}
 getProduct(id:string):Observable<Product|null>{return this.http.get<ApiWrapped<ApiProduct>>(`/products/${id}`).pipe(map(r=>this.toProduct(r.data)))}
 search(q='',filters:{category?:string;brand?:string;min?:number;max?:number;inStock?:boolean;sort?:string}):Observable<Product[]>{
  const params:Record<string,string>={};
  if(q)params['q']=q;
  if(filters.category&&filters.category!=='all')params['category_id']=filters.category;
  if(filters.brand)params['brand']=filters.brand;
  if(filters.min!=null)params['min_price']=String(filters.min);
  if(filters.max!=null)params['max_price']=String(filters.max);
  if(filters.inStock)params['in_stock']='true';
  if(filters.sort==='price'){params['sort_by']='price';params['sort_dir']='asc'}
  else if(filters.sort==='popular'){params['sort_by']='popularity';params['sort_dir']='desc'}
  return this.http.get<ApiWrapped<SearchData>>('/search',{params}).pipe(map(r=>r.data.items.map(p=>this.toProduct(p))))}
 autocomplete(q:string):Observable<string[]>{return this.http.get<ApiWrapped<AutocompleteData>>('/search/autocomplete',{params:{q}}).pipe(map(r=>r.data.suggestions??[]))}}

import { HttpInterceptorFn } from '@angular/common/http';import { environment } from '../../../environments/environment';
export const apiInterceptor:HttpInterceptorFn=(req,next)=>{const isApi=req.url.startsWith('/');const url=isApi?`${environment.apiUrl}${req.url}`:req.url;return next(req.clone({url,setHeaders:{'Content-Type':'application/json'}}))};

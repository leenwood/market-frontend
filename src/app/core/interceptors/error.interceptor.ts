import { HttpInterceptorFn } from '@angular/common/http';import { catchError, throwError } from 'rxjs';
export const errorInterceptor:HttpInterceptorFn=(req,next)=>next(req).pipe(catchError(err=>{console.error('API error',err);return throwError(()=>err)}));

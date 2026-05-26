# Marketplace Angular MVP

MVP веб-приложения маркетплейса по ТЗ: Angular 17+, standalone-компоненты, lazy routes, Tailwind CSS, Angular Signals, RxJS.

## Что реализовано

- `/` каталог с категориями, карточками и бесконечным скроллом.
- `/search` поиск, автодополнение, фильтры, сортировка.
- `/products/:id` карточка товара.
- `/cart` корзина: добавление, удаление, изменение количества.
- `/checkout` оформление заказа, требует авторизации.
- `/orders`, `/orders/:id` история и детали заказов.
- `/auth/login`, `/auth/register` мок-авторизация.
- `CartService` и `AuthService` на Angular Signals.
- Interceptors: `ApiInterceptor`, `AuthInterceptor`, `ErrorInterceptor`.
- Мок-данные вместо реального backend API, чтобы MVP запускался автономно.

## Запуск

```bash
npm install
npm start
```

Открыть: `http://localhost:4200`

## Примечание

Это frontend MVP. Для подключения реального backend нужно заменить `CatalogService`, `OrdersService`, `AuthService` на вызовы `HttpClient` к API из `environment.apiUrl`.

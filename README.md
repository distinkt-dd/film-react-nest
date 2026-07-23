# FILM!

## Установка

### PostgreSQL

Установите PostgreSQL скачав дистрибутив с официального сайта или используйте Docker.

Заполните необходимые параметры БД и пользователя в файле `docker-compose.yml` и запустите контейнер.

```
docker-compose up -d
```

Восстановите тестовые данные из дампов, выполнив команды из корня проекта:

```
docker exec -i postgres_container psql -U postgres -d films < backend/test/prac.init.sql
docker exec -i postgres_container psql -U postgres -d films < backend/test/prac.films.sql
docker exec -i postgres_container psql -U postgres -d films < backend/test/prac.shedules.sql
```

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

- `APP_PORT` - порт работы бекенда, например `3000`
- `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `postgres`
- `DATABASE_URL` - адрес СУБД PostgreSQL, например `postgres://127.0.0.1:5432/films`
- `DATABASE_USERNAME` - имя пользователя БД
- `DATABASE_PASSWORD` - пароль пользователя БД
- `CORS_ORIGIN` - домены, которые могут отправлять запросы к бекенду, например `http://localhost:5173`
- `CORS_METHODS` - http методы, к которым могут делать клиенты, перечисленные в CORS_ORIGIN - `GET,HEAD,PUT,PATCH,POST,DELETE`
- `CORS_CREDENTIALS` - если фронтенд не требует cockie/авторизации то `false`, иначе `true`, дефолт - false
- `DEBUG` - \*, включает дебаг при запуске проекта

PostgreSQL должна быть установлена и запущена.

Запустите бэкенд:

`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.
Файлы с тестовыми запросами находяться по пути `./backend/test/***.sql`

### Задеплоенное приложение

https://films-project.nomorepartiessite.ru/

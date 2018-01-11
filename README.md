# Gulp HTML

## Команды

```bash
npm install // установка плагинов
bower install // установка зависимостей

npm run build // разработка
npm run build --prod // продакшен
```

## Структура папок

* dist // продакшен
    * assets  
        * css  
        * fonts  
        * images  
        * js
    * *.html  
* src
    * assets  
        * css  
        * fonts  
        * images  
        * js  
    * blocks
    * favicons
    * html
        * includes
        * layouts
        * pages
    * libs  
    * *.html
* .bowerrc
* bower.json
* gulpfile.js
* package.json

---

* __dist__  
Продакшен  
* __src__  
Исходные материалы проекта, вся работа ведется здесь  
* __src/assets__  
Все необходимое для работы сайта собирается сюда, кроме HTML.
* __src/blocks__  
SASS и JS
* __favicons__  
Все для генерации favicons
* __html__  
Шаблоны для генерации HTML. Готовый HTML падает в корень папки `src`.
* __libs__  
Все используемые библиотеки, например, jQuery, Bootstrap и пр.

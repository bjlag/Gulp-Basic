# Gulp HTML

## Команды

### Старт

Установка плагинов Gulp
```bash
npm install
```

Установка библиотек
```bash
bower install 
```

### Development

```bash
npm run build
```
Запускается задача build в режиме __development__. 

Поднимается сервер с `browser-sync`. JS и CSS не минифицируются, комментарии не удаляются, строится sourcemap.

### Production

```bash
npm run build --prod
```
Запускается задача build в режиме __productions__. 

Все файлы сайта переносятся в папку `dist`. JS и CSS минифицируются, комментарии и sourcemap удаляются, изображения сжимаются. 

## Структура папок

* dist
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
Продакшен.
* __src__  
Исходные материалы проекта, вся работа ведется здесь.
* __src/assets__  
Все необходимое для работы сайта собирается сюда, кроме HTML.
* __src/blocks__  
SASS и JS.
* __src/favicons__  
Все для генерации favicons.
* __src/html__  
Шаблоны для генерации HTML. Готовый HTML падает в корень папки `src`.
* __src/html/includes__  
Повторно используемые блоки. Например, head, header, footer.
* __src/html/layouts__  
На будущее. Шаблоны страниц.
* __src/html/pages__  
Сами страницы, которые верстаются.
* __src/libs__  
Все используемые библиотеки, например, jQuery, Bootstrap и пр.

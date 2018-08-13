# Basic Web Dev

Базовое окружение для разработки веб-приложения.

## Описание

### Состав
* Gulp 4
* Docker (Nginx, PHP, MySQL, sSMTP, Xdebug, phpMyAdmin)
* jQuery 3
* Bootstrap 4
* Font Awesome Free
* Composer
* PHPUnit
* Mocha, Chai, Sinon, Karma

### Возможности
* Автоперезагрузка браузера.
* Препроцессор SASS.
* Автоматическая подстановка вендорных префиксов.
* Минификация JS и CSS.
* Генератор favicons, CSS-спрайта.
* Оптимизация изображений.
* Docker для работы с back-end.
* Тестирование.

## Структура окружения

```
web-dev-basic/
├── dist/                           # Продакшен. Команда gulp prod.
│   ├── css/  
│   ├── fonts/  
│   ├── images/  
│   ├── js/
│   └── *.html
├── docker/                         # Конфигурация контейнеров.  
├── gulp/                           # Скрипты для Gulp.
│   ├── paths.js                    # Конфиг.
│   └── tasks.js                    # Задачи.
├── src/                            # Все ресурсы приложения.
│   ├── assets/                     # Готовые HTML, CSS, JS, шрифты, картинки.
│   │   ├── css/  
│   │   ├── fonts/  
│   │   ├── engine/                 # PHP  
│   │   ├── images/  
│   │   ├── js/
│   │   └── *.html                  
│   ├── favicons/                   # Ресурсы для генерации favicons.
│   │   ├── icons/                  # Иконки после генерации.
│   │   └── favicon-master.png      # Донор, из которого генерятся иконки.
│   ├── html/                       # HTML приложения.
│   │   ├── includes/               # Типовые блоки, которые подключаются в pages.
│   │   └── pages/                  # Верстаемые страницы.
│   ├── js/                         # JavaScript приложения.
│   │   ├── _main.js                # Инициализация приложения.
│   │   └── *.js                    
│   ├── sass/                       # SASS.
│   │   ├── block-one/              # Блок.
│   │   │   ├── block-one-1.sass
│   │   │   └── block-one-2.sass
│   │   ├── block-two/
│   │   ├── _base.sass              # Базовые стили, которые должны быть в самом верху.
│   │   ├── _fonts.scss             # Импорт шрифтов.
│   │   ├── _var.scss               # Определяем переменные.
│   │   └── main.sass               # Главный SASS. Импортирует в себя другие блоки.
│   ├── sass_vendor/                # SASS внешних библиотек.
│   │   ├── bootstrap/             
│   │   └── fontawesome/
│   └── sprite/                     # CSS-спрайт.
│       ├── icons/                  # Иконки, из которых создается спрайт.         
│       ├── templates/              # Шаблоны для генерации стилевых таблиц.
│       ├── sprite.png              # Готовый спрайт.
│       └── sprite.sass             # Готовые стили.
├── tests/                          # Тесты.
│   ├── backend/
│   └── frontend/
├── composer.json
├── docker-compose.yml
├── gulpfile.js
├── karma.conf.js
├── package.json
└── phpunit.xml
```

## Установка

1. Глобальная установка Gulp:
    ```
    $ npm install --global gulp-cli
    ```

2. Установка зависимостей из файла _package.json_:
    ```
    $ npm install
    ```
    
3. Установка зависимостей из файла _composer.json_
    ```
    $ composer install
    ```

## Настройка окружения

Все пути до необходимых ресурсов приложения указываются в файле _./gulp/paths.js_.

Что может потребоваться:
* `path.js.vendor` - подключить дополнительные вендорные скрипты.

Задачи пишутся в файле _./gulp/tasks.js_, после подключаются в файле _./gulpfile.js_:

## Разработка

Вводим команду:
```
$ gulp build
```

* Поднимется browser-sync.
* Будут отслеживаться изменения в HTML, SASS и JS.
* У CSS и JS будет строиться sourcemap.
* CSS и JS создаются в минифицированном и несжатом виде.

### Процесс

* Верстаемые страницы создаются в папке _./src/html/pages_. 
* Повторяемые блоки можно перенести в _./src/html/includes_ и подключать при необходимости конструкцией:

    ```
    @@include( '../includes/footer.html' )
    ```
    Возможны более сложные конструкции, подробнее https://github.com/coderhaoxin/gulp-file-include.
    
* После сборки готовый HTML кладется в корень папки _./src/assets_.
* CSS пишется на SASS в папке _./src/sass_.
* Вендорный SASS хранится в папке _./src/sass_vendor_.

### Особенности

* После обработки SASS готовый CSS кладется в папку _./src/assets/css_.
* После обработки JS готовые скрипты кладутся в папку _./src/assets/js_.
* Используемые изображения размещать в папке _./src/assets/images_.
* Используемые шрифты размещать в папке _./src/assets/fonts_.
* CSS и JS создаются в минифицированном и несжатом виде. 
* Файлы _main.css_ и _main.min.css_ содержат основные стили. 
* Файлы _vendor.css_ и _vendor.min.css_ содержат вендорные стили. 
* Файлы _main.js_ и _main.min.js_ содержат основные скрипты. 
* Файлы _vendor.js_ и _vendor.min.js_ содержат вендорные скрипты. 
* В HTML, по умолчанию, подключаются минифицированные версии CSS и JS. 
* У минифицированных версий CSS и JS создаются sourcemap.

## Продакшен

Вводим команду:
```
$ gulp prod
```

* Готовый HTML скопируется в корень папки _./dist_.
* У сгенерированного CSS и JS не строятся sourcemap.
* Все изображения из папки _./src/assets/images_ оптимизируются и переносятся в _./dist/images_. Исходные файлы в _./src/assets/images_ не меняются.
* Все шрифты, JS, CSS генерятся в папку _./dist_. 
* CSS и JS создаются в минифицированном и несжатом виде.

Для ускорения повторной оптимизации изображений, результат предыдущей оптимизации кешируется. Чтобы очистить кеш, выполните команду:
```
$ gulp clean:cache
```

## Генерация favicons

1. Подготовьте донора (мастер изображение), из которого будут создаваться иконки, и положите донора в папку _./src/favicons_ с именем _favicon-master.png_.
2. В задаче `favicons` укажите необходимые настройки, например, какие иконки надо создать (`ключ icons`).
3. Выполните команду:
    ```
    $ gulp favicons
    ```
    
В результате:
1. Создадутся иконки, которые будут скопированны в папку _./src/assets/images/favicons_.
2. В папке _./src/html/includes_ создастся файл _favicons.html_, который подключается в _./src/html/includes/head.html_. Данный файл будет содержать HTML код примерно такого вида:
    ```html
    <link rel="icon" type="image/png" sizes="32x32" href="images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="images/favicons/favicon-16x16.png">
    <link rel="shortcut icon" href="images/favicons/favicon.ico">
    ```
    
**Для удаления иконок выполните команду:**
```
$ gulp clean:favicons
```

Задача `clean:favicons` всегда выполняется перед задачей `favicons`.

## Генерация CCS-спрайта

1. Положить иконки, для которых надо сгенерировать спрайт, в папку _./src/sprite/icons_.
2. Запустить задачу `sprite`.
3. В корне папки _./src/sprite_ появятся два файла: 
    * sprite.png - иконки
    * sprite.sass - переменные и миксины для генерации иконок
4. В файле _./src/sass/_sp.sass_ подключен миксин для генерации стилей.

Задача `sprite:copy` копирует sprite.png в _./src/assets/images_.  
Задача `clean:sprite` удаляет **все файлы**, которые находятся **только в корне** _./src/sprite_. Вложенные папки не затрагиваются.

Имя файла иконки подставляется в название класса.  
alarm.png -> sp--alarm

В результате получится один базовый класс:
```css
.sp {
    display: inline-block;
    background-image: url(../images/sprite.png);
}
```

И классы отдельных иконок:
```css
.sp--alarm {
    background-position: -225px -106px;
    width: 60px;
    height: 60px;
}
```

Использование:
```html
<div class="sp sp--alarm"></div>
```

## Полезные Gulp задачи

```
$ gulp build                # Разработка приложения
$ gulp prod                 # Продакшен приложения
$ gulp clean:dist           # Удаление папки dist
$ gulp clean:cache          # Очистка кеша
$ gulp clean:favicons       # Удаление сгенерированных favicons
$ gulp clean:sprite         # Удаление сгенерированного спрайта
$ gulp images               # Оптимизация изображений
$ gulp html                 # Соборка HTML
$ gulp css:main             # Собрка сновных стилей
$ gulp css:vendor           # Сборка вендорных стилей
$ gulp js:main              # Сборка основных скриптов
$ gulp js:vendor            # Сборка вендорных скриптов
$ gulp fonts                # Копирование вендорных шрифтов
$ gulp favicons             # Генерация favicons
$ gulp sprite               # Генерация спрайта
$ gulp sprite:copy          # Копирование спрайта в assets/images
```

## Пакеты Gulp

### gulp  
Gulp  
https://github.com/gulpjs/gulp  
```
$ npm i --save-dev gulp
```

### gulp-plumber  
В случае ошибки работа Gulp не прирывается. Выводится информация об ошибке.  
https://github.com/floatdrop/gulp-plumber
```
$ npm i --save-dev gulp-plumber
```

### del  
Удаление файлов  
https://github.com/sindresorhus/del
```
$ npm i --save-dev del
```
    
### gulp-rename  
Переименовывание файлов  
https://github.com/hparra/gulp-rename
```
$ npm i --save-dev gulp-rename 
```

### gulp-sass  
Препроцессор SASS  
https://github.com/dlmanning/gulp-sass
```
$ npm i --save-dev gulp-sass  
```

### gulp-sass-glob  
Нужен для корректной обработки @import вида `'./**/*'`  
https://github.com/mikevercoelen/gulp-sass-glob
```
$ npm i --save-dev gulp-sass-glob
```

### gulp-concat  
Объединение файлов  
https://github.com/gulp-community/gulp-concat
```
$ npm i --save-dev gulp-concat
```

### gulp-autoprefixer  
Добавление вендорных префиксов в CSS  
https://github.com/sindresorhus/gulp-autoprefixer
```
$ npm i --save-dev gulp-autoprefixer
```

### gulp-sourcemaps  
Постороение Sourcemaps  
https://github.com/gulp-sourcemaps/gulp-sourcemaps
```
$ npm i --save-dev gulp-sourcemaps
```

### gulp-file-include  
Подключение файлов  
https://github.com/coderhaoxin/gulp-file-include
```
$ npm i --save-dev gulp-file-include
```

### gulp-favicons  
Генерация Favicons  
https://github.com/itgalaxy/favicons
```
$ npm i --save-dev gulp-favicons
```

### gulp-group-css-media-queries  
Группировка медиа запросов CSS  
https://github.com/avaly/gulp-group-css-media-queries
```
$ npm i --save-dev gulp-group-css-media-queries
```

### browser-sync  
Автоперезагрузка страницы в браузере при изменениях отслеживаемых файлов  
https://browsersync.io/
```
$ npm i --save-dev browser-sync
```

### gulp-if  
Для запуска плагинов при определенных условиях приямо в потоке  
https://github.com/robrich/gulp-if
```
$ npm i --save-dev gulp-if
```

### gulp-html-beautify  
Форматирование HTML файлов  
https://github.com/arsen/gulp-html-beautify
```
$ npm i --save-dev gulp-html-beautify
```

### gulp-clean-css  
Оптимизация CSS  
https://github.com/scniro/gulp-clean-css
```
$ npm i --save-dev gulp-clean-css
```

### gulp-uglify  
Оптимизация JS  
https://github.com/terinjokes/gulp-uglify
```
$ npm i --save-dev gulp-uglify
```

### gulp-imagemin  
Оптимизация изображений  
https://github.com/sindresorhus/gulp-imagemin
```
$ npm i --save-dev gulp-imagemin
```

### imagemin-jpeg-recompress  
Плагин для gulp-imagemin  
https://github.com/imagemin/imagemin-jpeg-recompress
```
$ npm i --save-dev imagemin-jpeg-recompress
```

### imagemin-pngquant  
Оптимизация изображений  
https://github.com/imagemin/imagemin-pngquant
```
$ npm i --save-dev imagemin-pngquant
```

### gulp.spritesmith
Генератор CSS-спрайта
https://github.com/twolfson/gulp.spritesmith
```
$ npm i --save-dev gulp.spritesmith
```
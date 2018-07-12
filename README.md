# Gulp Basic

Базовое окружение для разработки front-end.

* Gulp 4
* SASS
* Autoprefixer
* Минификатор JS, CSS
* Оптимизатор изображений
* Генератор favicons
* Browsersync
* Bootstrap 4
* jQuery 
* Popper.js 
* Font Awesome Free

## Структура окружения

```
gulp-basic/
├── dist/                           # Продакшен. Команда gulp prod.
│   ├── css/  
│   ├── fonts/  
│   ├── images/  
│   ├── js/
│   └── *.html  
├── src/                            # Все ресурсы приложения.
│   ├── assets/                     # Готовые HTML, CSS, JS, шрифты, картинки.
│   │   ├── css/  
│   │   ├── fonts/  
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
│   │   ├── _glob_vars.js           # Объявление глобальной переменной app.
│   │   ├── _main.js                # Инициализация приложения.
│   │   └── *.js                    
│   ├── sass/                     # SASS.
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
├── gulpfile.js
├── package.json
└── package-lock.json
```

## Установка

1. Глобальная установка Gulp:
    ```bash
    $ npm install --global gulp-cli
    ```

2. Установка зависимостей из файла `package.json`:
    ```bash
    $ npm install
    ```

## Настройка окружения

Все пути до необходимых ресурсов приложения указываются в файле `./gulp/paths.js`.

Что может потребоваться:
* `path.fonts.vendor` - подключить дополнительные вендорные шрифты.
* `path.js.vendor` - подключить дополнительные вендорные скрипты.

Задачи пишутся в файле `./gulp/tasks.js`, после подключаются в файле `./gulpfile.js`:

## Разработка

Вводим команду:
```bash
$ gulp build
```

* Поднимется `browser-sync`.
* Будут отслеживаться изменения в HTML, SASS и JS.
* У CSS и JS будет строиться sourcemap.
* CSS и JS создаются в минифицированном и несжатом виде.

### Процесс

* Верстаемые страницы создаются в папке `./src/html/pages`. 
* Повторяемые блоки можно перенести в `./src/html/includes` и подключать при необходимости конструкцией:
    ```
    @@include( '../includes/footer.html' )
    ```
    Возможны более сложные конструкции, подробнее https://github.com/coderhaoxin/gulp-file-include.
* После сборки готовый HTML кладется в корень папки `./src/assets`.
* CSS пишется на SASS в папке `./src/sass`.
* Вендорный SASS хранится в папке `./src/sass_vendor`.

### Особенности

* После обработки SASS готовый CSS кладется в папку `./src/assets/css`.
* После обработки JS готовые скрипты кладутся в папку `./src/assets/js`.
* Используемые изображения размещать в папке `./src/assets/images`.
* Используемые шрифты размещать в папке `./src/assets/fonts`.
* CSS и JS создаются в минифицированном и несжатом виде. 
* Файлы `main.css и main.min.css` содержат основные стили. 
* Файлы `vendor.css и vendor.min.css` содержат вендорные стили. 
* Файлы `main.js и main.min.js` содержат основные скрипты. 
* Файлы `vendor.js и vendor.min.js` содержат вендорные скрипты. 
* В HTML, по умолчанию, подключаются минифицированные версии CSS и JS. 
* У минифицированных версий CSS и JS создаются sourcemap.

## Продакшен

Вводим команду:
```bash
$ gulp prod
```

* Готовый HTML скопируется в корень папки `./dist`.
* У сгенерированного CSS и JS не строится sourcemap.
* Все изображения из папки `./src/assets/images` оптимизируются и переносятся в `./dist/images`. Исходные файлы в `./src/assets/images` не меняются.
* Все шрифты, JS, CSS генерятся в папку `./dist`. 
* CSS и JS создаются в минифицированном и несжатом виде.

Для ускорения повторной оптимизации изображений, результат предыдущей оптимизации кешируется. Чтобы очистить кеш, выполните команду:
```bash
$ gulp clean:cache
```

## Генерация favicons

1. Подготовьте донора (мастер изображение), из которого будут создаваться иконки, и положите донора в папку `./src/favicons` с именем `favicon-master.png`.
2. В задаче `favicon:generate` укажите необходимые настройки, например, какие иконки надо создать (`ключ icons`).
3. Выполните команду:
    ```bash
    $ gulp favicons:generate
    ```
    
В результате:
1. Создадутся иконки, которые будут скопированны в папку `./src/assets/images/favicons`.
2. В папке `./src/html/includes` создастся файл `favicons.html`, который подключается в `./src/html/includes/head.html`. Данный файл будет содержать HTML код примерно такого вида:
    ```html
    <link rel="icon" type="image/png" sizes="32x32" href="images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="images/favicons/favicon-16x16.png">
    <link rel="shortcut icon" href="images/favicons/favicon.ico">
    ```
    
**Для удаления иконок выполните команду:**
```bash
$ gulp clean:favicons
```

Задача `clean:favicons` всегда выполняется перед задачей `favicons:generate`.

## Полезные задачи

```bash
$ gulp build                # Разработка приложения
$ gulp prod                 # Продакшен приложения
$ gulp clean:dist           # Удаление папки dist
$ gulp clean:cache          # Очистка кеша
$ clean:favicons            # Удаление сгенерированных favicons
$ gulp images               # Оптимизация изображений
$ gulp html                 # Соборка HTML
$ gulp css:main             # Собрка сновных стилей
$ gulp css:vendor           # Сборка вендорных стилей
$ gulp js:main              # Сборка основных скриптов
$ gulp js:vendor            # Сборка вендорных скриптов
$ gulp fonts                # Копирование вендорных шрифтов
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
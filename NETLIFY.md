# Neapol Lake — ВАРІАНТ 2: Netlify

Цей варіант працює на Netlify: сторінки — статичні файли, а бронювання, оплата Monobank, вхід адміна, новини й додані фото обробляє **Netlify Function** (`netlify/functions/api.mjs`), дані лежать у **Netlify Blobs**.

> Не перетягуйте папку на Netlify Drop: перетягування не підходить, бо потрібно зібрати функцію з пакетом. Використовуйте GitHub (шлях А) або Netlify CLI (шлях Б).

> 📷 Візуальна інструкція «токен і пароль адміна» зі схемами й командами — у файлі **NETLIFY-GUIDE.html** (відкрийте в браузері).

## Структура
```
neapol-lake-netlify/
├── netlify.toml                публікація з public/, функції з netlify/functions
├── package.json                залежність @netlify/blobs
├── netlify/functions/api.mjs   весь серверний код (бронювання, оплата, вебхук, адмін)
└── public/                     сайт: index.html, images/, manifest, sw.js
```

## Шлях А (рекомендований): через GitHub
1. Створіть акаунт на github.com і новий репозиторій (Private).
2. Розпакуйте zip. У репозиторії натисніть «Add file → Upload files» і перетягніть **вміст** папки `neapol-lake-netlify`: `netlify.toml`, `package.json`, папки `netlify` і `public` (папка `node_modules`, якщо з'явиться, не потрібна). Файли `netlify.toml` і `package.json` мають лежати в корені репозиторію.
3. Netlify → **Add new site → Import an existing project → GitHub** → оберіть репозиторій. Налаштування збірки підтягнуться з `netlify.toml` (Publish directory: `public`, команда збірки не потрібна). Натисніть Deploy.
4. **Site configuration → Environment variables** додайте:
   - `ADMIN_PASSWORD` — пароль адміна (🔑 внизу сайту);
   - `MONO_TOKEN` — ваш токен еквайрингу Monobank;
   - `BASE_URL` — `https://neapollake.site` (до підключення домену залишіть порожнім, тоді береться адреса `*.netlify.app`).
5. **Deploys → Trigger deploy → Deploy site** (зміна змінних діє після нового деплою).

## Шлях Б: Netlify CLI
```
npm install
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```
Змінні середовища додайте так само, як у кроці 4.

## Підключення домену neapollake.site
1. Netlify → **Domain management → Add a domain** → `neapollake.site`.
2. Netlify покаже, які DNS-записи створити. У кабінеті HOSTiQ (Домени → ваш домен → керування DNS) створіть саме ті записи, які покаже Netlify. Старі записи A/AAAA для цих імен видаліть.
3. Після оновлення DNS Netlify сам випустить https-сертифікат. Поставте `BASE_URL=https://neapollake.site` і перезапустіть деплой.

## Перевірка
1. Відкрийте сайт, натисніть 🔑, увійдіть. Додайте новину й ціну.
2. Зробіть тестове бронювання: вас має перекинути на сторінку оплати Monobank. Сплатіть малу суму.
3. Після оплати бронь стає «✅» в адмінці, а дата — червоною в календарі.
4. Повернення тестової суми робиться вручну в кабінеті Monobank.

## Пароль адміна не підходить?
На Netlify пароль не лежить у файлах, його треба задати змінною `ADMIN_PASSWORD` (Site configuration → Environment variables), а потім зробити **Deploys → Trigger deploy**.
Перевірка: відкрийте `https://ваш-сайт/api/health`:
- `"adminPassword": false` — змінної немає (або вона не діє для Functions): додайте/виправте й перезапустіть деплой;
- сторінка 404 — функція не розгорнулась (див. «Шлях А», кроки 2–3).
Значення вводьте без пробілів і лапок: `neapollake_2026` (або свій пароль).

## Обмеження
- Один запит до функції — до 6 МБ, тому фото в адмінці краще додавати по кілька штук за раз.
- Ліміти безкоштовного тарифу Netlify дивіться на netlify.com/pricing.
- Якщо щось не працює: Netlify → **Logs → Functions → api**.

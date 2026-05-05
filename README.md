# Portfolio Landing (GitHub Pages)

Портфоліо **Бабійчук Володимир Миколайович** (статичний сайт: HTML/CSS/JS), готове до безкоштовного хостингу на **GitHub Pages**.

## Файли

- `index.html` — сторінка портфоліо
- `styles.css` — стилі
- `script.js` — меню, тема, форма
- `favicon.svg` — іконка вкладки

## Локальний запуск

Найпростіше: відкрийте `index.html` у браузері.

Рекомендовано (щоб усе працювало максимально коректно): запустити локальний сервер.

### Варіант A: Python

```bash
python -m http.server 5173
```

Відкрийте `http://localhost:5173`.

### Варіант B: Node (http-server)

```bash
npx http-server -p 5173
```

## Деплой на GitHub Pages (безкоштовно)

### 1) Створіть репозиторій на GitHub

- GitHub → **New repository**
- Назва, наприклад: `portfolio`
- Public (або Private — Pages теж працює, але інколи з обмеженнями залежно від плану)

### 2) Завантажте файли в репозиторій

У папці з цим проєктом виконайте:

```bash
git init
git add .
git commit -m "Initial landing page"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/portfolio.git
git push -u origin main
```

### 3) Увімкніть GitHub Pages

- Repo → **Settings** → **Pages**
- **Build and deployment**
  - Source: **Deploy from a branch**
  - Branch: `main` / `(root)`
- Save

Через 1–3 хв з’явиться URL сайту виду:
`https://<YOUR_USERNAME>.github.io/portfolio/`

## Налаштування контенту

- Контакти змінюються в `index.html`.
- Текст/секції/проєкти — у `index.html`.
- Кольори/візуальний стиль — у `styles.css`.


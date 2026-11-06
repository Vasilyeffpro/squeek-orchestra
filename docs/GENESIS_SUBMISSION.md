# Squeek Orchestra — пакет для прямой подачи

Проверено 6 ноября 2026 года по https://squeekchain.com/genesis/code и официальной документации разработчиков.

## Что уже реализовано

Рабочая музыкальная студия с реальным звуковым движком, редактированием нот, микшером, тремя пресетами, сохранением, ссылками на композиции, WAV-экспортом и режимом для стрима. Пользователь может создавать собственные композиции. API влияет на музыкальное поведение, а не только на декоративные показатели.

Это отдельный продукт: Wheel Canvas создаёт графику, Hamster Tower — игровые этажи, а Squeek Orchestra позволяет сочинять и экспортировать музыку. В просмотренных 19 карточках не было музыкального секвенсора. Это наблюдение о каталоге на дату проверки, а не гарантия абсолютной уникальности или одобрения.

## Текст заявки на английском

**Name:** Squeek Orchestra

**Description:**

Squeek Orchestra is a playable music studio where human composition meets real hamster telemetry. Build a track with six synthesized instruments and a sixteen-step sequencer, edit melodic pitches, mute and mix tracks, and choose from three starting compositions.

Follow the wheel turns Squeektoshi's fresh RPM into musical tempo. When he rests, the arrangement slows and softens. Confirmed SqueekCore rounds and cumulative work select a deterministic minor-pentatonic key, applied at bar boundaries so the harmony can evolve without interrupting the groove.

Save sessions locally, share exact musical snapshots through a link, export four bars as WAV, or open Stage view with a live audio spectrum for your stream. Everything runs in the browser. No wallet, transaction, token or audio subscription is needed.

The app reads the official public API, checks its reported Core identities against the published Sepolia deployment, and clearly distinguishes fresh, stale and unavailable data. Missing telemetry never becomes invented wheel activity. All audio is synthesized by the app.

## Что требуется от владельца для подачи

1. Разместить содержимое `dist/` на доступном всем HTTPS-сайте на своём домене. Приватное превью для владельца не подходит для публичной проверки.
2. Создать публичный GitHub-репозиторий с исходниками из этого архива. Репозиторий источников превью сам по себе не заменяет публичный GitHub.
3. Войти в свой Genesis-профиль и выбрать прямую подачу. В FAQ сейчас явно описаны оба пути: IMD и Direct. Для Direct оплачивать IMD не требуется.
4. Получить персональные данные подтверждения авторства в форме проекта. Добавить выданную DNS-запись к своему домену, page tag в живой сайт, repository line в README публичного репозитория. Не придумывать эти значения заранее.
5. Указать сайт, репозиторий и описание, проверить доступность и нажать Verify. Перед фактической отправкой проверить актуальные условия и финальные поля формы.
6. Дождаться автоматической проверки и решения команды. Наличие работающего продукта не гарантирует одобрения или получения бейджа.

## Что не сделано

Авторство в Genesis не подтверждено, заявка не отправлена. Пользовательский домен и публичный GitHub не подключены. В проект не добавлены фиктивные метки подтверждения, финансовые операции или обещания наград.

## Основные источники

- Каталог, требования, FAQ прямой подачи: https://squeekchain.com/genesis/code
- Официальный API: https://docs.squeekchain.com/developers/api/
- Текущий опубликованный deployment record: https://docs.squeekchain.com/assets/deployments/sepolia.json
- Раздел разработчиков: https://docs.squeekchain.com/developers/

Для подачи следует заново проверить deployment record: тестовая сеть и адреса контрактов могут меняться. В описаниях старых опубликованных работ встречаются прежние адреса; они не используются как источник конфигурации.

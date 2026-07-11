export interface Review {
  name: string;
  rating: number;
  date: string;
  text: string;
  country: string;
  initials: string;
}

export interface TranslationSet {
  logo: string;
  joinBtn: string;
  badge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroTitleEnd: string;
  heroSubtitle: string;
  heroSubtitleSec: string;
  btnStart: string;
  btnHow: string;
  videoTitle: string;
  videoSubtitle: string;
  howTitle: string;
  howSubtitle: string;
  step1Num: string;
  step1Title: string;
  step1Desc: string;
  step2Num: string;
  step2Title: string;
  step2Desc: string;
  step3Num: string;
  step3Title: string;
  step3Desc: string;
  benefitsTitle: string;
  benefitsSubtitle: string;
  b1Title: string;
  b1Desc: string;
  b2Title: string;
  b2Desc: string;
  b3Title: string;
  b3Desc: string;
  b4Title: string;
  b4Desc: string;
  reviewsTitle: string;
  reviewsSubtitle: string;
  calcTitle: string;
  calcSubtitle: string;
  trafficLabel: string;
  devicesLabel: string;
  estTitle: string;
  estPeriod: string;
  calcDisclaimer: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaBtn: string;
  ctaBonusBadge: string;
  footerDisclaimer: string;
  footerRights: string;
  footerLinkText: string;
  downloadHtmlTitle: string;
  downloadHtmlDesc: string;
  downloadBtn: string;
  contestTitle: string;
  contestSubtitle: string;
  contestBadge: string;
  contestPrizePool: string;
  contestPrizePoolVal: string;
  contestDate: string;
  contestDateVal: string;
  contestT1Title: string;
  contestT1Desc: string;
  contestT2Title: string;
  contestT2Desc: string;
  contestT3Title: string;
  contestT3Desc: string;
  contestRulesTitle: string;
  contestRule1: string;
  contestRule2: string;
  contestRule3: string;
  contestNote: string;
  contestTermsLink: string;
  contestTermsTitle: string;
  contestTerms1: string;
  contestTerms2: string;
  contestTerms3: string;
  contestTerms4: string;
  contestTerms5: string;
  contestTerms6: string;
    contestJoinBtn: string;
    privacyTitle: string;
    privacyP1: string;
    privacyP2: string;
    privacyP3: string;
    privacyP4: string;
    privacyP5: string;
    rulesTitle: string;
    rules1: string;
    rules2: string;
    rules3: string;
    rules4: string;
    rules5: string;
    cookieConsentText: string;
    cookieConsentAccept: string;
    cookieConsentLearnMore: string;
    reviews: Review[];
}

export const translations: Record<'ru' | 'en', TranslationSet> = {
  ru: {
    logo: "HoneyGain.store",
    joinBtn: "Присоединиться",
    badge: "🍯 Пассивный доход 24/7",
    heroTitle: "Зарабатывай, даже",
    heroTitleHighlight: "когда ты спишь",
    heroTitleEnd: "!",
    heroSubtitle: "Делись своим неиспользуемым интернетом и получай за это реальные деньги.",
    heroSubtitleSec: "Honeygain — это полностью безопасная платформа для создания пассивного дохода без каких-либо вложений.",
    btnStart: "Начать зарабатывать",
    btnHow: "Как это работает",
    videoTitle: "Узнай больше о Honeygain",
    videoSubtitle: "Посмотри короткое видео о том, как работает система на практике",
    howTitle: "Как это работает?",
    howSubtitle: "Всего 3 простых шага отделяют тебя от стабильного пассивного дохода",
    step1Num: "01",
    step1Title: "Установи приложение",
    step1Desc: "Зарегистрируйся по нашей партнерской ссылке, скачай и установи приложение Honeygain на свои устройства (ПК, смартфон или планшет).",
    step2Num: "02",
    step2Title: "Запусти в фоне",
    step2Desc: "Приложение безопасно использует часть твоего неиспользуемого интернет-трафика в фоновом режиме, не замедляя твою работу.",
    step3Num: "03",
    step3Title: "Получай выплаты",
    step3Desc: "Накапливай баллы и выводи реальные деньги на свой счет через PayPal или криптовалюту (JMPT) в любое время.",
    benefitsTitle: "Наши Преимущества",
    benefitsSubtitle: "Почему миллионы пользователей по всему миру выбирают Honeygain для заработка",
    b1Title: "Полностью пассивный доход",
    b1Desc: "Настрой один раз и забудь. Приложение работает автономно в фоновом режиме, принося доход круглые сутки.",
    b2Title: "Абсолютная безопасность",
    b2Desc: "Трафик используется только проверенными компаниями для аналитики и исследований рынка. Никакого доступа к личным данным.",
    b3Title: "Бонус $3 при регистрации",
    b3Desc: "Зарегистрируйся по нашей партнерской ссылке и мгновенно получи стартовый бонус $3 на свой баланс бесплатно!",
    b4Title: "Партнерская программа 25%",
    b4Desc: "Регистрируйся сейчас и приглашай друзей, получая пожизненно 25% от их ежедневного заработка в качестве бонуса!",
    reviewsTitle: "Отзывы Пользователей",
    reviewsSubtitle: "Реальные отзывы людей, которые уже зарабатывают с Honeygain по всему миру",
    calcTitle: "Калькулятор Дохода",
    calcSubtitle: "Рассчитай свой примерный ежемесячный заработок прямо сейчас",
    trafficLabel: "Средний трафик в день",
    devicesLabel: "Количество активных устройств",
    estTitle: "Примерный доход:",
    estPeriod: "в месяц",
    calcDisclaimer: "* Расчеты основаны на стандартных тарифах Honeygain и могут меняться в зависимости от твоей геолокации, скорости сети и востребованности трафика.",
    ctaTitle: "Готов начать зарабатывать?",
    ctaSubtitle: "Зарегистрируйся прямо сейчас по кнопке ниже и мгновенно забери свой приветственный бонус $3!",
    ctaBtn: "Зарегистрироваться + Бонус $3",
    ctaBonusBadge: "🍯 Бонус $3 активирован",
    footerDisclaimer: "Дисклеймер: Этот сайт (honeygain.store) является реферальным/партнерским ресурсом и не является официальным представительством компании Honeygain. Все товарные знаки и торговые марки принадлежат их законным владельцам.",
    footerRights: "Все права защищены.",
    footerLinkText: "Регистрация в Honeygain",
    downloadHtmlTitle: "Экспорт Landing Page",
    downloadHtmlDesc: "Вы можете скачать эту страницу как один полностью готовый файл index.html со всеми стилями и скриптами для загрузки на ваш хостинг.",
    downloadBtn: "Скачать index.html",
    contestTitle: "Ежемесячный Мега-Конкурс",
    contestSubtitle: "Участвуй в нашем розыгрыше призов для новых активных пользователей Honeygain!",
    contestBadge: "🎉 Розыгрыш призов",
    contestPrizePool: "Призовой фонд",
    contestPrizePoolVal: "$100 каждый месяц",
    contestDate: "Следующий розыгрыш",
    contestDateVal: "1-е число каждого месяца в 20:00 UTC",
    contestT1Title: "1-е место ($50)",
    contestT1Desc: "Главный приз наличными на баланс или крипто-кошелек.",
    contestT2Title: "2-е место ($30)",
    contestT2Desc: "Второй приз за отличную активность и приглашение друзей.",
    contestT3Title: "3-е место ($20)",
    contestT3Desc: "Поощрительный приз за установку на несколько устройств.",
    contestRulesTitle: "Простые правила участия:",
    contestRule1: "Зарегистрируйся по нашей ссылке (получи гарантированные $3 сразу)",
    contestRule2: "Установи приложение Honeygain (телефон, компьютер) и держи его активным постоянно!",
    contestRule3: "Пригласи 3 друзей (это удваивает твои шансы!)",
    contestNote: "Примечание: * Участие бесплатное. Один аккаунт = одна заявка в неделю. Победитель объявляется каждое 1-е число месяца в 20:00, в нашем телеграмм канале.",
    contestTermsLink: "Обязательно прочитайте условия конкурса!",
    contestTermsTitle: "Условия и правила конкурса",
    contestTerms1: "Организатор конкурса является независимым партнером (реферером) платформы Honeygain. Данный конкурс проводится по инициативе владельцев сайта HoneyGain.store.",
    contestTerms2: "Для участия в конкурсе необходимо зарегистрироваться по нашей партнерской ссылке, установить и запустить приложение Honeygain на любом устройстве.",
    contestTerms3: "Один пользователь может зарегистрировать только один игровой/активный аккаунт. Обнаружение мультиаккаунтов или искусственной накрутки рефералов приведет к немедленной дисквалификации.",
    contestTerms4: "Призы выплачиваются 1-го числа каждого месяца на указанный победителем криптовалютный кошелек (USDT TRC20/BSC) или баланс аккаунта Honeygain.",
    contestTerms5: "Определение победителей происходит в прямом эфире или через верифицируемый генератор случайных чисел. Списки участников формируются на основе активных рефералов.",
    contestTerms6: "Организатор оставляет за собой право вносить изменения в условия конкурса, предварительно уведомив об этом в официальном Телеграм-канале.",
    contestJoinBtn: "Принять участие в конкурсе",
    privacyTitle: "Политика конфиденциальности",
    privacyP1: "Настоящая Политика конфиденциальности описывает, как сайт HoneyGain.store обрабатывает информацию. Наш сайт является исключительно информационным и партнерским (реферальным) ресурсом.",
    privacyP2: "Сбор личных данных: Мы не собираем, не храним и не обрабатываем ваши персональные данные (такие как имя, email, номера телефонов или платежные реквизиты). Все ссылки для регистрации ведут на официальный сайт Honeygain.",
    privacyP3: "Файлы Cookie: Наш сайт не использует собственные отслеживающие файлы cookie для сбора личной информации. Мы можем использовать базовые технические cookie-файлы для сохранения выбранного вами языка сайта и темы оформления.",
    privacyP4: "Сторонние сервисы: Наш сайт содержит ссылки на сторонние ресурсы (например, официальный сайт Honeygain, Telegram, YouTube). Мы не несем ответственности за политику конфиденциальности, контент или безопасность этих сторонних сайтов.",
    privacyP5: "Изменения политики: Мы оставляем за собой право обновлять эту политику в любое время без предварительного уведомления. Пожалуйста, регулярно проверяйте эту страницу для ознакомления с актуальной версией.",
    rulesTitle: "Правила пользования сайтом",
    rules1: "Общие положения: Сайт HoneyGain.store носит исключительно информационный характер и предоставляет бесплатные ознакомительные материалы о работе платформы Honeygain, а также партнерские ссылки для регистрации.",
    rules2: "Отказ от ответственности: Мы не являемся официальными представителями Honeygain. Мы не гарантируем точный уровень дохода, бесперебойную работу приложения Honeygain или стабильность выплат от самой платформы.",
    rules3: "Использование материалов: Все материалы, представленные на данном сайте, защищены авторским правом. Копирование и публикация любой информации разрешается только при наличии активной индексируемой ссылки на наш сайт.",
    rules4: "Реферальная система: Регистрируясь по нашим ссылкам, вы добровольно становитесь нашим рефералом и соглашаетесь на получение стартового бонуса $3, предоставляемого платформой Honeygain для новых участников.",
    rules5: "Ограничение ответственности: Администрация сайта не несет ответственности за любые прямые или косвенные убытки, упущенную выгоду или сбои, возникшие в результате использования информации с этого сайта или работы приложения Honeygain.",
    cookieConsentText: "Мы используем файлы cookie для персонализации интерфейса (сохранения языка и темы). Оставаясь на сайте, вы соглашаетесь с нашей Политикой конфиденциальности.",
    cookieConsentAccept: "Согласиться",
    cookieConsentLearnMore: "Подробнее",
    reviews: [
      {
        name: "Алексей К.",
        rating: 5,
        date: "14.05.2026",
        text: "Сначала сомневался, но за месяц набежало около $35 абсолютно пассивно с двух устройств. Вывел на PayPal без проблем, теперь советую всем друзьям.",
        country: "Россия",
        initials: "АК"
      },
      {
        name: "Елена В.",
        rating: 5,
        date: "22.06.2026",
        text: "Сначала установила только себе, теперь подключила всю семью и друзей по рефке. С их активности капает очень приятный процент в 25%. Рекомендую!",
        country: "Казахстан",
        initials: "ЕВ"
      },
      {
        name: "Дмитрий С.",
        rating: 5,
        date: "19.06.2026",
        text: "Занимаюсь криптой, поэтому вывод в JMPT через сеть BSC для меня просто находка. Никаких комиссий и моментальное зачисление. Супер!",
        country: "Беларусь",
        initials: "ДС"
      },
      {
        name: "Иван П.",
        rating: 5,
        date: "04.07.2026",
        text: "Работает тихо в фоне на домашнем сервере и рабочем ПК. Около $40 в месяц чистыми за интернет, которым я все равно не пользуюсь на полную мощность.",
        country: "Украина",
        initials: "ИП"
      },
      {
        name: "Мария Т.",
        rating: 5,
        date: "12.06.2026",
        text: "Регистрационный бонус в $3 очень мотивирует начать! За две недели уже накопила на первую выплату. Безопасно, удобно и действительно работает.",
        country: "Латвия",
        initials: "МТ"
      },
      {
        name: "Александр М.",
        rating: 5,
        date: "01.07.2026",
        text: "Отличное дополнение к стипендии. Установил на телефон и ноут, за месяц накопилось $22. Выплату получил в течение суток после заказа на PayPal.",
        country: "Узбекистан",
        initials: "АМ"
      },
      {
        name: "Ольга К.",
        rating: 5,
        date: "28.05.2026",
        text: "Очень простое приложение, не перегружает систему. Сначала боялась за безопасность, но проверила — данные защищены, никаких вирусов. Буду пользоваться дальше!",
        country: "Молдова",
        initials: "ОК"
      },
      {
        name: "Николай Д.",
        rating: 5,
        date: "15.06.2026",
        text: "Использую Honeygain уже больше полугода. Доход стабильный, на оплату интернета и мобильной связи хватает с лихвой. Отличная штука для пассивного заработка.",
        country: "Армения",
        initials: "НД"
      }
    ]
  },
  en: {
    logo: "HoneyGain.store",
    joinBtn: "Join Now",
    badge: "🍯 Passive Income 24/7",
    heroTitle: "Earn Money Even",
    heroTitleHighlight: "While You Sleep",
    heroTitleEnd: "!",
    heroSubtitle: "Share your unused internet bandwidth and get paid in real money.",
    heroSubtitleSec: "Honeygain is a completely safe platform for creating passive income without any investment.",
    btnStart: "Start Earning",
    btnHow: "How It Works",
    videoTitle: "Learn More About Honeygain",
    videoSubtitle: "Watch a short video explanation on how the system works in practice",
    howTitle: "How It Works?",
    howSubtitle: "Just 3 simple steps separate you from a stable passive income source",
    step1Num: "01",
    step1Title: "Install the App",
    step1Desc: "Sign up using our affiliate link, download and install the Honeygain app on your devices (PC, smartphone, or tablet).",
    step2Num: "02",
    step2Title: "Run in Background",
    step2Desc: "The app securely shares a fraction of your unused internet traffic in the background without slowing you down.",
    step3Num: "03",
    step3Title: "Get Paid",
    step3Desc: "Accumulate points and withdraw real cash to your PayPal or cryptocurrency wallet (JMPT) at any time.",
    benefitsTitle: "Our Advantages",
    benefitsSubtitle: "Why millions of users worldwide choose Honeygain for earning",
    b1Title: "100% Passive Income",
    b1Desc: "Set it up once and forget. The application runs autonomously in the background, generating income around the clock.",
    b2Title: "Absolute Security",
    b2Desc: "Your traffic is used only by verified businesses for market research and analytics. Zero access to your personal data.",
    b3Title: "$3 Signup Bonus",
    b3Desc: "Register through our affiliate link and instantly get a starting bonus of $3 added to your balance for free!",
    b4Title: "25% Affiliate Program",
    b4Desc: "Register now and invite friends to receive 25% of their daily earnings for life as a bonus!",
    reviewsTitle: "User Reviews",
    reviewsSubtitle: "Real stories from people who are already earning passive income with Honeygain",
    calcTitle: "Income Calculator",
    calcSubtitle: "Calculate your estimated monthly earnings right now based on active usage",
    trafficLabel: "Average daily traffic",
    devicesLabel: "Active devices count",
    estTitle: "Estimated earnings:",
    estPeriod: "per month",
    calcDisclaimer: "* Calculations are based on standard Honeygain rates and may vary depending on your location, internet speed, and traffic demand.",
    ctaTitle: "Ready to Start Earning?",
    ctaSubtitle: "Register right now using the button below and instantly claim your welcome bonus of $3!",
    ctaBtn: "Register + Get $3 Bonus",
    ctaBonusBadge: "🍯 $3 Bonus Activated",
    footerDisclaimer: "Disclaimer: This website (honeygain.store) is an affiliate/referral resource and is not an official representative of Honeygain. All trademarks and registered trade brands belong to their respective owners.",
    footerRights: "All rights reserved.",
    footerLinkText: "Honeygain Registration",
    downloadHtmlTitle: "Export Landing Page",
    downloadHtmlDesc: "You can download this page as a single fully prepared index.html file containing all styles and scripts to upload to your hosting.",
    downloadBtn: "Download index.html",
    contestTitle: "Monthly Mega-Contest",
    contestSubtitle: "Join our exclusive prize giveaway for new active Honeygain users!",
    contestBadge: "🎉 Prize Giveaway",
    contestPrizePool: "Prize Pool",
    contestPrizePoolVal: "$100 every month",
    contestDate: "Next Draw",
    contestDateVal: "1st of every month at 20:00 UTC",
    contestT1Title: "1st Place ($50)",
    contestT1Desc: "Main cash prize credited to your balance or crypto wallet.",
    contestT2Title: "2nd Place ($30)",
    contestT2Desc: "Second place prize for great activity and inviting friends.",
    contestT3Title: "3rd Place ($20)",
    contestT3Desc: "Consolation prize for installing on multiple devices.",
    contestRulesTitle: "Simple entry requirements:",
    contestRule1: "Register through our affiliate link (claim your guaranteed $3 immediately)",
    contestRule2: "Install the Honeygain app (phone, computer) and keep it active constantly!",
    contestRule3: "Invite 3 friends (this doubles your chances!)",
    contestNote: "Note: * Participation is free. One account = one entry per week. The winner is announced on the 1st of every month at 20:00 in our Telegram channel.",
    contestTermsLink: "Be sure to read the contest terms!",
    contestTermsTitle: "Contest Terms and Conditions",
    contestTerms1: "The contest organizer is an independent affiliate (referrer) of the Honeygain platform. This contest is organized by the owners of HoneyGain.store.",
    contestTerms2: "To enter, you must register using our affiliate link, install, and run the Honeygain application on any device.",
    contestTerms3: "Each participant may register only one active account. Detection of multiple accounts or fake referrals will result in immediate disqualification.",
    contestTerms4: "Prizes are paid on the 1st of every month to the crypto wallet (USDT TRC20/BSC) or Honeygain account balance of the winner's choice.",
    contestTerms5: "Winners are drawn live or via a verifiable random number generator. Participant lists are based on active referrees.",
    contestTerms6: "The organizer reserves the right to modify the contest terms with prior notification in our official Telegram channel.",
    contestJoinBtn: "Join the Monthly Contest",
    privacyTitle: "Privacy Policy",
    privacyP1: "This Privacy Policy describes how the HoneyGain.store website processes information. Our website is strictly an informational and affiliate (referral) resource.",
    privacyP2: "Data Collection: We do not collect, store, or process any of your personal data (such as name, email, phone numbers, or payment details). All registration links redirect to the official Honeygain platform.",
    privacyP3: "Cookie Files: Our website does not utilize tracking cookies to collect personal information. We may use basic technical cookies solely to save your preferred language and theme settings.",
    privacyP4: "Third-party Services: Our website contains links to third-party resources (e.g. the official Honeygain website, Telegram, YouTube). We are not responsible for the privacy practices, content, or safety of these external sites.",
    privacyP5: "Policy Updates: We reserve the right to update this privacy policy at any time without prior notice. Please check this page periodically for any updates.",
    rulesTitle: "Terms of Use / Site Rules",
    rules1: "General Terms: The HoneyGain.store website is strictly informational and provides free introductory materials regarding the Honeygain platform, alongside affiliate links for registration.",
    rules2: "Disclaimer: We are not official representatives of Honeygain. We do not guarantee any specific income level, uninterrupted operation of the Honeygain application, or payout stability from the platform itself.",
    rules3: "Material Usage: All materials presented on this website are protected by copyright. Copying or publishing any information from this site is permitted only with an active indexing link back to our resource.",
    rules4: "Referral Program: By registering through our links, you voluntarily join as our referee and agree to receive the standard $3 registration bonus provided by Honeygain to new users.",
    rules5: "Limitation of Liability: The website administration is not liable for any direct or indirect losses, lost profits, or operational failures arising from using information on this site or the official Honeygain software.",
    cookieConsentText: "We use cookies to personalize your experience (language and theme preferences). By continuing to browse, you agree to our Privacy Policy.",
    cookieConsentAccept: "Accept",
    cookieConsentLearnMore: "Learn More",
    reviews: [
      {
        name: "Alex K.",
        rating: 5,
        date: "14.05.2026",
        text: "Was skeptical at first, but made around $35 in a month absolutely passively from two devices. Withdrew to PayPal with no issues, highly recommended.",
        country: "Russia",
        initials: "AK"
      },
      {
        name: "Sarah M.",
        rating: 5,
        date: "28.04.2026",
        text: "The best application for passive income! I have it installed on my work laptop and phone. The bonus $3 on registration was a very nice touch.",
        country: "USA",
        initials: "SM"
      },
      {
        name: "Dmitry S.",
        rating: 5,
        date: "19.06.2026",
        text: "I do crypto, so withdrawing via JMPT on the BSC network is a life-saver. Zero fees and instant payouts. Superb!",
        country: "Belarus",
        initials: "DS"
      },
      {
        name: "Hans W.",
        rating: 5,
        date: "02.05.2026",
        text: "Sehr gut! It runs smoothly in the background, eats zero CPU and doesn't lag my internet at all. Earning about $25/month on my home router connection.",
        country: "Germany",
        initials: "HW"
      },
      {
        name: "Elena V.",
        rating: 5,
        date: "22.06.2026",
        text: "Started with just my phone, now connected my whole family and friends through my link. The 25% affiliate share is amazing. Highly recommend!",
        country: "Kazakhstan",
        initials: "EV"
      },
      {
        name: "Alexander M.",
        rating: 5,
        date: "01.07.2026",
        text: "A great addition to my student allowance. Installed it on my phone and laptop, earned $22 in a month. Received the payout via PayPal within 24 hours.",
        country: "Uzbekistan",
        initials: "AM"
      },
      {
        name: "Olga K.",
        rating: 5,
        date: "28.05.2026",
        text: "Very simple app, doesn't put any load on the system. At first I was worried about safety, but did some checks - data is fully secure, no malware at all.",
        country: "Moldova",
        initials: "OK"
      },
      {
        name: "Nicholas D.",
        rating: 5,
        date: "15.06.2026",
        text: "Have been using Honeygain for over 6 months now. The income is stable, easily covers my internet and mobile bills. An excellent tool for passive earning.",
        country: "Armenia",
        initials: "ND"
      }
    ]
  }
};

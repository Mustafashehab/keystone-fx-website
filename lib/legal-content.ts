import type { Lang } from "@/lib/i18n";

export type LegalDocKey = "terms" | "privacy" | "risk";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDoc {
  title: string;
  summary: string;
  /** Optional highlighted warning shown above the sections. */
  callout?: string;
  sections: LegalSection[];
}

export const LEGAL_PATHS: Record<LegalDocKey, string> = {
  terms: "terms",
  privacy: "privacy",
  risk: "risk-warning",
};

export const LEGAL_UPDATED = "2026-10-17";

export const LEGAL_UI: Record<
  Lang,
  {
    updated: string;
    updatedDate: string;
    contents: string;
    contact: string;
    links: Record<LegalDocKey, string>;
    legalNav: string;
  }
> = {
  en: {
    updated: "Last updated",
    updatedDate: "17 October 2026",
    contents: "Contents",
    contact: "Questions about this document? Contact us at",
    links: { terms: "Terms of Service", privacy: "Privacy Policy", risk: "Risk Warning" },
    legalNav: "Legal",
  },
  ar: {
    updated: "آخر تحديث",
    updatedDate: "17 أكتوبر 2026",
    contents: "المحتويات",
    contact: "هل لديك أسئلة حول هذه الوثيقة؟ تواصل معنا عبر",
    links: { terms: "شروط الخدمة", privacy: "سياسة الخصوصية", risk: "تحذير المخاطر" },
    legalNav: "قانوني",
  },
  zh: {
    updated: "最后更新",
    updatedDate: "2026年10月17日",
    contents: "目录",
    contact: "如对本文件有任何疑问，请联系",
    links: { terms: "服务条款", privacy: "隐私政策", risk: "风险警示" },
    legalNav: "法律信息",
  },
};

const CONTACT_EMAIL = "info@keystone-fx.com";
export const LEGAL_CONTACT_EMAIL = CONTACT_EMAIL;

/* ------------------------------------------------------------------ */
/* ENGLISH                                                             */
/* ------------------------------------------------------------------ */

const termsEn: LegalDoc = {
  title: "Terms of Service",
  summary:
    "These Terms govern your use of keystone-fx.com and the Keystone FX client portal. Please read them carefully before opening an account.",
  sections: [
    {
      heading: "1. About these Terms",
      paragraphs: [
        "These Terms of Service (the \"Terms\") apply to the website keystone-fx.com, the Keystone FX client portal and all related services (together, the \"Services\"), operated by Keystone FX Ltd (\"Keystone FX\", \"we\", \"us\").",
        "By registering for an account or using the Services, you confirm that you have read, understood and accepted these Terms, our Privacy Policy and our Risk Warning. If you do not agree, do not use the Services.",
      ],
    },
    {
      heading: "2. Our services",
      paragraphs: [
        "Keystone FX provides a client portal for onboarding and identity verification, the opening and administration of trading accounts on the MetaTrader 5 (MT5) platform, the processing of deposit and withdrawal requests through the payment methods we make available, and client support.",
        "Trading accounts are hosted on MT5 infrastructure provided by our third-party technology and liquidity partners. We do not provide investment, legal or tax advice, and nothing on the website or in the portal is a recommendation to trade.",
      ],
    },
    {
      heading: "3. Eligibility",
      bullets: [
        "You must be at least 18 years old and have full legal capacity to enter into these Terms.",
        "The Services are not offered to residents of the United States or to any person subject to international sanctions, or in any jurisdiction where their use would be unlawful.",
        "You are responsible for making sure that using the Services is lawful in the country where you live.",
        "We may decline any application or close any account at our discretion, including where we cannot verify your identity.",
      ],
    },
    {
      heading: "4. Account opening and verification",
      bullets: [
        "You must provide complete, accurate and up-to-date information and keep it current.",
        "We will ask for identity and address documents, such as a valid passport and a recent proof of address, and we may ask for further information, including the source of your funds.",
        "We may delay, restrict or close an account until verification is complete, or where information is missing, inconsistent or false.",
        "Each client may hold one portal account unless we agree otherwise in writing.",
      ],
    },
    {
      heading: "5. Deposits and withdrawals",
      bullets: [
        "Available funding methods are shown in the portal or provided by our support team. At present, deposits and withdrawals are made in USDT on the TRON (TRC-20) network.",
        "Only send funds to payment details provided to you through official Keystone FX channels. Always check the wallet address and network before sending.",
        "Blockchain transfers cannot be reversed. We are not responsible for funds sent to a wrong address, on a wrong network, or to details not provided by us.",
        "Withdrawals are paid only to a wallet that belongs to you, after verification, and are subject to available free margin and internal review. Network fees may be deducted.",
        "Third-party deposits and withdrawals are not accepted. We may refuse, delay or return any transaction where we suspect fraud, money laundering or a breach of these Terms.",
      ],
    },
    {
      heading: "6. Trading",
      bullets: [
        "You make all trading decisions and are solely responsible for them.",
        "Orders are executed on MT5 under prevailing market conditions. Prices, spreads, swap rates, leverage and margin requirements may change, including without notice in fast markets.",
        "If your margin level falls to the stop-out level, open positions may be closed automatically, starting with the least profitable position.",
        "Keystone FX may act as the counterparty to your trades or may pass them to liquidity providers. Please read the Risk Warning for what this means for you.",
        "Trades executed at a price that is clearly wrong because of a system, feed or quoting error may be corrected or cancelled.",
      ],
    },
    {
      heading: "7. Your obligations",
      bullets: [
        "Keep your login details and devices secure, and tell us immediately about any unauthorised access.",
        "Do not use the Services for fraud, money laundering, terrorist financing or any other unlawful purpose.",
        "Do not engage in abusive trading practices, including exploiting price or latency errors, or using software designed to manipulate the platform.",
      ],
    },
    {
      heading: "8. Fees and charges",
      paragraphs: [
        "Spreads, commissions, swap (overnight) charges and any other fees are shown in the portal, in the MT5 contract specifications or are communicated to you before they apply. Blockchain network fees are your responsibility.",
      ],
    },
    {
      heading: "9. Bonuses and promotions",
      paragraphs: [
        "Any bonus or promotion is subject to its own published terms, may be changed or withdrawn at any time, and may carry trading-volume conditions before it can be withdrawn. We may remove any bonus, and any profit generated from it, where we believe a promotion has been abused.",
      ],
    },
    {
      heading: "10. Suspension and closure",
      paragraphs: [
        "You may close your account at any time by contacting support. We may suspend or close your account if you breach these Terms, if we suspect fraud or other unlawful activity, or if required by law.",
        "When an account is closed, open positions will be closed at market prices and any remaining balance, after fees and amounts owed, will be paid to your verified wallet. We keep records for the periods required by law, as described in our Privacy Policy.",
      ],
    },
    {
      heading: "11. Limitation of liability",
      paragraphs: [
        "The Services are provided \"as is\" and \"as available\". To the extent permitted by law, Keystone FX is not liable for trading losses, loss of profit, or indirect or consequential losses, or for interruptions or failures caused by internet connections, the MT5 platform, blockchain networks, payment providers or other third parties outside our control.",
        "Nothing in these Terms limits liability for fraud or for any liability that cannot be limited by law.",
      ],
    },
    {
      heading: "12. Changes to these Terms",
      paragraphs: [
        "We may update these Terms from time to time. The updated version will be published on this page with a new \"Last updated\" date. Continuing to use the Services after a change means you accept the updated Terms.",
      ],
    },
    {
      heading: "13. Complaints and contact",
      paragraphs: [
        `If you have a complaint, email ${CONTACT_EMAIL} with your name, account email and a description of the issue. We will acknowledge your complaint within 5 business days and aim to give a full response within 30 days.`,
        "Keystone FX Ltd, Charles Helou Avenue, Dora – Beirut Highway, Bourj Hammoud, Beirut, Lebanon.",
      ],
    },
    {
      heading: "14. Governing law",
      paragraphs: [
        "These Terms are governed by the laws of the jurisdiction in which Keystone FX Ltd is incorporated, and any dispute will be subject to the courts of that jurisdiction.",
      ],
    },
  ],
};

const privacyEn: LegalDoc = {
  title: "Privacy Policy",
  summary:
    "This policy explains what personal information Keystone FX collects, why we collect it, who we share it with and the choices you have.",
  sections: [
    {
      heading: "1. Who we are",
      paragraphs: [
        `Keystone FX Ltd (\"Keystone FX\", \"we\", \"us\") is responsible for the personal information described in this policy. You can contact us at ${CONTACT_EMAIL} or at Charles Helou Avenue, Dora – Beirut Highway, Bourj Hammoud, Beirut, Lebanon.`,
      ],
    },
    {
      heading: "2. Information we collect",
      bullets: [
        "Identity details: name, date of birth, nationality, and copies of identity documents such as your passport.",
        "Contact details: email address, phone number and residential address.",
        "Financial profile: employment status, income range, source of funds and trading experience.",
        "Declarations: tax residency, tax identification number, and whether you are a politically exposed person or a US person.",
        "Account and transaction data: MT5 account numbers, deposits, withdrawals, wallet addresses and blockchain transaction references.",
        "Communications: support tickets, emails and messages you send us, including through WhatsApp.",
        "Technical data: IP address, device and browser information, and website usage data collected through cookies and analytics.",
      ],
    },
    {
      heading: "3. How we use your information",
      bullets: [
        "To open, operate and administer your account and trading accounts.",
        "To verify your identity and carry out anti-money-laundering, sanctions and fraud checks.",
        "To process deposits and withdrawals.",
        "To answer your questions and provide support.",
        "To keep the Services secure and to detect and prevent abuse.",
        "To meet our legal and record-keeping obligations.",
        "To send you service messages about your account. We send marketing only where you have agreed, and you can opt out at any time.",
      ],
    },
    {
      heading: "4. Legal grounds",
      paragraphs: [
        "We process your information because it is needed to provide the Services you asked for (contract), to comply with legal obligations, for our legitimate interests in running a secure business, or with your consent where consent is required.",
      ],
    },
    {
      heading: "5. Who we share it with",
      bullets: [
        "Service providers who host and run our systems, such as cloud hosting and database providers (for example Vercel and Supabase) and email delivery providers.",
        "Analytics providers (Google Analytics) for aggregated website statistics.",
        "Our trading platform and liquidity partners, to open and operate your MT5 accounts.",
        "Professional advisers such as lawyers and auditors.",
        "Courts, regulators and law-enforcement authorities where we are legally required to.",
      ],
      paragraphs: [
        "Wallet addresses and transactions on public blockchains such as TRON are visible to anyone. We do not sell your personal information.",
      ],
    },
    {
      heading: "6. International transfers",
      paragraphs: [
        "Our service providers may store or process information in countries other than your own. Where this happens, we take reasonable steps to make sure your information remains protected.",
      ],
    },
    {
      heading: "7. How long we keep it",
      paragraphs: [
        "We keep your information while your account is open and for at least five years after it is closed, so that we can meet anti-money-laundering and record-keeping requirements, or longer where the law requires.",
      ],
    },
    {
      heading: "8. Security",
      paragraphs: [
        "We use encryption in transit, access controls and limited staff access to protect your information. No system is completely secure, so please also protect your password and devices.",
      ],
    },
    {
      heading: "9. Your rights",
      paragraphs: [
        `Depending on where you live, you may have the right to access, correct or delete your information, to object to or restrict certain processing, to withdraw consent and to receive a copy of your data. Email ${CONTACT_EMAIL} to make a request. We may need to verify your identity first, and some information must be kept to meet legal obligations.`,
      ],
    },
    {
      heading: "10. Cookies and analytics",
      paragraphs: [
        "We use essential cookies to keep you signed in to the portal, and Google Analytics to understand how the website is used. You can block or delete cookies in your browser settings; the portal may not work correctly without essential cookies.",
      ],
    },
    {
      heading: "11. Children",
      paragraphs: ["The Services are not intended for anyone under 18, and we do not knowingly collect their information."],
    },
    {
      heading: "12. Changes to this policy",
      paragraphs: [
        "We may update this policy from time to time. The latest version will always be on this page with its \"Last updated\" date.",
      ],
    },
  ],
};

const riskEn: LegalDoc = {
  title: "Risk Warning",
  summary:
    "Before you trade, make sure you understand the risks described below. If anything is unclear, seek independent advice.",
  callout:
    "Trading forex, CFDs and other leveraged products carries a high level of risk and may not be suitable for everyone. You can lose all of the money you deposit. Only trade with money you can afford to lose.",
  sections: [
    {
      heading: "1. Leverage",
      paragraphs: [
        "Leverage lets you open positions much larger than your deposit. It magnifies losses as well as gains: a small price movement against you can quickly wipe out your balance.",
      ],
    },
    {
      heading: "2. Market volatility and price gaps",
      paragraphs: [
        "Prices can move very quickly, especially around economic news, market openings and weekends. Your order may be filled at a worse price than requested (slippage), and stop-loss orders do not guarantee a maximum loss when prices gap.",
      ],
    },
    {
      heading: "3. Margin calls and stop-out",
      paragraphs: [
        "You must keep enough margin in your account to support open positions. If your margin level falls too low, your positions may be closed automatically at the prevailing market price without further notice, and you may lose your entire balance.",
      ],
    },
    {
      heading: "4. Counterparty and conflicts of interest",
      paragraphs: [
        "Keystone FX may act as the counterparty to your trades, or may pass them to liquidity providers. When Keystone FX is the counterparty, your loss may be our gain. We manage this conflict through our execution practices, but you should be aware of it.",
        "Your funds and positions also depend on the continued operation of Keystone FX and of its technology and liquidity partners.",
      ],
    },
    {
      heading: "5. Cryptocurrency and USDT funding",
      bullets: [
        "Deposits and withdrawals in USDT depend on the stablecoin keeping its value against the US dollar, which is not guaranteed.",
        "Blockchain transfers are irreversible. Funds sent to a wrong address or on a wrong network are usually lost permanently.",
        "Network congestion can delay transfers and change network fees.",
        "Cryptocurrency CFDs are extremely volatile and can move by large amounts in a short time.",
      ],
    },
    {
      heading: "6. Technology risk",
      paragraphs: [
        "Trading depends on your internet connection, your device, the MT5 platform and our partners' systems. Outages, delays or errors can prevent you from opening or closing positions when you want to.",
      ],
    },
    {
      heading: "7. Regulatory and legal risk",
      paragraphs: [
        "Keystone FX is not authorised by a financial regulator in your country. You may not have the protections, such as compensation schemes or ombudsman services, that apply when dealing with a locally regulated firm. It is your responsibility to make sure that trading is lawful where you live.",
      ],
    },
    {
      heading: "8. No advice and past performance",
      paragraphs: [
        "Keystone FX does not give investment advice. Any market information is general and is not a recommendation. Past performance is not a reliable indicator of future results.",
      ],
    },
    {
      heading: "9. Bonuses",
      paragraphs: [
        "Bonuses and promotions do not reduce your risk. Trading conditions attached to a bonus may encourage you to trade more than you otherwise would.",
      ],
    },
    {
      heading: "10. Understand what you trade",
      paragraphs: [
        "Before trading any instrument, review its contract specifications in MT5, including leverage, margin, trading hours and swap charges. If you do not fully understand the risks, do not trade.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* ARABIC                                                              */
/* ------------------------------------------------------------------ */

const termsAr: LegalDoc = {
  title: "شروط الخدمة",
  summary:
    "تحكم هذه الشروط استخدامك لموقع keystone-fx.com وبوابة عملاء Keystone FX. يرجى قراءتها بعناية قبل فتح حساب.",
  sections: [
    {
      heading: "1. حول هذه الشروط",
      paragraphs: [
        "تنطبق شروط الخدمة هذه (\"الشروط\") على موقع keystone-fx.com وبوابة عملاء Keystone FX وجميع الخدمات المرتبطة بها (يُشار إليها مجتمعةً بـ\"الخدمات\")، والتي تديرها شركة Keystone FX Ltd (\"Keystone FX\" أو \"نحن\").",
        "بتسجيلك حساباً أو استخدامك للخدمات، فإنك تؤكد أنك قرأت هذه الشروط وسياسة الخصوصية وتحذير المخاطر وفهمتها ووافقت عليها. إذا كنت لا توافق، فلا تستخدم الخدمات.",
      ],
    },
    {
      heading: "2. خدماتنا",
      paragraphs: [
        "توفر Keystone FX بوابة عملاء لتسجيل العملاء والتحقق من الهوية، وفتح حسابات التداول وإدارتها على منصة MetaTrader 5 (MT5)، ومعالجة طلبات الإيداع والسحب عبر وسائل الدفع التي نتيحها، إضافةً إلى دعم العملاء.",
        "تُستضاف حسابات التداول على بنية MT5 يوفرها شركاؤنا من مزودي التكنولوجيا والسيولة. لا نقدم أي استشارات استثمارية أو قانونية أو ضريبية، ولا يُعد أي محتوى على الموقع أو في البوابة توصية بالتداول.",
      ],
    },
    {
      heading: "3. الأهلية",
      bullets: [
        "يجب ألا يقل عمرك عن 18 عاماً وأن تتمتع بالأهلية القانونية الكاملة للالتزام بهذه الشروط.",
        "لا تُقدَّم الخدمات للمقيمين في الولايات المتحدة الأمريكية أو لأي شخص خاضع لعقوبات دولية، أو في أي بلد يكون فيه استخدامها مخالفاً للقانون.",
        "أنت مسؤول عن التأكد من أن استخدامك للخدمات قانوني في بلد إقامتك.",
        "يحق لنا رفض أي طلب أو إغلاق أي حساب وفق تقديرنا، بما في ذلك عند تعذر التحقق من هويتك.",
      ],
    },
    {
      heading: "4. فتح الحساب والتحقق",
      bullets: [
        "يجب أن تقدم معلومات كاملة ودقيقة ومحدّثة وأن تحافظ على تحديثها.",
        "سنطلب منك وثائق إثبات الهوية والعنوان، مثل جواز سفر ساري المفعول وإثبات عنوان حديث، وقد نطلب معلومات إضافية بما في ذلك مصدر أموالك.",
        "يجوز لنا تأخير الحساب أو تقييده أو إغلاقه إلى حين استكمال التحقق، أو إذا كانت المعلومات ناقصة أو متناقضة أو غير صحيحة.",
        "يحق لكل عميل امتلاك حساب واحد في البوابة ما لم نتفق خطياً على خلاف ذلك.",
      ],
    },
    {
      heading: "5. الإيداع والسحب",
      bullets: [
        "تظهر وسائل التمويل المتاحة في البوابة أو يزودك بها فريق الدعم. حالياً تتم عمليات الإيداع والسحب بعملة USDT على شبكة TRON (TRC-20).",
        "أرسل الأموال فقط إلى بيانات الدفع التي نزودك بها عبر قنوات Keystone FX الرسمية، وتحقق دائماً من عنوان المحفظة والشبكة قبل الإرسال.",
        "لا يمكن عكس التحويلات على البلوكتشين. لسنا مسؤولين عن الأموال المرسلة إلى عنوان خاطئ أو على شبكة خاطئة أو إلى بيانات لم نقدمها نحن.",
        "تُدفع عمليات السحب فقط إلى محفظة تعود ملكيتها إليك، بعد التحقق، وتخضع لتوفر الهامش الحر والمراجعة الداخلية. قد تُخصم رسوم الشبكة.",
        "لا نقبل الإيداع أو السحب من أو إلى أطراف ثالثة. يحق لنا رفض أي معاملة أو تأخيرها أو إعادتها إذا اشتبهنا في احتيال أو غسل أموال أو مخالفة لهذه الشروط.",
      ],
    },
    {
      heading: "6. التداول",
      bullets: [
        "أنت من يتخذ جميع قرارات التداول وتتحمل مسؤوليتها وحدك.",
        "تُنفَّذ الأوامر على منصة MT5 وفق ظروف السوق السائدة. قد تتغير الأسعار والفروقات (السبريد) وأسعار التبييت والرافعة المالية ومتطلبات الهامش، بما في ذلك دون إشعار في الأسواق سريعة الحركة.",
        "إذا انخفض مستوى الهامش إلى مستوى الإغلاق الإجباري (Stop-out)، فقد تُغلق المراكز المفتوحة تلقائياً بدءاً بالمركز الأقل ربحية.",
        "قد تعمل Keystone FX كطرف مقابل في صفقاتك أو قد تحيلها إلى مزودي السيولة. يرجى قراءة تحذير المخاطر لمعرفة ما يعنيه ذلك بالنسبة لك.",
        "يجوز تصحيح أو إلغاء الصفقات المنفذة بسعر خاطئ بشكل واضح بسبب خطأ في النظام أو في تغذية الأسعار.",
      ],
    },
    {
      heading: "7. التزاماتك",
      bullets: [
        "حافظ على سرية بيانات الدخول وأمان أجهزتك، وأبلغنا فوراً بأي دخول غير مصرح به.",
        "لا تستخدم الخدمات للاحتيال أو غسل الأموال أو تمويل الإرهاب أو لأي غرض غير قانوني.",
        "لا تمارس أساليب تداول تعسفية، بما في ذلك استغلال أخطاء الأسعار أو التأخير، أو استخدام برامج مصممة للتلاعب بالمنصة.",
      ],
    },
    {
      heading: "8. الرسوم والتكاليف",
      paragraphs: [
        "تظهر الفروقات والعمولات ورسوم التبييت وأي رسوم أخرى في البوابة أو في مواصفات العقود على منصة MT5، أو يتم إبلاغك بها قبل تطبيقها. تتحمل أنت رسوم شبكة البلوكتشين.",
      ],
    },
    {
      heading: "9. المكافآت والعروض الترويجية",
      paragraphs: [
        "تخضع أي مكافأة أو عرض ترويجي لشروطه المنشورة الخاصة به، ويجوز تعديله أو إلغاؤه في أي وقت، وقد يتطلب حجم تداول معيناً قبل أن يصبح قابلاً للسحب. يحق لنا إلغاء أي مكافأة وأي أرباح ناتجة عنها إذا رأينا أن العرض قد أسيء استخدامه.",
      ],
    },
    {
      heading: "10. التعليق والإغلاق",
      paragraphs: [
        "يمكنك إغلاق حسابك في أي وقت بالتواصل مع الدعم. ويجوز لنا تعليق حسابك أو إغلاقه إذا خالفت هذه الشروط، أو إذا اشتبهنا في احتيال أو نشاط غير قانوني، أو إذا اقتضى القانون ذلك.",
        "عند إغلاق الحساب، تُغلق المراكز المفتوحة بأسعار السوق ويُدفع أي رصيد متبقٍّ، بعد خصم الرسوم والمبالغ المستحقة، إلى محفظتك الموثقة. نحتفظ بالسجلات للمدد التي يفرضها القانون كما هو موضح في سياسة الخصوصية.",
      ],
    },
    {
      heading: "11. حدود المسؤولية",
      paragraphs: [
        "تُقدَّم الخدمات \"كما هي\" و\"حسب توفرها\". وفي الحدود التي يسمح بها القانون، لا تتحمل Keystone FX المسؤولية عن خسائر التداول أو فوات الأرباح أو الخسائر غير المباشرة أو التبعية، أو عن الانقطاعات أو الأعطال الناتجة عن الاتصال بالإنترنت أو منصة MT5 أو شبكات البلوكتشين أو مزودي الدفع أو أي أطراف ثالثة خارجة عن سيطرتنا.",
        "لا يحدّ أي بند في هذه الشروط من المسؤولية عن الاحتيال أو عن أي مسؤولية لا يجوز تحديدها قانوناً.",
      ],
    },
    {
      heading: "12. التعديلات على هذه الشروط",
      paragraphs: [
        "قد نقوم بتحديث هذه الشروط من وقت لآخر. تُنشر النسخة المحدثة على هذه الصفحة مع تاريخ \"آخر تحديث\" جديد. ويُعد استمرارك في استخدام الخدمات بعد أي تعديل قبولاً للشروط المحدثة.",
      ],
    },
    {
      heading: "13. الشكاوى والتواصل",
      paragraphs: [
        `لتقديم شكوى، راسلنا على ${CONTACT_EMAIL} مع ذكر اسمك والبريد الإلكتروني لحسابك ووصف للمشكلة. سنؤكد استلام شكواك خلال 5 أيام عمل ونسعى لتقديم رد كامل خلال 30 يوماً.`,
        "Keystone FX Ltd، جادة شارل حلو، أوتوستراد الدورة – بيروت، برج حمود، بيروت، لبنان.",
      ],
    },
    {
      heading: "14. القانون الواجب التطبيق",
      paragraphs: [
        "تخضع هذه الشروط لقوانين الدولة التي تأسست فيها شركة Keystone FX Ltd، وتختص محاكم تلك الدولة بالنظر في أي نزاع.",
      ],
    },
  ],
};

const privacyAr: LegalDoc = {
  title: "سياسة الخصوصية",
  summary:
    "توضح هذه السياسة المعلومات الشخصية التي تجمعها Keystone FX، وسبب جمعها، والجهات التي نشاركها معها، والخيارات المتاحة لك.",
  sections: [
    {
      heading: "1. من نحن",
      paragraphs: [
        `شركة Keystone FX Ltd (\"Keystone FX\" أو \"نحن\") هي المسؤولة عن المعلومات الشخصية الموضحة في هذه السياسة. يمكنك التواصل معنا عبر ${CONTACT_EMAIL} أو على العنوان: جادة شارل حلو، أوتوستراد الدورة – بيروت، برج حمود، بيروت، لبنان.`,
      ],
    },
    {
      heading: "2. المعلومات التي نجمعها",
      bullets: [
        "بيانات الهوية: الاسم وتاريخ الميلاد والجنسية ونسخ من وثائق الهوية مثل جواز السفر.",
        "بيانات الاتصال: البريد الإلكتروني ورقم الهاتف وعنوان السكن.",
        "الملف المالي: الوضع الوظيفي ونطاق الدخل ومصدر الأموال والخبرة في التداول.",
        "الإقرارات: الإقامة الضريبية والرقم الضريبي، وما إذا كنت شخصاً معرضاً سياسياً أو شخصاً أمريكياً.",
        "بيانات الحساب والمعاملات: أرقام حسابات MT5 والإيداعات والسحوبات وعناوين المحافظ ومراجع المعاملات على البلوكتشين.",
        "المراسلات: تذاكر الدعم والرسائل الإلكترونية والرسائل التي ترسلها إلينا، بما في ذلك عبر واتساب.",
        "البيانات التقنية: عنوان IP ومعلومات الجهاز والمتصفح وبيانات استخدام الموقع التي تُجمع عبر ملفات تعريف الارتباط وأدوات التحليل.",
      ],
    },
    {
      heading: "3. كيف نستخدم معلوماتك",
      bullets: [
        "لفتح حسابك وحسابات التداول الخاصة بك وتشغيلها وإدارتها.",
        "للتحقق من هويتك وإجراء فحوصات مكافحة غسل الأموال والعقوبات والاحتيال.",
        "لمعالجة الإيداعات والسحوبات.",
        "للرد على استفساراتك وتقديم الدعم.",
        "للحفاظ على أمان الخدمات واكتشاف إساءة الاستخدام ومنعها.",
        "للوفاء بالتزاماتنا القانونية ومتطلبات حفظ السجلات.",
        "لإرسال رسائل الخدمة المتعلقة بحسابك. لا نرسل رسائل تسويقية إلا بموافقتك، ويمكنك إلغاء الاشتراك في أي وقت.",
      ],
    },
    {
      heading: "4. الأسس القانونية",
      paragraphs: [
        "نعالج معلوماتك لأنها ضرورية لتقديم الخدمات التي طلبتها (العقد)، أو للامتثال للالتزامات القانونية، أو لمصالحنا المشروعة في إدارة عمل آمن، أو بموافقتك حيثما تكون الموافقة مطلوبة.",
      ],
    },
    {
      heading: "5. الجهات التي نشاركها معها",
      bullets: [
        "مزودو الخدمات الذين يستضيفون أنظمتنا ويشغلونها، مثل مزودي الاستضافة السحابية وقواعد البيانات (على سبيل المثال Vercel وSupabase) ومزودي خدمة إرسال البريد الإلكتروني.",
        "مزودو التحليلات (Google Analytics) لإحصاءات الموقع المجمعة.",
        "شركاؤنا في منصة التداول والسيولة، لفتح حسابات MT5 الخاصة بك وتشغيلها.",
        "المستشارون المهنيون مثل المحامين والمدققين.",
        "المحاكم والجهات التنظيمية وجهات إنفاذ القانون عندما يُلزمنا القانون بذلك.",
      ],
      paragraphs: [
        "عناوين المحافظ والمعاملات على شبكات البلوكتشين العامة مثل TRON مرئية للجميع. نحن لا نبيع معلوماتك الشخصية.",
      ],
    },
    {
      heading: "6. النقل الدولي للبيانات",
      paragraphs: [
        "قد يخزن مزودو خدماتنا المعلومات أو يعالجونها في دول غير بلدك. وفي هذه الحالة، نتخذ خطوات معقولة لضمان بقاء معلوماتك محمية.",
      ],
    },
    {
      heading: "7. مدة الاحتفاظ بالبيانات",
      paragraphs: [
        "نحتفظ بمعلوماتك طوال فترة فتح حسابك ولمدة خمس سنوات على الأقل بعد إغلاقه، للوفاء بمتطلبات مكافحة غسل الأموال وحفظ السجلات، أو لمدة أطول إذا اقتضى القانون ذلك.",
      ],
    },
    {
      heading: "8. الأمان",
      paragraphs: [
        "نستخدم التشفير أثناء النقل وضوابط الوصول وتقييد وصول الموظفين لحماية معلوماتك. لا يوجد نظام آمن تماماً، لذا يرجى أيضاً حماية كلمة المرور وأجهزتك.",
      ],
    },
    {
      heading: "9. حقوقك",
      paragraphs: [
        `بحسب بلد إقامتك، قد يحق لك الاطلاع على معلوماتك أو تصحيحها أو حذفها، والاعتراض على بعض أشكال المعالجة أو تقييدها، وسحب موافقتك، والحصول على نسخة من بياناتك. لتقديم طلب، راسلنا على ${CONTACT_EMAIL}. قد نحتاج إلى التحقق من هويتك أولاً، كما يجب الاحتفاظ ببعض المعلومات للوفاء بالالتزامات القانونية.`,
      ],
    },
    {
      heading: "10. ملفات تعريف الارتباط والتحليلات",
      paragraphs: [
        "نستخدم ملفات تعريف ارتباط أساسية لإبقائك مسجلاً للدخول في البوابة، وأداة Google Analytics لفهم كيفية استخدام الموقع. يمكنك حظر ملفات تعريف الارتباط أو حذفها من إعدادات المتصفح، وقد لا تعمل البوابة بشكل صحيح دون ملفات تعريف الارتباط الأساسية.",
      ],
    },
    {
      heading: "11. القاصرون",
      paragraphs: ["الخدمات غير مخصصة لمن هم دون 18 عاماً، ولا نجمع معلوماتهم عن علم."],
    },
    {
      heading: "12. التعديلات على هذه السياسة",
      paragraphs: [
        "قد نقوم بتحديث هذه السياسة من وقت لآخر. ستكون أحدث نسخة متاحة دائماً على هذه الصفحة مع تاريخ \"آخر تحديث\".",
      ],
    },
  ],
};

const riskAr: LegalDoc = {
  title: "تحذير المخاطر",
  summary:
    "قبل أن تبدأ التداول، تأكد من فهمك للمخاطر الموضحة أدناه. إذا كان أي شيء غير واضح، فاطلب استشارة مستقلة.",
  callout:
    "ينطوي تداول العملات الأجنبية وعقود الفروقات وغيرها من المنتجات ذات الرافعة المالية على درجة عالية من المخاطر، وقد لا يكون مناسباً للجميع. قد تخسر جميع الأموال التي تودعها. لا تتداول إلا بأموال يمكنك تحمّل خسارتها.",
  sections: [
    {
      heading: "1. الرافعة المالية",
      paragraphs: [
        "تتيح لك الرافعة المالية فتح مراكز أكبر بكثير من إيداعك، لكنها تضاعف الخسائر كما تضاعف الأرباح؛ فحركة سعرية صغيرة عكس اتجاهك قد تمحو رصيدك بسرعة.",
      ],
    },
    {
      heading: "2. تقلبات السوق والفجوات السعرية",
      paragraphs: [
        "قد تتحرك الأسعار بسرعة كبيرة، خصوصاً عند صدور الأخبار الاقتصادية وافتتاح الأسواق وفي عطلات نهاية الأسبوع. قد يُنفَّذ أمرك بسعر أسوأ من السعر المطلوب (الانزلاق السعري)، ولا تضمن أوامر وقف الخسارة حداً أقصى للخسارة عند حدوث فجوات سعرية.",
      ],
    },
    {
      heading: "3. نداءات الهامش والإغلاق الإجباري",
      paragraphs: [
        "يجب أن تحتفظ بهامش كافٍ في حسابك لدعم المراكز المفتوحة. إذا انخفض مستوى الهامش كثيراً، فقد تُغلق مراكزك تلقائياً بسعر السوق السائد دون إشعار إضافي، وقد تخسر رصيدك بالكامل.",
      ],
    },
    {
      heading: "4. الطرف المقابل وتضارب المصالح",
      paragraphs: [
        "قد تعمل Keystone FX كطرف مقابل في صفقاتك، أو قد تحيلها إلى مزودي السيولة. وعندما تكون Keystone FX هي الطرف المقابل، فقد تكون خسارتك ربحاً لنا. نحن ندير هذا التضارب من خلال ممارسات التنفيذ لدينا، لكن يجب أن تكون على علم به.",
        "كما تعتمد أموالك ومراكزك على استمرار عمل Keystone FX وشركائها من مزودي التكنولوجيا والسيولة.",
      ],
    },
    {
      heading: "5. العملات المشفرة والتمويل بعملة USDT",
      bullets: [
        "تعتمد عمليات الإيداع والسحب بعملة USDT على حفاظ هذه العملة المستقرة على قيمتها مقابل الدولار الأمريكي، وهذا غير مضمون.",
        "التحويلات على البلوكتشين غير قابلة للعكس. الأموال المرسلة إلى عنوان خاطئ أو على شبكة خاطئة تضيع عادةً بشكل نهائي.",
        "قد يؤدي ازدحام الشبكة إلى تأخير التحويلات وتغيير رسوم الشبكة.",
        "عقود الفروقات على العملات المشفرة شديدة التقلب وقد تتحرك بمقادير كبيرة خلال وقت قصير.",
      ],
    },
    {
      heading: "6. المخاطر التقنية",
      paragraphs: [
        "يعتمد التداول على اتصالك بالإنترنت وجهازك ومنصة MT5 وأنظمة شركائنا. قد تمنعك الانقطاعات أو التأخيرات أو الأخطاء من فتح المراكز أو إغلاقها في الوقت الذي تريده.",
      ],
    },
    {
      heading: "7. المخاطر التنظيمية والقانونية",
      paragraphs: [
        "Keystone FX غير مرخصة من قبل جهة رقابية مالية في بلدك. وقد لا تتمتع بالحماية، مثل صناديق التعويض أو خدمات أمين المظالم، التي تنطبق عند التعامل مع شركة خاضعة للرقابة المحلية. تقع على عاتقك مسؤولية التأكد من أن التداول قانوني في بلد إقامتك.",
      ],
    },
    {
      heading: "8. لا استشارات والأداء السابق",
      paragraphs: [
        "لا تقدم Keystone FX استشارات استثمارية. أي معلومات عن السوق هي معلومات عامة وليست توصية. الأداء السابق ليس مؤشراً موثوقاً على النتائج المستقبلية.",
      ],
    },
    {
      heading: "9. المكافآت",
      paragraphs: [
        "لا تقلل المكافآت والعروض الترويجية من المخاطر التي تتحملها. وقد تدفعك شروط التداول المرتبطة بالمكافأة إلى التداول أكثر مما كنت ستفعل عادةً.",
      ],
    },
    {
      heading: "10. افهم ما تتداوله",
      paragraphs: [
        "قبل تداول أي أداة، راجع مواصفات العقد الخاصة بها على منصة MT5، بما في ذلك الرافعة المالية والهامش وساعات التداول ورسوم التبييت. إذا لم تكن تفهم المخاطر بشكل كامل، فلا تتداول.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* CHINESE (SIMPLIFIED)                                                */
/* ------------------------------------------------------------------ */

const termsZh: LegalDoc = {
  title: "服务条款",
  summary: "本条款规定您对 keystone-fx.com 及 Keystone FX 客户门户的使用。开户前请仔细阅读。",
  sections: [
    {
      heading: "1. 关于本条款",
      paragraphs: [
        "本服务条款（\"本条款\"）适用于由 Keystone FX Ltd（\"Keystone FX\"或\"我们\"）运营的 keystone-fx.com 网站、Keystone FX 客户门户及所有相关服务（统称\"服务\"）。",
        "注册账户或使用服务，即表示您确认已阅读、理解并接受本条款、我们的隐私政策和风险警示。如您不同意，请勿使用服务。",
      ],
    },
    {
      heading: "2. 我们的服务",
      paragraphs: [
        "Keystone FX 提供客户门户，用于客户注册与身份验证、在 MetaTrader 5（MT5）平台上开立和管理交易账户、通过我们提供的支付方式处理入金和出金申请，以及客户支持。",
        "交易账户托管于由我们的第三方技术和流动性合作伙伴提供的 MT5 基础设施上。我们不提供投资、法律或税务建议，网站或门户中的任何内容均不构成交易建议。",
      ],
    },
    {
      heading: "3. 资格要求",
      bullets: [
        "您必须年满 18 周岁，并具有签订本条款的完全民事行为能力。",
        "我们不向美国居民、受国际制裁的任何人士，或在使用服务属违法的任何司法管辖区提供服务。",
        "您有责任确认在您居住的国家使用服务是合法的。",
        "我们可自行决定拒绝任何申请或关闭任何账户，包括无法核实您身份的情况。",
      ],
    },
    {
      heading: "4. 开户与身份验证",
      bullets: [
        "您必须提供完整、准确、最新的信息，并保持更新。",
        "我们将要求您提供身份及地址证明文件，例如有效护照和近期地址证明，并可能要求提供更多信息，包括资金来源。",
        "在验证完成之前，或信息缺失、不一致或不真实时，我们可延迟、限制或关闭账户。",
        "除非我们另行书面同意，每位客户只能持有一个门户账户。",
      ],
    },
    {
      heading: "5. 入金与出金",
      bullets: [
        "可用的入金方式会在门户中显示或由我们的支持团队提供。目前，入金和出金均通过 TRON（TRC-20）网络上的 USDT 进行。",
        "请仅向通过 Keystone FX 官方渠道提供给您的支付信息汇款。汇款前务必核对钱包地址和网络。",
        "区块链转账不可撤销。对于发送到错误地址、错误网络或非我们提供的支付信息的资金，我们概不负责。",
        "出金仅支付至属于您本人的钱包，须经过验证，并以可用预付款和内部审核为前提。可能会扣除网络手续费。",
        "我们不接受第三方入金或出金。如怀疑存在欺诈、洗钱或违反本条款的情况，我们可拒绝、延迟或退回任何交易。",
      ],
    },
    {
      heading: "6. 交易",
      bullets: [
        "所有交易决定均由您做出，并由您独自承担责任。",
        "订单在 MT5 上按当时的市场条件执行。价格、点差、隔夜利息、杠杆和保证金要求可能发生变化，在市场快速波动时可能不另行通知。",
        "如您的保证金水平降至强制平仓水平，未平仓头寸可能被自动平仓，从亏损最大的头寸开始。",
        "Keystone FX 可能作为您交易的对手方，也可能将交易转给流动性提供商。请阅读风险警示，了解这对您意味着什么。",
        "因系统、报价源或报价错误而以明显错误价格成交的交易，可能被更正或取消。",
      ],
    },
    {
      heading: "7. 您的义务",
      bullets: [
        "妥善保管您的登录信息和设备，如发现任何未经授权的访问，请立即通知我们。",
        "不得将服务用于欺诈、洗钱、恐怖融资或任何其他非法目的。",
        "不得从事滥用性交易行为，包括利用价格或延迟错误，或使用旨在操纵平台的软件。",
      ],
    },
    {
      heading: "8. 费用",
      paragraphs: [
        "点差、佣金、隔夜利息及任何其他费用会显示在门户或 MT5 合约规格中，或在收取前告知您。区块链网络手续费由您承担。",
      ],
    },
    {
      heading: "9. 赠金与促销活动",
      paragraphs: [
        "任何赠金或促销活动均受其自身公布的条款约束，可随时更改或撤销，并可能要求达到一定交易量后方可提取。如我们认为促销活动被滥用，可取消相关赠金及由此产生的任何盈利。",
      ],
    },
    {
      heading: "10. 暂停与关闭账户",
      paragraphs: [
        "您可随时联系客服关闭账户。如您违反本条款、我们怀疑存在欺诈或其他违法活动，或法律要求，我们可暂停或关闭您的账户。",
        "账户关闭时，未平仓头寸将按市场价格平仓，扣除费用及欠款后的剩余余额将支付至您已验证的钱包。我们将按照法律要求的期限保存记录，详见隐私政策。",
      ],
    },
    {
      heading: "11. 责任限制",
      paragraphs: [
        "服务按\"现状\"和\"现有\"基础提供。在法律允许的范围内，Keystone FX 不对交易亏损、利润损失、间接或后果性损失承担责任，也不对互联网连接、MT5 平台、区块链网络、支付服务商或我们无法控制的其他第三方造成的中断或故障承担责任。",
        "本条款中的任何内容均不限制对欺诈的责任或依法不得限制的任何责任。",
      ],
    },
    {
      heading: "12. 条款变更",
      paragraphs: [
        "我们可能不时更新本条款。更新后的版本将发布在本页面并标注新的\"最后更新\"日期。变更后继续使用服务即表示您接受更新后的条款。",
      ],
    },
    {
      heading: "13. 投诉与联系方式",
      paragraphs: [
        `如需投诉，请发送电子邮件至 ${CONTACT_EMAIL}，注明您的姓名、账户邮箱及问题描述。我们将在 5 个工作日内确认收到投诉，并力争在 30 天内给予完整答复。`,
        "Keystone FX Ltd，黎巴嫩贝鲁特 Bourj Hammoud，Dora – 贝鲁特高速公路，Charles Helou 大道。",
      ],
    },
    {
      heading: "14. 适用法律",
      paragraphs: ["本条款受 Keystone FX Ltd 注册成立地司法管辖区的法律管辖，任何争议由该司法管辖区的法院管辖。"],
    },
  ],
};

const privacyZh: LegalDoc = {
  title: "隐私政策",
  summary: "本政策说明 Keystone FX 收集哪些个人信息、收集的原因、与谁共享，以及您享有的选择权。",
  sections: [
    {
      heading: "1. 关于我们",
      paragraphs: [
        `Keystone FX Ltd（\"Keystone FX\"或\"我们\"）负责本政策所述的个人信息。您可通过 ${CONTACT_EMAIL} 或以下地址联系我们：黎巴嫩贝鲁特 Bourj Hammoud，Dora – 贝鲁特高速公路，Charles Helou 大道。`,
      ],
    },
    {
      heading: "2. 我们收集的信息",
      bullets: [
        "身份信息：姓名、出生日期、国籍，以及护照等身份证件副本。",
        "联系信息：电子邮箱、电话号码和居住地址。",
        "财务信息：就业状况、收入范围、资金来源和交易经验。",
        "声明信息：税务居民身份、税务识别号，以及您是否为政治公众人物或美国人士。",
        "账户及交易数据：MT5 账号、入金、出金、钱包地址和区块链交易记录。",
        "通讯记录：您发送给我们的支持工单、电子邮件和消息，包括通过 WhatsApp 发送的消息。",
        "技术数据：IP 地址、设备和浏览器信息，以及通过 Cookie 和分析工具收集的网站使用数据。",
      ],
    },
    {
      heading: "3. 我们如何使用您的信息",
      bullets: [
        "开立、运营和管理您的账户及交易账户。",
        "核实您的身份，并进行反洗钱、制裁和反欺诈审查。",
        "处理入金和出金。",
        "回答您的问题并提供支持。",
        "保障服务安全，发现并防止滥用行为。",
        "履行我们的法律义务和记录保存义务。",
        "向您发送与账户相关的服务通知。仅在您同意的情况下我们才会发送营销信息，您可随时退订。",
      ],
    },
    {
      heading: "4. 法律依据",
      paragraphs: [
        "我们处理您的信息，是因为这是提供您所要求服务的必要条件（合同）、为履行法律义务、出于我们安全经营的正当利益，或在需要时基于您的同意。",
      ],
    },
    {
      heading: "5. 信息共享对象",
      bullets: [
        "为我们托管和运行系统的服务提供商，例如云托管和数据库服务商（如 Vercel 和 Supabase）以及电子邮件发送服务商。",
        "分析服务提供商（Google Analytics），用于网站汇总统计。",
        "我们的交易平台和流动性合作伙伴，用于开立和运营您的 MT5 账户。",
        "律师、审计师等专业顾问。",
        "在法律要求时，向法院、监管机构和执法机关提供。",
      ],
      paragraphs: ["TRON 等公共区块链上的钱包地址和交易对所有人可见。我们不会出售您的个人信息。"],
    },
    {
      heading: "6. 跨境传输",
      paragraphs: ["我们的服务提供商可能在您所在国家以外的地区存储或处理信息。在此情况下，我们会采取合理措施确保您的信息继续受到保护。"],
    },
    {
      heading: "7. 保存期限",
      paragraphs: [
        "我们在您的账户存续期间及账户关闭后至少五年内保存您的信息，以满足反洗钱和记录保存要求；如法律另有要求，保存期限会更长。",
      ],
    },
    {
      heading: "8. 安全",
      paragraphs: ["我们采用传输加密、访问控制和限制员工访问等措施保护您的信息。没有任何系统是绝对安全的，因此也请您妥善保护您的密码和设备。"],
    },
    {
      heading: "9. 您的权利",
      paragraphs: [
        `根据您所在地区，您可能有权查阅、更正或删除您的信息，反对或限制某些处理，撤回同意，以及获取您的数据副本。如需提出请求，请发送电子邮件至 ${CONTACT_EMAIL}。我们可能需要先核实您的身份，且部分信息须为履行法律义务而保留。`,
      ],
    },
    {
      heading: "10. Cookie 与分析",
      paragraphs: [
        "我们使用必要的 Cookie 来保持您在门户中的登录状态，并使用 Google Analytics 了解网站的使用情况。您可以在浏览器设置中阻止或删除 Cookie；缺少必要的 Cookie 时，门户可能无法正常运行。",
      ],
    },
    {
      heading: "11. 未成年人",
      paragraphs: ["服务不面向 18 岁以下人士，我们不会故意收集其信息。"],
    },
    {
      heading: "12. 政策变更",
      paragraphs: ["我们可能不时更新本政策。最新版本将始终发布在本页面，并注明\"最后更新\"日期。"],
    },
  ],
};

const riskZh: LegalDoc = {
  title: "风险警示",
  summary: "开始交易前，请确保您了解以下所述风险。如有任何不明之处，请寻求独立意见。",
  callout:
    "外汇、差价合约（CFD）及其他杠杆产品交易具有高风险，并非适合所有人。您可能损失全部入金。请仅使用您能够承受损失的资金进行交易。",
  sections: [
    {
      heading: "1. 杠杆",
      paragraphs: ["杠杆使您能够开立远大于入金金额的头寸。它在放大盈利的同时也会放大亏损：价格朝不利方向的小幅波动就可能迅速耗尽您的余额。"],
    },
    {
      heading: "2. 市场波动与价格跳空",
      paragraphs: [
        "价格可能剧烈变动，尤其是在经济数据公布、市场开盘和周末前后。您的订单可能以比请求价格更差的价格成交（滑点），在价格跳空时，止损单无法保证最大亏损金额。",
      ],
    },
    {
      heading: "3. 追加保证金与强制平仓",
      paragraphs: [
        "您必须在账户中保持足够的保证金以维持未平仓头寸。如保证金水平过低，您的头寸可能在不另行通知的情况下按当时市价被自动平仓，您可能损失全部余额。",
      ],
    },
    {
      heading: "4. 交易对手与利益冲突",
      paragraphs: [
        "Keystone FX 可能作为您交易的对手方，也可能将交易转给流动性提供商。当 Keystone FX 作为对手方时，您的亏损可能成为我们的盈利。我们通过执行规范管理这一利益冲突，但您应知悉这一点。",
        "您的资金和头寸还取决于 Keystone FX 及其技术和流动性合作伙伴的持续运营。",
      ],
    },
    {
      heading: "5. 加密货币与 USDT 资金",
      bullets: [
        "以 USDT 进行的入金和出金依赖于该稳定币与美元保持等值，而这并无保证。",
        "区块链转账不可撤销。发送到错误地址或错误网络的资金通常会永久丢失。",
        "网络拥堵可能导致转账延迟并改变网络手续费。",
        "加密货币差价合约波动极大，可能在短时间内大幅变动。",
      ],
    },
    {
      heading: "6. 技术风险",
      paragraphs: ["交易依赖于您的网络连接、设备、MT5 平台以及我们合作伙伴的系统。中断、延迟或错误可能使您无法在希望的时间开仓或平仓。"],
    },
    {
      heading: "7. 监管与法律风险",
      paragraphs: [
        "Keystone FX 未获得您所在国家金融监管机构的授权。您可能无法享有与本地受监管公司交易时适用的保护，例如投资者赔偿计划或金融申诉服务。您有责任确认在您居住的地方进行交易是合法的。",
      ],
    },
    {
      heading: "8. 不构成建议及过往表现",
      paragraphs: ["Keystone FX 不提供投资建议。任何市场信息均为一般性信息，不构成建议。过往表现并非未来结果的可靠指标。"],
    },
    {
      heading: "9. 赠金",
      paragraphs: ["赠金和促销活动不会降低您的风险。赠金附带的交易条件可能促使您进行超出本意的交易。"],
    },
    {
      heading: "10. 了解您交易的产品",
      paragraphs: ["交易任何产品之前，请在 MT5 中查看其合约规格，包括杠杆、保证金、交易时间和隔夜利息。如您未完全了解相关风险，请勿交易。"],
    },
  ],
};

export const LEGAL_DOCS: Record<LegalDocKey, Record<Lang, LegalDoc>> = {
  terms: { en: termsEn, ar: termsAr, zh: termsZh },
  privacy: { en: privacyEn, ar: privacyAr, zh: privacyZh },
  risk: { en: riskEn, ar: riskAr, zh: riskZh },
};

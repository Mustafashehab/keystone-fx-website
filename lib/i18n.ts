export type Lang = "en" | "ar" | "zh";
export const isRTL = (lang: Lang) => lang === "ar";

const dict = {
  en: {
    hero: {
      title: "Precision Execution. Intelligent Infrastructure.",
      subtitle:
        "Keystone FX delivers a professional trading environment built for speed, control, and institutional reliability.",
    },
    nav: {
      products: "Products",
      platforms: "Platforms",
      accounts: "Accounts",
      blog: "Blog",
      about: "About",
      contact: "Contact",
      signin: "Sign In",
    },
    products: {
      title: "Trading Products",
      subtitle: "Access global markets with institutional-grade execution, deep liquidity, and professional trading conditions across multiple asset classes.",
      forexPairs: {
        title: "Forex Pairs",
        description: "Access 60+ major, minor, and exotic currency pairs with institutional-grade execution.",
        features: [
          "Spreads from 0.0 pips on majors",
          "No dealing desk intervention",
          "Deep liquidity pool aggregation",
          "24/5 market access"
        ],
        specs: {
          pairs: "Available Pairs",
          pairsValue: "60+",
          leverage: "Leverage",
          leverageValue: "Up to 1:500",
          minTrade: "Min Trade Size",
          minTradeValue: "0.01 lots"
        }
      },
      indices: {
        title: "Indices",
        description: "Trade global stock indices with tight spreads and fast execution on major markets.",
        features: [
          "US, EU, and Asian indices",
          "Extended trading hours",
          "No expiry dates on CFDs",
          "Fractional trading available"
        ],
        specs: {
          markets: "Markets",
          marketsValue: "15+",
          leverage: "Leverage",
          leverageValue: "Up to 1:200",
          hours: "Trading Hours",
          hoursValue: "23/5"
        }
      },
      commodities: {
        title: "Commodities",
        description: "Diversify with gold, silver, oil, and agricultural products through CFD trading.",
        features: [
          "Precious metals (Gold, Silver, Platinum)",
          "Energy products (Crude, Natural Gas)",
          "Agricultural commodities",
          "Low margin requirements"
        ],
        specs: {
          products: "Products",
          productsValue: "20+",
          leverage: "Leverage",
          leverageValue: "Up to 1:100",
          depth: "Market Depth",
          depthValue: "Level II"
        }
      },
      cryptocurrencies: {
        title: "Cryptocurrencies",
        description: "Trade Bitcoin, Ethereum, and major altcoins with 24/7 availability and no wallet needed.",
        features: [
          "Major crypto pairs vs USD/EUR",
          "24/7 trading, including weekends",
          "No wallet or exchange required",
          "Tight spreads on Bitcoin"
        ],
        specs: {
          assets: "Crypto Assets",
          assetsValue: "15+",
          leverage: "Leverage",
          leverageValue: "Up to 1:50",
          availability: "Availability",
          availabilityValue: "24/7"
        }
      },
      stocksCfds: {
        title: "Stocks CFDs",
        description: "Trade shares of leading companies from global exchanges without owning the underlying asset.",
        features: [
          "US, European, and Asian stocks",
          "Go long or short",
          "No stamp duty or commissions",
          "Corporate actions reflected"
        ],
        specs: {
          stocks: "Available Stocks",
          stocksValue: "500+",
          leverage: "Leverage",
          leverageValue: "Up to 1:20",
          exchanges: "Exchanges",
          exchangesValue: "10+"
        }
      },
      bondsEtfs: {
        title: "Bonds & ETFs",
        description: "Access government bonds and exchange-traded funds for portfolio diversification.",
        features: [
          "Major government bonds",
          "Sector-specific ETFs",
          "Global market exposure",
          "Low trading costs"
        ],
        specs: {
          instruments: "Instruments",
          instrumentsValue: "100+",
          leverage: "Leverage",
          leverageValue: "Up to 1:50",
          markets: "Markets",
          marketsValue: "Global"
        }
      },
      cta: {
        title: "Ready to Start Trading?",
        subtitle: "Open an account in minutes and access all our trading products with competitive spreads and fast execution.",
        liveAccount: "Open Live Account",
        demoAccount: "Try Demo Account"
      }
    },
    about: {
      title: "About Keystone FX",
      subtitle: "Building the future of institutional-grade forex trading through precision, transparency, and cutting-edge technology.",
      mission: {
        title: "Our Mission",
        text1: "At Keystone FX, we believe that every trader deserves access to institutional-grade infrastructure, whether you're managing millions or starting your trading journey.",
        text2: "We've built our platform from the ground up with a single focus: providing the fastest, most reliable, and most transparent trading environment in the industry."
      },
      values: [
        "Transparency in all operations",
        "Cutting-edge execution technology",
        "Client fund security",
        "Regulatory compliance"
      ],
      stats: [
        { value: "50K+", label: "Active Traders" },
        { value: "$2B+", label: "Monthly Volume" },
        { value: "8ms", label: "Avg Execution" },
        { value: "99.99%", label: "Uptime" }
      ],
      whyUs: {
        title: "Why Choose Keystone FX",
        reasons: [
          {
            icon: "⚡",
            title: "Lightning-Fast Execution",
            description: "Our infrastructure is built for speed. Average execution times under 10ms ensure you never miss a trading opportunity."
          },
          {
            icon: "🔒",
            title: "Bank-Grade Security",
            description: "Client funds held in segregated accounts with tier-1 banks. Your capital security is our top priority."
          },
          {
            icon: "📊",
            title: "Institutional Liquidity",
            description: "Access deep liquidity pools from multiple tier-1 providers for the tightest spreads and best execution."
          }
        ]
      },
      regulation: {
        title: "Regulated & Trusted",
        text: "Keystone FX operates under strict regulatory oversight to ensure the highest standards of client protection and operational integrity.",
        badges: [
          "FCA Regulated",
          "CySEC Licensed",
          "ASIC Authorized"
        ]
      },
      cta: {
        title: "Ready to Experience the Difference?",
        subtitle: "Join thousands of traders who trust Keystone FX for their trading needs.",
        contact: "Contact Us",
        learn: "Learn More"
      }
    },
    accounts: {
      title: "Your Trading Journey Starts Here",
      subtitle: "Open a premium trading account in minutes. Experience institutional-grade execution, advanced tools, and professional support on a platform built for success.",
      startTrading: "Start Trading Now",
      openAccount: "Open Free Account",
      hero: {
        badge: "Instant Account Opening",
        traders: "Active Traders",
        volume: "Monthly Volume",
        execution: "Avg Execution",
        support: "Customer Support"
      },
      features: {
        title: "Trade with Confidence",
        subtitle: "Experience the Keystone FX advantage with cutting-edge technology and professional support.",
        global: {
          title: "Global Market Access",
          description: "Trade on major financial exchanges worldwide with secure accounts accessible from any device, anytime."
        },
        secure: {
          title: "Bank-Level Security",
          description: "Your funds are protected in segregated tier-1 bank accounts with advanced encryption and security protocols."
        },
        fast: {
          title: "Lightning Execution",
          description: "Experience average execution speeds of 8ms with our advanced infrastructure and deep liquidity pools."
        }
      },
      steps: {
        title: "Get Started in 3 Simple Steps",
        subtitle: "Start your trading journey today with our seamless onboarding process",
        list: [
          {
            title: "Create Your Account",
            description: "Quick registration in minutes. We'll ask for basic details to set up your professional trading account."
          },
          {
            title: "Fund Your Account",
            description: "Deposit securely using credit cards, bank transfers, eWallets, or local payment solutions with instant processing."
          },
          {
            title: "Start Trading",
            description: "Access global markets with professional tools, real-time data, expert support, and instant notifications."
          }
        ]
      },
      bonus: {
        badge: "Limited Time Offer",
        title: "Get 30% Bonus on Your First Deposit!",
        terms: "Claim your welcome bonus today. Terms and conditions apply."
      },
      compare: {
        title: "Choose Your Perfect Account",
        subtitle: "Flexible leverage up to 1:2000, tight spreads, and professional trading conditions tailored to your needs.",
        minDeposit: "Minimum Deposit",
        leverage: "Maximum Leverage",
        select: "Select Account",
        popular: "Most Popular"
      },
      types: {
        standard: {
          name: "Standard Account",
          features: [
            "Perfect for beginners",
            "Standard market spreads",
            "No commission fees",
            "24/6 customer support",
            "Free educational resources"
          ]
        },
        pro: {
          name: "Pro Account",
          features: [
            "For experienced traders",
            "Tighter spreads",
            "Priority customer support",
            "Advanced trading tools",
            "Market analysis & signals"
          ]
        },
        vip: {
          name: "VIP Account",
          features: [
            "For professional traders",
            "Raw ECN spreads",
            "Dedicated account manager",
            "Exclusive trading benefits",
            "Premium research & insights"
          ]
        }
      },
      finalCta: {
        title: "Ready to Join 50,000+ Traders?",
        subtitle: "Experience the difference of trading with a broker that puts your success first. Open your account today and start trading with confidence."
      }
    },
    contact: {
      hero: {
        badge: "We're Here to Help",
        title: "Get in Touch",
        subtitle: "Have questions? Our dedicated support team is available 24/5 during market hours to assist you with anything you need."
      },
      info: {
        phone: {
          title: "Call Us",
          description: "Speak with our team directly"
        },
        email: {
          title: "Email Us",
          description: "Send us a message anytime"
        },
        hours: {
          title: "Support Hours",
          description: "Available when markets are open",
          note: "Monday to Friday"
        }
      },
      form: {
        title: "Send Us a Message",
        subtitle: "Fill out the form below and we'll get back to you as soon as possible.",
        fullName: "Full Name",
        fullNamePlaceholder: "Enter your full name",
        email: "Email Address",
        emailPlaceholder: "your.email@example.com",
        phone: "Phone Number",
        phonePlaceholder: "+1 (555) 000-0000",
        topic: "Topic",
        topicPlaceholder: "Select a topic",
        topics: {
          accounts: "Accounts",
          platform: "Platform",
          funding: "Funding",
          partnership: "IB / Partnership",
          other: "Other"
        },
        message: "Message",
        messagePlaceholder: "Tell us how we can help you...",
        submit: "Send Message",
        successMessage: "Thank you! We've received your message and will respond shortly."
      },
      location: {
        title: "Visit Our Office",
        viewMap: "View Larger Map"
      },
      disclaimer: {
        title: "Disclaimer:",
        text: "Information on this website is for general purposes only and does not constitute investment advice."
      },
      cta: {
        title: "Ready to Start Trading?",
        subtitle: "Open your account today and join thousands of successful traders worldwide.",
        button: "Open Account Now"
      }
    },
    footer: {
      title: "Risk Disclaimer",
      disclaimer: "Trading FX, CFDs, metals, and crypto involves substantial risk and may result in the loss of your invested capital. Information provided is not investment advice. Past performance is not indicative of future results."
    }
  },
  ar: {
    hero: {
      title: "تنفيذ دقيق. بنية ذكية.",
      subtitle:
        "توفر Keystone FX بيئة تداول احترافية مصممة للسرعة والتحكم والاعتمادية المؤسسية.",
    },
    nav: {
      products: "المنتجات",
      platforms: "المنصات",
      accounts: "الحسابات",
      blog: "المدونة",
      about: "من نحن",
      contact: "اتصل بنا",
      signin: "تسجيل الدخول",
    },
    products: {
      title: "منتجات التداول",
      subtitle: "الوصول إلى الأسواق العالمية بتنفيذ مؤسسي، سيولة عميقة، وشروط تداول احترافية عبر فئات أصول متعددة.",
      forexPairs: {
        title: "أزواج العملات",
        description: "الوصول إلى أكثر من 60 زوج عملات رئيسي وثانوي وغريب بتنفيذ على المستوى المؤسسي.",
        features: [
          "فروقات أسعار من 0.0 نقطة على الأزواج الرئيسية",
          "بدون تدخل من مكتب التداول",
          "تجميع سيولة عميقة",
          "الوصول إلى السوق 24/5"
        ],
        specs: {
          pairs: "الأزواج المتاحة",
          pairsValue: "60+",
          leverage: "الرافعة المالية",
          leverageValue: "حتى 1:500",
          minTrade: "الحد الأدنى للتداول",
          minTradeValue: "0.01 لوت"
        }
      },
      indices: {
        title: "المؤشرات",
        description: "تداول مؤشرات الأسهم العالمية بفروقات أسعار ضيقة وتنفيذ سريع في الأسواق الرئيسية.",
        features: [
          "مؤشرات أمريكية وأوروبية وآسيوية",
          "ساعات تداول ممتدة",
          "لا توجد تواريخ انتهاء على العقود مقابل الفروقات",
          "التداول الجزئي متاح"
        ],
        specs: {
          markets: "الأسواق",
          marketsValue: "15+",
          leverage: "الرافعة المالية",
          leverageValue: "حتى 1:200",
          hours: "ساعات التداول",
          hoursValue: "23/5"
        }
      },
      commodities: {
        title: "السلع",
        description: "التنويع بالذهب والفضة والنفط والمنتجات الزراعية من خلال تداول العقود مقابل الفروقات.",
        features: [
          "المعادن الثمينة (الذهب، الفضة، البلاتين)",
          "منتجات الطاقة (النفط الخام، الغاز الطبيعي)",
          "السلع الزراعية",
          "متطلبات هامش منخفضة"
        ],
        specs: {
          products: "المنتجات",
          productsValue: "20+",
          leverage: "الرافعة المالية",
          leverageValue: "حتى 1:100",
          depth: "عمق السوق",
          depthValue: "المستوى الثاني"
        }
      },
      cryptocurrencies: {
        title: "العملات الرقمية",
        description: "تداول البيتكوين والإيثيريوم والعملات البديلة الرئيسية بتوفر على مدار الساعة دون الحاجة إلى محفظة.",
        features: [
          "أزواج العملات الرقمية الرئيسية مقابل الدولار الأمريكي/اليورو",
          "التداول على مدار الساعة، بما في ذلك عطلات نهاية الأسبوع",
          "لا حاجة لمحفظة أو بورصة",
          "فروقات أسعار ضيقة على البيتكوين"
        ],
        specs: {
          assets: "الأصول الرقمية",
          assetsValue: "15+",
          leverage: "الرافعة المالية",
          leverageValue: "حتى 1:50",
          availability: "التوفر",
          availabilityValue: "24/7"
        }
      },
      stocksCfds: {
        title: "عقود الأسهم مقابل الفروقات",
        description: "تداول أسهم الشركات الرائدة من البورصات العالمية دون امتلاك الأصل الأساسي.",
        features: [
          "أسهم أمريكية وأوروبية وآسيوية",
          "الشراء أو البيع",
          "بدون رسوم دمغة أو عمولات",
          "إجراءات الشركات تنعكس"
        ],
        specs: {
          stocks: "الأسهم المتاحة",
          stocksValue: "500+",
          leverage: "الرافعة المالية",
          leverageValue: "حتى 1:20",
          exchanges: "البورصات",
          exchangesValue: "10+"
        }
      },
      bondsEtfs: {
        title: "السندات وصناديق الاستثمار المتداولة",
        description: "الوصول إلى سندات الحكومة وصناديق الاستثمار المتداولة لتنويع المحفظة.",
        features: [
          "سندات حكومية رئيسية",
          "صناديق استثمار متداولة خاصة بالقطاعات",
          "التعرض للأسواق العالمية",
          "تكاليف تداول منخفضة"
        ],
        specs: {
          instruments: "الأدوات",
          instrumentsValue: "100+",
          leverage: "الرافعة المالية",
          leverageValue: "حتى 1:50",
          markets: "الأسواق",
          marketsValue: "عالمية"
        }
      },
      cta: {
        title: "هل أنت مستعد لبدء التداول؟",
        subtitle: "افتح حسابًا في دقائق واحصل على جميع منتجات التداول مع فروقات أسعار تنافسية وتنفيذ سريع.",
        liveAccount: "افتح حساب حقيقي",
        demoAccount: "جرب الحساب التجريبي"
      }
    },
    about: {
      title: "عن Keystone FX",
      subtitle: "بناء مستقبل تداول الفوركس على المستوى المؤسسي من خلال الدقة والشفافية والتكنولوجيا المتطورة.",
      mission: {
        title: "مهمتنا",
        text1: "في Keystone FX، نؤمن بأن كل متداول يستحق الوصول إلى البنية التحتية على المستوى المؤسسي، سواء كنت تدير الملايين أو تبدأ رحلة التداول الخاصة بك.",
        text2: "لقد قمنا ببناء منصتنا من الألف إلى الياء مع تركيز واحد: توفير بيئة التداول الأسرع والأكثر موثوقية وشفافية في الصناعة."
      },
      values: [
        "الشفافية في جميع العمليات",
        "تكنولوجيا التنفيذ المتطورة",
        "أمان أموال العملاء",
        "الامتثال التنظيمي"
      ],
      stats: [
        { value: "50K+", label: "متداول نشط" },
        { value: "$2B+", label: "الحجم الشهري" },
        { value: "8ms", label: "متوسط التنفيذ" },
        { value: "99.99%", label: "وقت التشغيل" }
      ],
      whyUs: {
        title: "لماذا تختار Keystone FX",
        reasons: [
          {
            icon: "⚡",
            title: "تنفيذ سريع البرق",
            description: "بنيتنا التحتية مبنية للسرعة. متوسط أوقات التنفيذ أقل من 10 مللي ثانية يضمن عدم تفويت أي فرصة تداول."
          },
          {
            icon: "🔒",
            title: "أمان على مستوى البنوك",
            description: "يتم الاحتفاظ بأموال العملاء في حسابات منفصلة لدى بنوك من الدرجة الأولى. أمان رأس مالك هو أولويتنا القصوى."
          },
          {
            icon: "📊",
            title: "السيولة المؤسسية",
            description: "الوصول إلى مجمعات سيولة عميقة من مزودين متعددين من الدرجة الأولى للحصول على أضيق فروقات الأسعار وأفضل تنفيذ."
          }
        ]
      },
      regulation: {
        title: "منظمة وموثوقة",
        text: "تعمل Keystone FX تحت إشراف تنظيمي صارم لضمان أعلى معايير حماية العملاء والنزاهة التشغيلية.",
        badges: [
          "منظمة من FCA",
          "مرخصة من CySEC",
          "مصرح بها من ASIC"
        ]
      },
      cta: {
        title: "هل أنت مستعد لتجربة الفرق؟",
        subtitle: "انضم إلى آلاف المتداولين الذين يثقون في Keystone FX لتلبية احتياجات التداول الخاصة بهم.",
        contact: "اتصل بنا",
        learn: "تعرف على المزيد"
      }
    },
    accounts: {
      title: "رحلتك في التداول تبدأ من هنا",
      subtitle: "افتح حساب تداول متميز في دقائق. اختبر التنفيذ على المستوى المؤسسي والأدوات المتقدمة والدعم الاحترافي على منصة مصممة للنجاح.",
      startTrading: "ابدأ التداول الآن",
      openAccount: "افتح حساباً مجانياً",
      hero: {
        badge: "فتح حساب فوري",
        traders: "متداول نشط",
        volume: "الحجم الشهري",
        execution: "متوسط التنفيذ",
        support: "دعم العملاء"
      },
      features: {
        title: "تداول بثقة",
        subtitle: "اختبر ميزة Keystone FX مع التكنولوجيا المتطورة والدعم الاحترافي.",
        global: {
          title: "الوصول إلى الأسواق العالمية",
          description: "تداول في البورصات المالية الرئيسية في جميع أنحاء العالم باستخدام حسابات آمنة يمكن الوصول إليها من أي جهاز في أي وقت."
        },
        secure: {
          title: "أمان على مستوى البنوك",
          description: "أموالك محمية في حسابات منفصلة لدى بنوك من الدرجة الأولى مع بروتوكولات تشفير وأمان متقدمة."
        },
        fast: {
          title: "تنفيذ فائق السرعة",
          description: "اختبر متوسط سرعات تنفيذ 8 مللي ثانية مع بنيتنا التحتية المتقدمة ومجمعات السيولة العميقة."
        }
      },
      steps: {
        title: "ابدأ في 3 خطوات بسيطة",
        subtitle: "ابدأ رحلة التداول الخاصة بك اليوم مع عملية الإعداد السلسة لدينا",
        list: [
          {
            title: "أنشئ حسابك",
            description: "التسجيل السريع في دقائق. سنطلب تفاصيل أساسية لإعداد حساب التداول الاحترافي الخاص بك."
          },
          {
            title: "موّل حسابك",
            description: "أودع بأمان باستخدام بطاقات الائتمان أو التحويلات البنكية أو المحافظ الإلكترونية أو حلول الدفع المحلية مع معالجة فورية."
          },
          {
            title: "ابدأ التداول",
            description: "الوصول إلى الأسواق العالمية بأدوات احترافية وبيانات في الوقت الفعلي ودعم خبراء وإشعارات فورية."
          }
        ]
      },
      bonus: {
        badge: "عرض لفترة محدودة",
        title: "احصل على مكافأة 30٪ على إيداعك الأول!",
        terms: "اطلب مكافأة الترحيب الخاصة بك اليوم. تطبق الشروط والأحكام."
      },
      compare: {
        title: "اختر حسابك المثالي",
        subtitle: "رافعة مالية مرنة تصل إلى 1:2000، فروقات أسعار ضيقة، وشروط تداول احترافية مصممة حسب احتياجاتك.",
        minDeposit: "الحد الأدنى للإيداع",
        leverage: "الحد الأقصى للرافعة المالية",
        select: "اختر الحساب",
        popular: "الأكثر شعبية"
      },
      types: {
        standard: {
          name: "الحساب القياسي",
          features: [
            "مثالي للمبتدئين",
            "فروقات أسعار السوق القياسية",
            "بدون رسوم عمولة",
            "دعم العملاء 24/6",
            "موارد تعليمية مجانية"
          ]
        },
        pro: {
          name: "الحساب الاحترافي",
          features: [
            "للمتداولين ذوي الخبرة",
            "فروقات أسعار أضيق",
            "دعم عملاء ذو أولوية",
            "أدوات تداول متقدمة",
            "تحليل السوق والإشارات"
          ]
        },
        vip: {
          name: "حساب VIP",
          features: [
            "للمتداولين المحترفين",
            "فروقات أسعار ECN الخام",
            "مدير حساب مخصص",
            "مزايا تداول حصرية",
            "أبحاث ورؤى متميزة"
          ]
        }
      },
      finalCta: {
        title: "هل أنت مستعد للانضمام إلى أكثر من 50,000 متداول؟",
        subtitle: "اختبر الفرق في التداول مع وسيط يضع نجاحك في المقام الأول. افتح حسابك اليوم وابدأ التداول بثقة."
      }
    },
    contact: {
      hero: {
        badge: "نحن هنا للمساعدة",
        title: "تواصل معنا",
        subtitle: "هل لديك أسئلة؟ فريق الدعم المخصص لدينا متاح على مدار الساعة طوال أيام الأسبوع خلال ساعات السوق لمساعدتك في أي شيء تحتاجه."
      },
      info: {
        phone: {
          title: "اتصل بنا",
          description: "تحدث مع فريقنا مباشرة"
        },
        email: {
          title: "راسلنا عبر البريد الإلكتروني",
          description: "أرسل لنا رسالة في أي وقت"
        },
        hours: {
          title: "ساعات الدعم",
          description: "متاح عندما تكون الأسواق مفتوحة",
          note: "من الاثنين إلى الجمعة"
        }
      },
      form: {
        title: "أرسل لنا رسالة",
        subtitle: "املأ النموذج أدناه وسنعاود الاتصال بك في أقرب وقت ممكن.",
        fullName: "الاسم الكامل",
        fullNamePlaceholder: "أدخل اسمك الكامل",
        email: "عنوان البريد الإلكتروني",
        emailPlaceholder: "your.email@example.com",
        phone: "رقم الهاتف",
        phonePlaceholder: "+44 0000 000 000",
        topic: "الموضوع",
        topicPlaceholder: "اختر موضوعاً",
        topics: {
          accounts: "الحسابات",
          platform: "المنصة",
          funding: "التمويل",
          partnership: "الوسيط المعرف / الشراكة",
          other: "أخرى"
        },
        message: "الرسالة",
        messagePlaceholder: "أخبرنا كيف يمكننا مساعدتك...",
        submit: "إرسال الرسالة",
        successMessage: "شكراً لك! لقد تلقينا رسالتك وسنرد عليك قريباً."
      },
      location: {
        title: "قم بزيارة مكتبنا",
        viewMap: "عرض خريطة أكبر"
      },
      disclaimer: {
        title: "إخلاء المسؤولية:",
        text: "المعلومات الواردة في هذا الموقع هي لأغراض عامة فقط ولا تشكل نصيحة استثمارية."
      },
      cta: {
        title: "هل أنت مستعد لبدء التداول؟",
        subtitle: "افتح حسابك اليوم وانضم إلى آلاف المتداولين الناجحين في جميع أنحاء العالم.",
        button: "افتح حساباً الآن"
      }
    },
    footer: {
      title: "إخلاء مسؤولية المخاطر",
      disclaimer: "ينطوي تداول العملات الأجنبية والعقود مقابل الفروقات والمعادن والعملات الرقمية على مخاطر كبيرة وقد يؤدي إلى خسارة رأس المال المستثمر. المعلومات المقدمة ليست نصيحة استثمارية. الأداء السابق لا يدل على النتائج المستقبلية."
    }
  },
  zh: {
    hero: {
      title: "精准执行 · 智能基础设施",
      subtitle:
        "Keystone FX 提供专为速度、控制与机构级可靠性打造的专业交易环境。",
    },
    nav: {
      products: "产品",
      platforms: "平台",
      accounts: "账户",
      blog: "博客",
      about: "关于我们",
      contact: "联系我们",
      signin: "登录",
    },
    products: {
      title: "交易产品",
      subtitle: "通过机构级执行、深度流动性和专业交易条件访问全球市场，涵盖多种资产类别。",
      forexPairs: {
        title: "外汇货币对",
        description: "通过机构级执行访问60多个主要、次要和异国货币对。",
        features: [
          "主要货币对点差从0.0点起",
          "无交易台干预",
          "深度流动性池聚合",
          "24/5市场访问"
        ],
        specs: {
          pairs: "可用货币对",
          pairsValue: "60+",
          leverage: "杠杆",
          leverageValue: "最高1:500",
          minTrade: "最小交易规模",
          minTradeValue: "0.01手"
        }
      },
      indices: {
        title: "指数",
        description: "在主要市场以紧密点差和快速执行交易全球股票指数。",
        features: [
          "美国、欧洲和亚洲指数",
          "延长交易时间",
          "差价合约无到期日",
          "可进行分数交易"
        ],
        specs: {
          markets: "市场",
          marketsValue: "15+",
          leverage: "杠杆",
          leverageValue: "最高1:200",
          hours: "交易时间",
          hoursValue: "23/5"
        }
      },
      commodities: {
        title: "大宗商品",
        description: "通过差价合约交易黄金、白银、石油和农产品实现多元化。",
        features: [
          "贵金属（黄金、白银、铂金）",
          "能源产品（原油、天然气）",
          "农产品",
          "低保证金要求"
        ],
        specs: {
          products: "产品",
          productsValue: "20+",
          leverage: "杠杆",
          leverageValue: "最高1:100",
          depth: "市场深度",
          depthValue: "二级"
        }
      },
      cryptocurrencies: {
        title: "加密货币",
        description: "交易比特币、以太坊和主要山寨币，24/7可用，无需钱包。",
        features: [
          "主要加密货币对与美元/欧元",
          "24/7交易，包括周末",
          "无需钱包或交易所",
          "比特币点差紧密"
        ],
        specs: {
          assets: "加密资产",
          assetsValue: "15+",
          leverage: "杠杆",
          leverageValue: "最高1:50",
          availability: "可用性",
          availabilityValue: "24/7"
        }
      },
      stocksCfds: {
        title: "股票差价合约",
        description: "交易全球交易所领先公司的股票，无需拥有标的资产。",
        features: [
          "美国、欧洲和亚洲股票",
          "做多或做空",
          "无印花税或佣金",
          "反映公司行为"
        ],
        specs: {
          stocks: "可用股票",
          stocksValue: "500+",
          leverage: "杠杆",
          leverageValue: "最高1:20",
          exchanges: "交易所",
          exchangesValue: "10+"
        }
      },
      bondsEtfs: {
        title: "债券和ETF",
        description: "访问政府债券和交易所交易基金以实现投资组合多元化。",
        features: [
          "主要政府债券",
          "特定行业的ETF",
          "全球市场敞口",
          "低交易成本"
        ],
        specs: {
          instruments: "工具",
          instrumentsValue: "100+",
          leverage: "杠杆",
          leverageValue: "最高1:50",
          markets: "市场",
          marketsValue: "全球"
        }
      },
      cta: {
        title: "准备开始交易了吗？",
        subtitle: "几分钟内开设账户，以具有竞争力的点差和快速执行访问我们所有的交易产品。",
        liveAccount: "开设真实账户",
        demoAccount: "试用模拟账户"
      }
    },
    about: {
      title: "关于 Keystone FX",
      subtitle: "通过精准、透明和尖端技术构建机构级外汇交易的未来。",
      mission: {
        title: "我们的使命",
        text1: "在 Keystone FX，我们相信每个交易者都应该获得机构级基础设施，无论您是管理数百万美元还是刚开始您的交易之旅。",
        text2: "我们从头开始构建我们的平台，专注于一个目标：提供行业中最快、最可靠、最透明的交易环境。"
      },
      values: [
        "所有操作的透明度",
        "尖端执行技术",
        "客户资金安全",
        "监管合规"
      ],
      stats: [
        { value: "50K+", label: "活跃交易者" },
        { value: "$2B+", label: "月交易量" },
        { value: "8ms", label: "平均执行" },
        { value: "99.99%", label: "正常运行时间" }
      ],
      whyUs: {
        title: "为什么选择 Keystone FX",
        reasons: [
          {
            icon: "⚡",
            title: "闪电般的执行速度",
            description: "我们的基础设施专为速度而打造。平均执行时间低于10毫秒，确保您不会错过任何交易机会。"
          },
          {
            icon: "🔒",
            title: "银行级安全",
            description: "客户资金存放在一级银行的独立账户中。您的资本安全是我们的首要任务。"
          },
          {
            icon: "📊",
            title: "机构流动性",
            description: "从多个一级供应商访问深度流动性池，获得最紧密的点差和最佳执行。"
          }
        ]
      },
      regulation: {
        title: "受监管且值得信赖",
        text: "Keystone FX 在严格的监管监督下运营，以确保最高标准的客户保护和运营诚信。",
        badges: [
          "FCA 监管",
          "CySEC 许可",
          "ASIC 授权"
        ]
      },
      cta: {
        title: "准备体验不同之处了吗？",
        subtitle: "加入数千名信任 Keystone FX 满足其交易需求的交易者。",
        contact: "联系我们",
        learn: "了解更多"
      }
    },
    accounts: {
      title: "您的交易之旅从这里开始",
      subtitle: "几分钟内开设高级交易账户。在为成功而打造的平台上体验机构级执行、高级工具和专业支持。",
      startTrading: "立即开始交易",
      openAccount: "开设免费账户",
      hero: {
        badge: "即时开户",
        traders: "活跃交易者",
        volume: "月交易量",
        execution: "平均执行",
        support: "客户支持"
      },
      features: {
        title: "自信交易",
        subtitle: "通过尖端技术和专业支持体验 Keystone FX 的优势。",
        global: {
          title: "全球市场访问",
          description: "在全球主要金融交易所进行交易，使用可从任何设备随时访问的安全账户。"
        },
        secure: {
          title: "银行级安全",
          description: "您的资金受到一级银行独立账户的保护，配备先进的加密和安全协议。"
        },
        fast: {
          title: "闪电执行",
          description: "通过我们的先进基础设施和深度流动性池体验平均8毫秒的执行速度。"
        }
      },
      steps: {
        title: "三个简单步骤开始",
        subtitle: "通过我们无缝的入职流程，今天就开始您的交易之旅",
        list: [
          {
            title: "创建您的账户",
            description: "几分钟内快速注册。我们会询问基本详细信息以设置您的专业交易账户。"
          },
          {
            title: "为您的账户注资",
            description: "使用信用卡、银行转账、电子钱包或本地支付解决方案安全存款，即时处理。"
          },
          {
            title: "开始交易",
            description: "使用专业工具、实时数据、专家支持和即时通知访问全球市场。"
          }
        ]
      },
      bonus: {
        badge: "限时优惠",
        title: "首次存款获得30%奖金！",
        terms: "立即领取您的欢迎奖金。条款和条件适用。"
      },
      compare: {
        title: "选择您的完美账户",
        subtitle: "灵活杠杆高达1:2000，紧密点差，以及根据您的需求量身定制的专业交易条件。",
        minDeposit: "最低存款",
        leverage: "最大杠杆",
        select: "选择账户",
        popular: "最受欢迎"
      },
      types: {
        standard: {
          name: "标准账户",
          features: [
            "非常适合初学者",
            "标准市场点差",
            "无佣金费用",
            "24/6客户支持",
            "免费教育资源"
          ]
        },
        pro: {
          name: "专业账户",
          features: [
            "适合经验丰富的交易者",
            "更紧密的点差",
            "优先客户支持",
            "高级交易工具",
            "市场分析和信号"
          ]
        },
        vip: {
          name: "VIP账户",
          features: [
            "适合专业交易者",
            "原始ECN点差",
            "专属客户经理",
            "独家交易福利",
            "高级研究和见解"
          ]
        }
      },
      finalCta: {
        title: "准备加入50,000多名交易者了吗？",
        subtitle: "体验与一家将您的成功放在首位的经纪商进行交易的不同之处。今天就开设您的账户并自信地开始交易。"
      }
    },
    contact: {
      hero: {
        badge: "我们随时为您服务",
        title: "联系我们",
        subtitle: "有疑问吗？我们的专业支持团队在市场开放时间24/5为您提供所需的任何帮助。"
      },
      info: {
        phone: {
          title: "致电我们",
          description: "直接与我们的团队交谈"
        },
        email: {
          title: "发送电子邮件",
          description: "随时向我们发送消息"
        },
        hours: {
          title: "支持时间",
          description: "市场开放时可用",
          note: "周一至周五"
        }
      },
      form: {
        title: "给我们留言",
        subtitle: "填写以下表格，我们会尽快回复您。",
        fullName: "全名",
        fullNamePlaceholder: "输入您的全名",
        email: "电子邮件地址",
        emailPlaceholder: "your.email@example.com",
        phone: "电话号码",
        phonePlaceholder: "+86 000 0000 0000",
        topic: "主题",
        topicPlaceholder: "选择主题",
        topics: {
          accounts: "账户",
          platform: "平台",
          funding: "资金",
          partnership: "介绍经纪人 / 合作伙伴",
          other: "其他"
        },
        message: "留言",
        messagePlaceholder: "告诉我们如何帮助您...",
        submit: "发送消息",
        successMessage: "谢谢！我们已收到您的消息，很快会回复您。"
      },
      location: {
        title: "访问我们的办公室",
        viewMap: "查看大地图"
      },
      disclaimer: {
        title: "免责声明：",
        text: "本网站上的信息仅用于一般目的，不构成投资建议。"
      },
      cta: {
        title: "准备开始交易了吗？",
        subtitle: "今天就开设您的账户，加入全球数千名成功交易者的行列。",
        button: "立即开户"
      }
    },
    footer: {
      title: "风险披露",
      disclaimer: "交易外汇、差价合约、金属和加密货币涉及重大风险，可能导致您投资资本的损失。所提供的信息不构成投资建议。过往表现并不代表未来结果。"
    }
  },
};

export function t(lang: Lang, key: string): string | string[] {
  const parts = key.split(".");
  let res: any = dict[lang];
  for (const p of parts) res = res?.[p];
  return res || key;
}
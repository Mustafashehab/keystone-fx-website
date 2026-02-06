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
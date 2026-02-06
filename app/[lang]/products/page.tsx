import { Lang, t } from "@/lib/i18n";

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  features: string[];
  specs: {
    label: string;
    value: string;
  }[];
}

function ProductCard({ image, title, description, features, specs }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl hover:border-yellow-400">
      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Title on image */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <p className="mb-6 text-slate-600 leading-relaxed">{description}</p>

        {/* Features */}
        <div className="mb-6 space-y-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1 text-yellow-500">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Specs */}
        <div className="border-t border-slate-100 pt-6 space-y-3">
          {specs.map((spec, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-slate-500">{spec.label}</span>
              <span className="font-semibold text-slate-900">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function Products({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;

  const products = [
    {
      image: "/forex-pairs.jpg",
      title: t(lang, "products.forexPairs.title") as string,
      description: t(lang, "products.forexPairs.description") as string,
      features: t(lang, "products.forexPairs.features") as string[],
      specs: [
        { 
          label: t(lang, "products.forexPairs.specs.pairs") as string, 
          value: t(lang, "products.forexPairs.specs.pairsValue") as string 
        },
        { 
          label: t(lang, "products.forexPairs.specs.leverage") as string, 
          value: t(lang, "products.forexPairs.specs.leverageValue") as string 
        },
        { 
          label: t(lang, "products.forexPairs.specs.minTrade") as string, 
          value: t(lang, "products.forexPairs.specs.minTradeValue") as string 
        }
      ]
    },
    {
      image: "/indices.jpg",
      title: t(lang, "products.indices.title") as string,
      description: t(lang, "products.indices.description") as string,
      features: t(lang, "products.indices.features") as string[],
      specs: [
        { 
          label: t(lang, "products.indices.specs.markets") as string, 
          value: t(lang, "products.indices.specs.marketsValue") as string 
        },
        { 
          label: t(lang, "products.indices.specs.leverage") as string, 
          value: t(lang, "products.indices.specs.leverageValue") as string 
        },
        { 
          label: t(lang, "products.indices.specs.hours") as string, 
          value: t(lang, "products.indices.specs.hoursValue") as string 
        }
      ]
    },
    {
      image: "/commodities.jpg",
      title: t(lang, "products.commodities.title") as string,
      description: t(lang, "products.commodities.description") as string,
      features: t(lang, "products.commodities.features") as string[],
      specs: [
        { 
          label: t(lang, "products.commodities.specs.products") as string, 
          value: t(lang, "products.commodities.specs.productsValue") as string 
        },
        { 
          label: t(lang, "products.commodities.specs.leverage") as string, 
          value: t(lang, "products.commodities.specs.leverageValue") as string 
        },
        { 
          label: t(lang, "products.commodities.specs.depth") as string, 
          value: t(lang, "products.commodities.specs.depthValue") as string 
        }
      ]
    },
    {
      image: "/cryptocurrencies.jpg",
      title: t(lang, "products.cryptocurrencies.title") as string,
      description: t(lang, "products.cryptocurrencies.description") as string,
      features: t(lang, "products.cryptocurrencies.features") as string[],
      specs: [
        { 
          label: t(lang, "products.cryptocurrencies.specs.assets") as string, 
          value: t(lang, "products.cryptocurrencies.specs.assetsValue") as string 
        },
        { 
          label: t(lang, "products.cryptocurrencies.specs.leverage") as string, 
          value: t(lang, "products.cryptocurrencies.specs.leverageValue") as string 
        },
        { 
          label: t(lang, "products.cryptocurrencies.specs.availability") as string, 
          value: t(lang, "products.cryptocurrencies.specs.availabilityValue") as string 
        }
      ]
    },
    {
      image: "/stocks-cfds.jpg",
      title: t(lang, "products.stocksCfds.title") as string,
      description: t(lang, "products.stocksCfds.description") as string,
      features: t(lang, "products.stocksCfds.features") as string[],
      specs: [
        { 
          label: t(lang, "products.stocksCfds.specs.stocks") as string, 
          value: t(lang, "products.stocksCfds.specs.stocksValue") as string 
        },
        { 
          label: t(lang, "products.stocksCfds.specs.leverage") as string, 
          value: t(lang, "products.stocksCfds.specs.leverageValue") as string 
        },
        { 
          label: t(lang, "products.stocksCfds.specs.exchanges") as string, 
          value: t(lang, "products.stocksCfds.specs.exchangesValue") as string 
        }
      ]
    },
    {
      image: "/bonds-etfs.jpg",
      title: t(lang, "products.bondsEtfs.title") as string,
      description: t(lang, "products.bondsEtfs.description") as string,
      features: t(lang, "products.bondsEtfs.features") as string[],
      specs: [
        { 
          label: t(lang, "products.bondsEtfs.specs.instruments") as string, 
          value: t(lang, "products.bondsEtfs.specs.instrumentsValue") as string 
        },
        { 
          label: t(lang, "products.bondsEtfs.specs.leverage") as string, 
          value: t(lang, "products.bondsEtfs.specs.leverageValue") as string 
        },
        { 
          label: t(lang, "products.bondsEtfs.specs.markets") as string, 
          value: t(lang, "products.bondsEtfs.specs.marketsValue") as string 
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            {t(lang, "products.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
            {t(lang, "products.subtitle")}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <ProductCard key={idx} {...product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">
            {t(lang, "products.cta.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-slate-300 mb-8">
            {t(lang, "products.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="rounded-lg bg-yellow-400 px-8 py-3 font-semibold text-slate-900 transition hover:bg-yellow-300">
              {t(lang, "products.cta.liveAccount")}
            </button>
            <button className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white/10">
              {t(lang, "products.cta.demoAccount")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
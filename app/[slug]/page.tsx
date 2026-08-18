import { Metadata } from "next";
import { notFound } from "next/navigation";
import { seoPages } from "@/lib/seo-data";
import ReactMarkdown from "react-markdown";

type Props = {
  params: { slug: string };
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pageData = seoPages[params.slug];

  if (!pageData) {
    return {
      title: "Not Found",
      description: "Page not found on SM Booking",
    };
  }

  return {
    title: pageData.title,
    description: pageData.description,
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      type: "article",
    },
  };
}

// Ensure static generation for all defined SEO pages
export function generateStaticParams() {
  return Object.keys(seoPages).map((slug) => ({
    slug,
  }));
}

export default function SeoPage({ params }: Props) {
  const pageData = seoPages[params.slug];

  if (!pageData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-slate-200">
      <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
        {/* Header Section */}
        <header className="mb-12 border-b border-white/10 pb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6">
            {pageData.h1}
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            {pageData.description}
          </p>
        </header>

        {/* Content Section */}
        <article className="prose prose-invert prose-lg max-w-none prose-headings:text-amber-400 prose-a:text-orange-500 hover:prose-a:text-orange-400">
          <ReactMarkdown>{pageData.content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

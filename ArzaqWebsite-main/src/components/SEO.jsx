import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = "ARZAQ Trading PLC - Leading Import & Export Company in Ethiopia",
    description = "ARZAQ Trading PLC is a premier import and export company specializing in international trade, logistics, and supply chain solutions. Contact us for quality products and reliable service.",
    keywords = "import export, trading company, ARZAQ Trading, Ethiopia trade, international trade, logistics, supply chain, import company Ethiopia, export company Ethiopia",
    canonical = "https://www.arzaqtrading.com/",
    ogImage = "https://www.arzaqtrading.com/og-image.jpg",
    type = "website"
}) => {
    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonical} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={ogImage} />
        </Helmet>
    );
};

export default SEO;

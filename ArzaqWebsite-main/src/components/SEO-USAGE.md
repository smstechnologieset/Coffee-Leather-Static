# How to Use the SEO Component

## Quick Start

The SEO component has been created at `src/components/SEO.jsx` and can be used on any page to set custom meta tags for better search engine optimization.

## Example Usage

### Homepage (Already Added)
```jsx
import SEO from './SEO';

const Homepage = () => {
  return (
    <div>
      <SEO />
      {/* rest of your page */}
    </div>
  );
};
```

### About Page Example
```jsx
import SEO from './SEO';

const AboutUsPage = () => {
  return (
    <div>
      <SEO 
        title="About Us - ARZAQ Trading PLC | Our Story & Mission"
        description="Learn about ARZAQ Trading PLC's journey, mission, and commitment to excellence in international import and export trade across Ethiopia and beyond."
        keywords="about arzaq trading, company history, our mission, ethiopia import export company, trading company ethiopia"
        canonical="https://www.arzaqtrading.com/about"
      />
      {/* rest of your page */}
    </div>
  );
};
```

### Products Page Example
```jsx
import SEO from './SEO';

const ProductsPage = () => {
  return (
    <div>
      <SEO 
        title="Our Products - ARZAQ Trading PLC | Quality Import & Export Products"
        description="Browse our extensive catalog of quality import and export products. ARZAQ Trading PLC offers competitive prices and reliable delivery for your business needs."
        keywords="import products, export products, trading products ethiopia, bulk products, wholesale products"
        canonical="https://www.arzaqtrading.com/products"
      />
      {/* rest of your page */}
    </div>
  );
};
```

### Blog Post Example
```jsx
import SEO from './SEO';

const BlogPostPage = ({ post }) => {
  return (
    <div>
      <SEO 
        title={`${post.title} - ARZAQ Trading Blog`}
        description={post.excerpt}
        keywords={post.tags.join(', ')}
        canonical={`https://www.arzaqtrading.com/blog/${post.id}`}
        type="article"
      />
      {/* rest of your page */}
    </div>
  );
};
```

## Available Props

All props are optional and have default values:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "ARZAQ Trading PLC..." | Page title (50-60 chars) |
| `description` | string | "ARZAQ Trading PLC is..." | Page description (150-160 chars) |
| `keywords` | string | "import export..." | Comma-separated keywords |
| `canonical` | string | "https://www.arzaqtrading.com/" | Canonical URL |
| `ogImage` | string | "/og-image.jpg" | Social media share image |
| `type` | string | "website" | OpenGraph type ("website" or "article") |

## Best Practices

1. **Always include SEO component** on every public page
2. **Unique titles** for each page (don't duplicate)
3. **Keep titles under 60 characters** to avoid truncation
4. **Keep descriptions 150-160 characters** for optimal display
5. **Use relevant keywords** but don't stuff (3-5 phrases max)
6. **Update canonical URL** to match the actual page URL
7. **Use type="article"** for blog posts, "website" for other pages

## Next Steps

Add the SEO component to these pages:
- ✅ Homepage (Done)
- ⬜ AboutUsPage
- ⬜ ProductsPage
- ⬜ ContactUsPage
- ⬜ BlogPage
- ⬜ BlogPostPage (with dynamic content)

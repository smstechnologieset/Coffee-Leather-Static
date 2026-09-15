/**
 * lib/mock-content.ts
 * All mock/placeholder content for the main corporate website.
 * MOCK — see /docs/MOCK_DATA.md. Replace via CMS or admin dashboard once real content is ready.
 */

export const COMPANY_COPY = {
  tagline: "Ethiopia's Finest, Delivered to the World",
  intro:
    "Highland Roots Trading PLC is an Addis Ababa-based export and trading company connecting the agricultural wealth of the Ethiopian highlands with buyers and partners across North America, Europe, and Asia. Founded in 2019, we operate at the intersection of heritage and commerce — bringing centuries-old Ethiopian craftsmanship and world-renowned arabica coffees to a global marketplace.",

  mission:
    "To create sustainable, long-term value for Ethiopian producers and international buyers by delivering the highest-quality commodities with transparency, integrity, and care.",

  vision:
    "To be Africa's most trusted agricultural export partner — a company that sets the standard for ethical sourcing, consistent quality, and mutually beneficial trade relationships.",

  values: [
    {
      title: "Integrity",
      description:
        "We operate transparently with every stakeholder — from the cooperatives we source from to the buyers we serve. What we say is what we deliver.",
    },
    {
      title: "Quality Without Compromise",
      description:
        "We curate only what meets our grade standards. If a harvest doesn't meet the bar, it doesn't carry our name.",
    },
    {
      title: "Sustainable Partnership",
      description:
        "Long-term relationships with producers mean better livelihoods and more consistent supply. We invest in the communities behind every shipment.",
    },
    {
      title: "Ethiopian Heritage",
      description:
        "We are proud custodians of Ethiopia's extraordinary agri-cultural heritage. Every product we export tells a story worth sharing.",
    },
  ],

  about: [
    "Highland Roots Trading PLC was established in 2019 by a team of Ethiopian entrepreneurs and trade specialists with a shared conviction: Ethiopia's extraordinary agricultural output deserved a better path to the world. The company began with a single product line — specialty-grade arabica coffees from the Yirgacheffe, Sidamo, and Guji regions — and has since expanded to include a curated portfolio of natural and processed coffees spanning Ethiopia's most celebrated growing zones.",

    "Our operations are rooted in Addis Ababa, with sourcing partnerships across nine regional cooperatives and washing stations. We work exclusively with smallholder farmers organised into certified producer groups, providing advance purchase agreements, agronomic support, and fair floor prices regardless of commodity market fluctuations.",

    "In 2022, the company began exploring an adjacent opportunity in premium leather goods — Ethiopia's livestock sector produces some of the finest raw hides on the continent, yet the finished-goods market has historically been underdeveloped. The leather division of Highland Roots is currently in its early development phase, with a planned product line of premium export-quality leather goods anticipated to launch in the coming year.",

    "Today, Highland Roots Trading PLC is a trusted name for wholesale buyers in the United States, Germany, Japan, and across the Gulf. We are registered with the Ethiopian Coffee and Tea Authority and comply with all applicable export and phytosanitary regulations.",
  ],

  foundingStory: {
    year: 2019,
    headline: "From a Single Shipment to a Trusted Name",
    body: "It started with a 1-ton trial shipment to a small roastery in Portland, Oregon. The coffee — a washed Yirgacheffe Grade 1 — landed with a cupping score of 87.5. The roastery ordered three more containers before the next harvest season. That first relationship taught our founders everything they needed to know: quality speaks, and consistency builds trust. Highland Roots grew from there, one shipment, one partnership at a time.",
  },

  stats: [
    { label: "Founded", value: "2019" },
    { label: "Export Markets", value: "12+" },
    { label: "Producer Cooperatives", value: "9" },
    { label: "Products", value: "6 Coffees" },
  ],
};

export const NEWS_POSTS = [
  {
    slug: "new-us-partnership-2024",
    title: "Highland Roots Secures Long-Term Supply Agreement with US Specialty Importer",
    date: "2024-11-08",
    author: "Highland Roots Team",
    excerpt:
      "We are pleased to announce a three-year supply agreement with a leading specialty coffee importer based in Seattle, covering annual volumes of Yirgacheffe Washed and Guji Honey.",
    body: [
      "Highland Roots Trading PLC has entered into a multi-year supply agreement with a prominent Pacific Northwest specialty importer, marking one of our largest single-buyer commitments to date. The agreement covers annual shipments of our flagship Yirgacheffe Washed Grade 1 and Guji Honey Grade 1 coffees, with the first container scheduled to depart from Djibouti Port in January 2025.",
      "The agreement includes a sustainability rider requiring full traceability to the washing station level, along with an annual cupping review and a price floor guarantee for our producer partners. We believe this is the kind of long-term relationship that benefits every link in the supply chain — from the smallholder farmers in Gedeo Zone to the café customer in Seattle.",
    ],
    image: "https://picsum.photos/seed/news1/800/450",
    category: "Partnerships",
  },
  {
    slug: "organic-certification-progress",
    title: "Three of Our Coffees Now Carry Organic Certification",
    date: "2024-09-15",
    author: "Quality & Compliance Team",
    excerpt:
      "Following an 18-month audit cycle, our Yirgacheffe Washed, Sidamo Natural, and Guji Honey have received USDA-recognized organic certification through our producer cooperative partners.",
    body: [
      "After an 18-month audit and verification process conducted in partnership with our regional cooperative partners, three coffees in our portfolio — Yirgacheffe Washed, Sidamo Natural, and Guji Honey — have achieved organic certification through a USDA-recognised certifying body. The certification covers farming practices, post-harvest processing, and storage at the washing station level.",
      "This milestone reflects the farming methods our producer partners have practiced for generations — methods that rely on shade-grown cultivation, natural composting, and minimal chemical inputs. Formalising this through certification opens new market segments for our buyers and enables premium pricing that flows directly back to producers. We are committed to extending certification efforts to our remaining product lines over the next two harvest cycles.",
    ],
    image: "https://picsum.photos/seed/news2/800/450",
    category: "Quality",
  },
  {
    slug: "scaa-expo-2024",
    title: "Highland Roots at the 2024 Specialty Coffee Expo, Chicago",
    date: "2024-04-22",
    author: "Highland Roots Team",
    excerpt:
      "Our team attended the Specialty Coffee Association Expo in Chicago, where we connected with more than 40 prospective buyers and hosted cupping sessions of our full 2024 harvest lineup.",
    body: [
      "The 2024 Specialty Coffee Association Expo in Chicago was an exceptional opportunity to present the breadth and quality of Ethiopia's coffee heritage to an audience of the world's most discerning buyers. Our team hosted three dedicated cupping sessions across the two-day event, presenting all six coffees in our current portfolio — drawing consistently high scores and significant interest from roasters across the United States, Canada, and Western Europe.",
      "We connected with over 40 prospective buyers, initiating sample request processes with 18 of them. Several of those conversations are now in the contract discussion phase. We are grateful to the SCA for providing a platform where Ethiopian coffees can speak for themselves, and we look forward to returning in 2025 with an expanded lineup.",
    ],
    image: "https://picsum.photos/seed/news3/800/450",
    category: "Events",
  },
  {
    slug: "2024-harvest-outlook",
    title: "2024 Harvest Outlook: Excellent Conditions Across Key Growing Regions",
    date: "2024-02-10",
    author: "Sourcing Team",
    excerpt:
      "Early reports from our cooperative partners in Yirgacheffe, Sidamo, and Guji indicate above-average cherry yield and quality, driven by consistent rainfall and optimal drying conditions.",
    body: [
      "Our sourcing team has completed its pre-harvest assessment visits across the Yirgacheffe, Sidamo, Guji, and Limu growing regions, and the outlook for the 2024 harvest is encouraging. Cooperative partner reports indicate above-average cherry volumes in all four zones, with particularly strong cherry density observed in the high-altitude plots above 2,000 masl in the Gedeo Zone.",
      "Rainfall patterns throughout the flowering and cherry development periods were consistent and well-distributed, which tends to correlate strongly with higher cup quality. Early cherry samples cupped at our Addis Ababa dry mill have scored in the 85–89 range — a strong indicator for the final harvest. We are pre-positioning container capacity and expect to begin accepting buyer commitments for the 2024 crop in March.",
    ],
    image: "https://picsum.photos/seed/news4/800/450",
    category: "Sourcing",
  },
];

export const TEAM_MEMBERS = [
  {
    name: "Dawit Bekele",
    role: "Chief Executive Officer",
    bio: "20 years in Ethiopian agricultural export. Former head of procurement at the Ethiopian Commodity Exchange.",
    image: "https://picsum.photos/seed/team1/200/200",
  },
  {
    name: "Sara Haile",
    role: "Head of Quality & Compliance",
    bio: "Q-grader certified. Oversees all cupping, grading, and certification processes across our supplier network.",
    image: "https://picsum.photos/seed/team2/200/200",
  },
  {
    name: "Michael Tesfaye",
    role: "Director of International Sales",
    bio: "Based between Addis Ababa and New York. Manages relationships with buyers across North America and Europe.",
    image: "https://picsum.photos/seed/team3/200/200",
  },
];

export const GALLERY_IMAGES = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  src: `https://picsum.photos/seed/gallery${i + 1}/600/400`,
  alt: `Placeholder gallery image ${i + 1} — will be replaced with real photography`,
  caption: "📷 Placeholder image — real photography coming soon",
}));

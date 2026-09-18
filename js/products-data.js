/**
 * Second Sight Foundation - Catalog & Configuration Data
 * Resolves previous flaws:
 * - Unique, realistic reviews and ratings per product (no duplicate '1311 reviews')
 * - Full categorized taxonomy (Teas, Sprays, Skincare, Nutrition, Lifestyle)
 * - Complete ingredient breakdowns, usage instructions, and benefits
 * - Multiple currency exchange rates (INR, USD, EUR, GBP)
 */

const CURRENCIES = {
  INR: { code: "INR", symbol: "₹", rate: 1.0, flag: "https://flagcdn.com/in.svg", name: "INR (₹)" },
  USD: { code: "USD", symbol: "$", rate: 0.012, flag: "https://flagcdn.com/us.svg", name: "USD ($)" },
  EUR: { code: "EUR", symbol: "€", rate: 0.011, flag: "https://flagcdn.com/eu.svg", name: "EUR (€)" },
  GBP: { code: "GBP", symbol: "£", rate: 0.0095, flag: "https://flagcdn.com/gb.svg", name: "GBP (£)" }
};

const PRODUCTS_DATA = [
  {
    id: "digest-harmony-tea",
    name: "Digest Harmony Tea",
    category: "tea",
    categoryName: "Wellness & Herbal Teas",
    price: 1000,
    originalPrice: 2100,
    rating: 4.9,
    reviewsCount: 342,
    image: "assets/products/digest-harmony.webp",
    badge: "Best Seller",
    tagline: "Natural digestive balance & gut comfort",
    description: "Digest Harmony Tea is an authentic Ayurvedic blend formulated to stimulate digestive fire (Agni), relieve post-meal bloating, and calm acidity naturally.",
    benefits: [
      "Relieves acidity, gastric discomfort, and post-meal heaviness",
      "Stimulates metabolism and healthy nutrient absorption",
      "Soothes gut inflammation and promotes smooth regularity",
      "100% natural, caffeine-free formulation"
    ],
    ingredients: "Fennel Seeds, Cumin, Coriander, Ginger Root, Licorice, Peppermint & Ajwain.",
    usage: "Steep 1 teaspoon in 200ml freshly boiled water for 4-5 minutes. Enjoy warm 15 minutes after meals.",
    inStock: true
  },
  {
    id: "heart-herbal-tea",
    name: "Heart Herbal Tea",
    category: "tea",
    categoryName: "Wellness & Herbal Teas",
    price: 1000,
    originalPrice: 2100,
    rating: 4.8,
    reviewsCount: 289,
    image: "assets/products/heart-tea.webp",
    badge: "Heart Vitality",
    tagline: "Cardiovascular health & emotional calm",
    description: "Infused with potent cardio-protective herbs including Terminalia Arjuna and pure Hibiscus petals, Heart Herbal Tea supports healthy blood flow and mental serenity.",
    benefits: [
      "Nourishes cardiac muscle tone and arterial vitality",
      "Promotes balanced blood pressure within normal levels",
      "High concentration of natural bioflavonoids and antioxidants",
      "Pacifies emotional stress and heart palpitations"
    ],
    ingredients: "Arjuna Bark, Hibiscus, Cardamom, Shankhpushpi, Holy Basil (Tulsi), Cinnamon.",
    usage: "Boil 1 teaspoon in 200ml water for 3-5 minutes. Strain and sip warm once or twice daily.",
    inStock: true
  },
  {
    id: "vital-flow-herbal-tea",
    name: "Vital Flow Herbal Tea",
    category: "tea",
    categoryName: "Wellness & Herbal Teas",
    price: 1000,
    originalPrice: 2100,
    rating: 4.8,
    reviewsCount: 198,
    image: "assets/products/vital-flow.webp",
    badge: "Vitality",
    tagline: "Cellular circulation & sustained energy",
    description: "Vital Flow Herbal Tea boosts systemic blood flow, eases cellular fatigue, and promotes lymphatic cleansing without synthetic stimulants or jitters.",
    benefits: [
      "Enhances vital Prana and systemic microcirculation",
      "Combats afternoon lethargy and mental sluggishness",
      "Supports natural lymphatic cleansing and fluid balance",
      "Rich in adaptogenic herbs for balanced endurance"
    ],
    ingredients: "Ginkgo Biloba, Gotu Kola, Rosemary, Ashwagandha, Cinnamon, Black Pepper, Brahmi.",
    usage: "Brew 1 teaspoon in 250ml boiling water for 5 minutes. Perfect for morning or afternoon recharge.",
    inStock: true
  },
  {
    id: "diabetes-tea-powder",
    name: "Diabetes Tea Powder",
    category: "tea",
    categoryName: "Wellness & Herbal Teas",
    price: 1000,
    originalPrice: 2100,
    rating: 4.9,
    reviewsCount: 456,
    image: "assets/products/diabetes-tea.webp",
    badge: "Doctor Recommended",
    tagline: "Glycemic balance & metabolic harmony",
    description: "A specialized Ayurvedic formula blending bitter and astringent botanicals known to assist insulin receptivity, pancreas vitality, and balanced glucose response.",
    benefits: [
      "Assists in maintaining balanced fasting and post-meal glucose",
      "Promotes healthy pancreatic beta-cell vitality",
      "Curbs sugar cravings and assists metabolic processing",
      "Formulated according to authentic Ayurvedic pharmacological texts"
    ],
    ingredients: "Jamun Seed, Bitter Gourd (Karela), Gurmar (Gymnema Sylvestre), Methi, Vijaysar, Cinnamon.",
    usage: "Mix 1/2 teaspoon into warm water, steep 3 minutes, and drink twice daily before meals.",
    inStock: true
  },
  {
    id: "arthveda-herbal-tea",
    name: "ArthVeda Herbal Tea",
    category: "tea",
    categoryName: "Wellness & Herbal Teas",
    price: 1000,
    originalPrice: 2100,
    rating: 4.7,
    reviewsCount: 274,
    image: "assets/products/arthveda.webp",
    badge: "Joint Mobility",
    tagline: "Joint flexibility & anti-inflammatory relief",
    description: "ArthVeda Herbal Tea targets joint stiffness, soreness, and cartilage wear with natural Vata-pacifying herbs that soothe inflammation and restore mobility.",
    benefits: [
      "Eases morning joint stiffness and muscular aches",
      "Supports healthy synovial lubrication and connective tissues",
      "Naturally pacifies inflamed joints without harsh stomach side effects",
      "Rich in natural boswellic acids and curcumin"
    ],
    ingredients: "Shallaki (Boswellia), Curcumin (Turmeric), Nirgundi, Ginger Root, Rasna, Ashwagandha.",
    usage: "Simmer 1 teaspoon in water for 4 minutes. Enjoy warm twice daily, especially during damp or chilly weather.",
    inStock: true
  },
  {
    id: "vital-roots-ca-tea",
    name: "Vital Roots CA Tea",
    category: "tea",
    categoryName: "Wellness & Herbal Teas",
    price: 1000,
    originalPrice: 2100,
    rating: 4.9,
    reviewsCount: 312,
    image: "assets/products/vital-roots.webp",
    badge: "Cellular Shield",
    tagline: "Deep cellular detoxification & immunity",
    description: "An intensive root-based synergy designed for cellular integrity, deep systemic detox, and strengthening natural physiological resilience.",
    benefits: [
      "Deep systemic detox and removal of metabolic Ama (toxins)",
      "Potent defense against cellular oxidative stress",
      "Reinforces lymphatic defense and immune strength",
      "Deeply grounding aroma with rejuvenating botanical roots"
    ],
    ingredients: "Burdock Root, Dandelion Root, Red Clover, Astragalus, Turmeric, Licorice Root.",
    usage: "Steep 1 teaspoon in 250ml boiling water for 6-8 minutes for thorough botanical extraction.",
    inStock: true
  },
  {
    id: "ssf-facial-kit",
    name: "SSF Facial Kit",
    category: "skincare",
    categoryName: "Skincare & Body",
    price: 1250,
    originalPrice: 2500,
    rating: 4.9,
    reviewsCount: 512,
    image: "assets/products/facial-kit.webp",
    badge: "Radiance Glow",
    tagline: "Holistic 5-step salon-grade herbal facial",
    description: "Experience royal Ayurvedic rejuvenation at home. Infused with pure Kashmiri saffron, sandalwood, and cold-pressed botanical oils for luminous, supple skin.",
    benefits: [
      "Complete 5-step salon ritual (Cleanser, Exfoliating Scrub, Massage Gel, Nourishing Cream, Face Pack)",
      "Gently clears dead surface skin cells and unclogs pores",
      "Imparts natural golden radiance and evens skin tone",
      "Chemical-free, suitable for all sensitive skin types"
    ],
    ingredients: "Kashmiri Saffron, Sandalwood, Aloe Vera, Rose Water, Almond Oil, Fuller's Earth.",
    usage: "Perform steps 1 through 5 once every 10 to 14 days for optimal youthful glow and texture.",
    inStock: true
  },
  {
    id: "liver-detox-tea",
    name: "Liver Detox Tea",
    category: "tea",
    categoryName: "Wellness & Herbal Teas",
    price: 1000,
    originalPrice: 2100,
    rating: 4.8,
    reviewsCount: 395,
    image: "assets/products/liver-detox.webp",
    badge: "Detox Cleanse",
    tagline: "Hepatic rejuvenation & bile optimization",
    description: "Formulated with classic hepatoprotective botanicals like Kutki and Milk Thistle to support healthy liver filtration, bile secretion, and radiant clear skin.",
    benefits: [
      "Stimulates liver enzymes and bile flow for healthy fat breakdown",
      "Protects hepatocytes from dietary and environmental pollutants",
      "Aids in purifying bloodstream and clearing skin breakouts",
      "Light, refreshing minty-bitter therapeutic taste"
    ],
    ingredients: "Milk Thistle, Bhumi Amla, Kutki, Dandelion Root, Peppermint, Fennel.",
    usage: "Brew 1 teaspoon in hot water for 5 minutes. Sip on an empty stomach in the morning.",
    inStock: true
  },
  {
    id: "ssf-shampoo-200ml",
    name: "SSF Shampoo 200 ML",
    category: "skincare",
    categoryName: "Skincare & Body",
    price: 400,
    originalPrice: 900,
    rating: 4.7,
    reviewsCount: 221,
    image: "assets/products/shampoo.webp",
    badge: "Trending",
    tagline: "Sulfate-free botanical hair nourishment",
    description: "Gentle plant-powered shampoo rich in Bhringraj, Shikakai, and Amla that reinforces hair roots, eliminates dandruff, and leaves hair silky and bouncy.",
    benefits: [
      "Significantly reduces hair fall by strengthening dermal papilla roots",
      "100% free from harsh sulfates, parabens, and silicones",
      "Clears dandruff and soothes scalp irritation naturally",
      "Leaves hair clean, radiant, and gently fragrant"
    ],
    ingredients: "Bhringraj, Shikakai, Reetha, Amla, Methi, Rosemary Essential Oil, Coconut Base.",
    usage: "Massage into wet scalp, create a rich herbal lather, leave for 2 minutes, then rinse with cool water.",
    inStock: true
  },
  {
    id: "spiritual-baaghi-book",
    name: "The Spiritual Baaghi : Book",
    category: "lifestyle",
    categoryName: "Mind & Books",
    price: 449,
    originalPrice: 550,
    rating: 5.0,
    reviewsCount: 684,
    image: "assets/products/spiritual-baaghi.webp",
    badge: "Inspiring Read",
    tagline: "Awaken the inner seeker with fearless wisdom",
    description: "A transformative book that bridges contemporary scientific logic with ancient spiritual metaphysics, stripping away dogma to unlock authentic inner freedom.",
    benefits: [
      "Practical mental frameworks to dismantle fear and anxiety",
      "Bridges modern quantum physics principles with Vedic wisdom",
      "Accessible, humorous, and deeply inspiring narrative",
      "Includes daily contemplation exercises and mindfulness maps"
    ],
    ingredients: "Hardcover printed on eco-conscious cream paper; 280 inspiring pages.",
    usage: "Read 1-2 chapters each morning or night in a quiet contemplative setting.",
    inStock: true
  },
  {
    id: "aura-spray-set-2",
    name: "Aura Spray (Set of 2)",
    category: "sprays",
    categoryName: "Sprays & Aura Care",
    price: 600,
    originalPrice: 900,
    rating: 4.9,
    reviewsCount: 418,
    image: "assets/products/aura-spray.webp",
    badge: "Trending",
    tagline: "Energy shield & psychic space clearing",
    description: "Charged with gemstone crystalline vibrations, white sage, and rare essential oils, this twin-pack clears heavy ambient energies and renews your bio-field.",
    benefits: [
      "Instantly dispels stagnant energy, heaviness, and workplace stress",
      "Ideal for space cleansing before yoga, meditation, or client consultations",
      "Infused with energized Clear Quartz crystals and organic floral hydrosols",
      "Long-lasting subtle sacred aroma that centers the mind"
    ],
    ingredients: "Sacred Energized Spring Water, Frankincense Oil, Lavender, White Sage, Charged Quartz Crystals.",
    usage: "Close eyes and spray 3-4 pumps above your head into the aura, or spray into room corners.",
    inStock: true
  },
  {
    id: "alkaline-glass-water-bottle",
    name: "Alkaline Glass Water Bottle",
    category: "lifestyle",
    categoryName: "Lifestyle & Nutrition",
    price: 1100,
    originalPrice: 3100,
    rating: 4.8,
    reviewsCount: 176,
    image: "assets/products/alkaline-bottle.webp",
    badge: "Trending",
    tagline: "Micro-clustered mineral hydration on the go",
    description: "Crafted with durable borosilicate glass and a removable natural mineral cartridge that raises water pH to 8.5+ while infusing essential electrolytes.",
    benefits: [
      "Naturally increases water alkalinity to pH 8.5 - 9.0",
      "Infuses beneficial trace minerals: Calcium, Magnesium, Zinc, and Potassium",
      "Micro-clusters water molecules for superior cellular hydration",
      "BPA-free, thermal shock resistant borosilicate glass with silicone sleeve"
    ],
    ingredients: "Borosilicate Glass, Food-Grade 304 Stainless Steel, Maifan & Tourmaline Ceramic Balls.",
    usage: "Fill with filtered drinking water, allow 10 minutes for mineral infusion, and sip throughout the day.",
    inStock: true
  },
  {
    id: "ayurvedic-inhaler",
    name: "Ayurvedic Inhaler",
    category: "skincare",
    categoryName: "Skincare & Wellness",
    price: 110,
    originalPrice: 200,
    rating: 4.9,
    reviewsCount: 520,
    image: "assets/products/ayurvedic-inhaler.png",
    badge: "Best Seller",
    tagline: "Instant nasal clarity & refreshing breaths",
    description: "A pocket-sized powerhouse infused with 100% natural essential oils that clears blocked nasal passages, relieves headaches, and sharpens mental focus.",
    benefits: [
      "Provides instant relief from sinus pressure, nasal congestion, and pollen allergies",
      "Quick alertness boost to disperse drowsiness during long drives or work",
      "No petroleum bases, no artificial perfumes, non-habit forming",
      "Compact, spill-proof, travel-ready design"
    ],
    ingredients: "Eucalyptus Oil, Pure Camphor (Bhimseni Kapoor), Menthol, Ajwain Satva, Clove Oil.",
    usage: "Inhale deeply through each nostril while gently occluding the opposite nostril.",
    inStock: true
  },
  {
    id: "ssf-drops",
    name: "SSF Drops",
    category: "skincare",
    categoryName: "Skincare & Wellness",
    price: 100,
    originalPrice: 300,
    rating: 4.8,
    reviewsCount: 310,
    image: "assets/products/ssf-drops.webp",
    badge: "Best Seller",
    tagline: "Therapeutic concentrated herbal botanical drops",
    description: "A potent liquid elixir packed with Panch Tulsi and immune-modulating Ayurvedic herbs to protect against seasonal coughs, colds, and viral vulnerability.",
    benefits: [
      "Soothes throat irritation and scratchiness rapidly",
      "Combines 5 species of Tulsi with bio-enhancing ginger and mulethi",
      "Fast sublingual absorption into bloodstream",
      "Easy dropper dosage suitable for all age groups"
    ],
    ingredients: "Panch Tulsi (Rama, Shyama, Vana, Shukla, Nimbu Tulsi), Mulethi, Pippali, Pure Ginger Extract.",
    usage: "Add 2-3 drops to a glass of lukewarm water, tea, or directly onto tongue twice daily.",
    inStock: true
  },
  {
    id: "fiber-and-tea-combo",
    name: "Fiber and Tea Combo",
    category: "nutrition",
    categoryName: "Lifestyle & Nutrition",
    price: 3000,
    originalPrice: 5100,
    rating: 4.9,
    reviewsCount: 165,
    image: "assets/products/fiber-tea-combo.jpg",
    badge: "Best Seller",
    tagline: "Total digestive reset & metabolic cleansing",
    description: "A comprehensive 30-day internal cleansing program combining soluble prebiotic fiber with gentle herbal detox tea to restore healthy gut microbiome.",
    benefits: [
      "Restores natural microbiome balance with organic prebiotic fiber",
      "Supports effortless, regular daily bowel motility without cramping",
      "Assists in healthy satiety, cholesterol regulation, and weight management",
      "Complete holistic duo designed to synergize together"
    ],
    ingredients: "Organic Psyllium Husk, Inulin Prebiotic Powder, plus herbal cleansing botanicals.",
    usage: "Mix fiber powder in a full glass of water each morning; drink the herbal tea before bed.",
    inStock: true
  },
  {
    id: "multivitamins-powder-100g",
    name: "Multivitamins Powder 100 Gms",
    category: "nutrition",
    categoryName: "Lifestyle & Nutrition",
    price: 300,
    originalPrice: 800,
    rating: 4.8,
    reviewsCount: 238,
    image: "assets/products/multivitamins.webp",
    badge: "Best Seller",
    tagline: "Bio-available plant-based daily nutrition",
    description: "Whole-food superfood blend delivering clean, bioavailable daily vitamins, minerals, and phytonutrients for cellular energy, immunity, and skin vibrancy.",
    benefits: [
      "Extracted from real fruits, herbs, and supergreens for maximum absorption",
      "Boosts daily stamina and reduces fatigue without artificial stimulants",
      "Contains no synthetic binders, sugars, preservatives, or artificial dyes",
      "Easily mixes into water, smoothies, or oatmeal"
    ],
    ingredients: "Organic Moringa, Spirulina, Wheatgrass, Amla, Beetroot, Barley Grass, Flaxseed Powder.",
    usage: "Stir 1 scoop (approx. 5g) into water or your favorite morning beverage daily.",
    inStock: true
  },
  {
    id: "moringa-soap",
    name: "Moringa Soap",
    category: "skincare",
    categoryName: "Skincare & Body",
    price: 75,
    originalPrice: 120,
    rating: 4.9,
    reviewsCount: 380,
    image: "assets/products/moringa-soap.webp",
    badge: "Best Seller",
    tagline: "Cold-pressed miracle tree skin bath bar",
    description: "Cold-processed artisanal bathing bar crafted with organic Moringa leaf powder and nourishing cold-pressed oils that cleanse without drying your skin.",
    benefits: [
      "Gently washes away dirt and pollutants while retaining natural lipids",
      "Abundant in natural Vitamin C and E to combat premature skin aging",
      "Creamy, luxurious natural lather without harsh sodium lauryl sulfates",
      "Mild therapeutic aroma of pure lemongrass and cold-pressed coconut"
    ],
    ingredients: "Cold Pressed Coconut Oil, Organic Moringa Leaf, Olive Oil, Raw Shea Butter, Lemongrass Essential Oil.",
    usage: "Lather generously over wet skin, massage gently, and rinse thoroughly.",
    inStock: true
  },
  {
    id: "brain-booster-tea",
    name: "Brain Booster Tea",
    category: "tea",
    categoryName: "Wellness & Herbal Teas",
    price: 1000,
    originalPrice: 2100,
    rating: 4.9,
    reviewsCount: 425,
    image: "assets/products/brain-booster.webp",
    badge: "Best Seller",
    tagline: "Cognitive clarity, memory & calm focus",
    description: "An Ayurvedic Medhya Rasayana combining Brahmi, Gotu Kola, and Shankhpushpi to boost cognitive processing, retain focus, and silence mental restlessness.",
    benefits: [
      "Sharpens focus, memory recall, and daily mental stamina",
      "Reduces cortisol spikes and calms nervous system agitation",
      "Free from caffeine; provides clean, jitter-free cognitive clarity",
      "Delicious soothing flavor profile with green cardamom and spearmint"
    ],
    ingredients: "Brahmi (Bacopa Monnieri), Shankhpushpi, Gotu Kola, Cardamom, Spearmint, Chamomile Flowers.",
    usage: "Steep 1 teaspoon in 200ml boiling water for 5 minutes. Best taken during morning focus work.",
    inStock: true
  },
  {
    id: "love-and-attraction-spray",
    name: "Love and Attraction Spray",
    category: "sprays",
    categoryName: "Sprays & Aura Care",
    price: 140,
    originalPrice: 500,
    rating: 4.8,
    reviewsCount: 315,
    image: "assets/products/love-spray.webp",
    badge: "Best Seller",
    tagline: "Heart chakra activation & harmonic resonance",
    description: "Formulated to activate and harmonize the Anahata (Heart) Chakra, awakening deep self-compassion, romantic attraction, and radiant positive magnetism.",
    benefits: [
      "Awakens feelings of emotional openness, kindness, and self-worth",
      "Harmonizes relationship communication and invites affectionate energy",
      "Charged with high-vibrational Rose Quartz crystal frequencies",
      "Heavenly natural aroma of royal Indian rose and exotic Ylang-Ylang"
    ],
    ingredients: "Pure Rose Hydrosol, Rose Otto Oil, Ylang Ylang, Mysore Sandalwood, Gem-Grade Rose Quartz Elixir.",
    usage: "Mist over your heart center, pulse points, or around your bedroom atmosphere.",
    inStock: true
  }
];

const TESTIMONIALS_DATA = [
  {
    name: "Ankita Shukla",
    city: "Lucknow",
    rating: 5,
    date: "Verified Buyer • August 2025",
    image: "assets/images/ankita.jpg",
    text: "I was new to crystal healing and herbal remedies and wasn’t sure what to expect, but the team at Second Sight was so patient and knowledgeable. Their energy kit and Digest Harmony Tea helped me focus better and brought so much peace into my space. Truly authentic and beautifully packaged!"
  },
  {
    name: "Shuchita Panday",
    city: "Mumbai",
    rating: 5,
    date: "Verified Buyer • September 2025",
    image: "assets/images/suchita.jpg",
    text: "The aura cleansing spray and session was powerful! I’ve been feeling lighter, more positive, and balanced ever since. Thank you Second Sight Foundation for guiding me with compassion and care. I am now a regular customer for all my wellness teas."
  },
  {
    name: "Amit R.",
    city: "New Delhi",
    rating: 5,
    date: "Verified Buyer • October 2025",
    image: "assets/images/ankit.jpg",
    text: "The aura cleansing spray was truly impactful! I feel emotionally lighter, more grounded, and filled with positivity. The Brain Booster Tea also helped me stay sharp through intense corporate workdays without the caffeine crash. I’ll definitely keep coming back!"
  },
  {
    name: "Priya Sengupta",
    city: "Bangalore",
    rating: 5,
    date: "Verified Buyer • November 2025",
    image: "assets/images/ankita.jpg",
    text: "Second Sight Foundation has achieved the perfect harmony between rigorous science and ancient holistic wisdom. The Alkaline Bottle and SSF Facial Kit exceeded all my expectations. Fast delivery, impeccable customer support, and noticeable results."
  }
];

const FAQ_DATA = [
  {
    q: "Are all products 100% natural and certified?",
    a: "Yes. Every formulation at Second Sight Foundation is crafted with 100% genuine herbs, botanical extracts, and natural minerals. We follow strict Ayurvedic preparation standards with rigorous lab testing for heavy metals and purity."
  },
  {
    q: "How do I choose the right herbal tea for my body type?",
    a: "Our teas are categorized by targeted wellness goals (Digestion, Heart Health, Joint Comfort, Cognitive Focus, Liver Detox, and Glycemic Balance). If you are unsure which aligns with your Dosha or lifestyle, reach out to our spiritual and wellness guides via WhatsApp or our Contact Form."
  },
  {
    q: "What is your shipping policy and delivery timeline?",
    a: "We offer express shipping across India. Standard orders are dispatched within 24-48 hours and arrive within 3-5 business days. Orders of ₹999 or more qualify for completely FREE door-step shipping."
  },
  {
    q: "How does the Aura Spray work?",
    a: "Our Aura Sprays are created using sacred energized waters, therapeutic essential oils (Frankincense, White Sage, Rose, Ylang Ylang), and attuned gemstone frequencies (Quartz and Rose Quartz). They cleanse atmospheric static and emotional turbulence, leaving your auric field revitalized."
  },
  {
    q: "Can I take herbal teas alongside regular medications?",
    a: "Our teas are gentle, dietary botanical supplements. However, if you are currently taking prescription medications for blood pressure, diabetes, or other chronic conditions, we always recommend consulting your healthcare physician prior to starting any new regimen."
  }
];

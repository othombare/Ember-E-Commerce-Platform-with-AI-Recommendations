const seedProducts = [
  {
    "id": "urban-essentials-tee",
    "name": "Urban Essentials Tee",
    "category": "T-Shirts",
    "image": "/uploads/products/urban-ember-tee.svg",
    "price": 899,
    "oldPrice": 1299,
    "rating": 4.7,
    "reviews": 212,
    "sold": 286,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "men",
      "genz",
      "new",
      "ai-pick"
    ],
    "shortDescription": "Breathable cotton tee with a modern regular fit and premium finish.",
    "stock": 120
  },
  {
    "id": "slate-runner-joggers",
    "name": "Slate Runner Joggers",
    "category": "Joggers",
    "image": "/uploads/products/midnight-run-joggers.svg",
    "price": 1249,
    "oldPrice": 1799,
    "rating": 4.6,
    "reviews": 184,
    "sold": 249,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "tags": [
      "men",
      "genz",
      "active"
    ],
    "shortDescription": "Stretch-fabric joggers built for daily commute, gym, and travel.",
    "stock": 104
  },
  {
    "id": "olive-utility-cargo",
    "name": "Olive Utility Cargo",
    "category": "Cargoes",
    "image": "/uploads/products/storm-cargo.svg",
    "price": 1399,
    "oldPrice": 1999,
    "rating": 4.5,
    "reviews": 156,
    "sold": 201,
    "isNew": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "men",
      "utility",
      "genz"
    ],
    "shortDescription": "Tapered utility cargo with secure pockets and all-day comfort.",
    "stock": 88
  },
  {
    "id": "ocean-knit-polo",
    "name": "Ocean Knit Polo",
    "category": "Polo's",
    "image": "/uploads/products/coastal-polo.svg",
    "price": 999,
    "oldPrice": 1499,
    "rating": 4.4,
    "reviews": 132,
    "sold": 172,
    "isNew": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "men",
      "smart-casual"
    ],
    "shortDescription": "Soft knit polo that works for office days and weekend outings.",
    "stock": 91
  },
  {
    "id": "charcoal-active-tee",
    "name": "Charcoal Active Tee",
    "category": "Active Wear",
    "image": "/uploads/products/motion-dry-tee.svg",
    "price": 949,
    "oldPrice": 1399,
    "rating": 4.8,
    "reviews": 241,
    "sold": 312,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "tags": [
      "men",
      "active",
      "ai-pick",
      "genz"
    ],
    "shortDescription": "Quick-dry performance tee engineered for intense workouts.",
    "stock": 134
  },
  {
    "id": "cloudline-hoodie",
    "name": "Cloudline Hoodie",
    "category": "Hoodies & Jackets",
    "image": "/uploads/products/arctic-hoodie.svg",
    "price": 1899,
    "oldPrice": 2599,
    "rating": 4.7,
    "reviews": 176,
    "sold": 228,
    "isNew": true,
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "tags": [
      "men",
      "winter",
      "new"
    ],
    "shortDescription": "Heavyweight fleece hoodie with clean trims and roomy comfort.",
    "stock": 72
  },
  {
    "id": "rose-drape-saree",
    "name": "Rose Drape Saree",
    "category": "Sarees",
    "image": "/uploads/products/regal-bloom-saree.svg",
    "price": 2499,
    "oldPrice": 3399,
    "rating": 4.8,
    "reviews": 165,
    "sold": 214,
    "isNew": true,
    "sizes": [
      "Free"
    ],
    "tags": [
      "women",
      "new-collection",
      "ai-pick"
    ],
    "shortDescription": "Elegant festive saree with rich drape and premium woven shine.",
    "stock": 58
  },
  {
    "id": "pearl-weave-saree",
    "name": "Pearl Weave Saree",
    "category": "Sarees",
    "image": "/uploads/products/dawn-luxe-saree.svg",
    "price": 2299,
    "oldPrice": 3199,
    "rating": 4.7,
    "reviews": 143,
    "sold": 193,
    "isNew": false,
    "sizes": [
      "Free"
    ],
    "tags": [
      "women",
      "new-collection"
    ],
    "shortDescription": "Lightweight saree with refined weave for effortless occasion wear.",
    "stock": 66
  },
  {
    "id": "ivory-kurta-set",
    "name": "Ivory Kurta Set",
    "category": "Kurtas & Suits",
    "image": "/uploads/products/aurora-kurta-set.svg",
    "price": 1999,
    "oldPrice": 2799,
    "rating": 4.6,
    "reviews": 151,
    "sold": 207,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "women",
      "ethnic",
      "new"
    ],
    "shortDescription": "Contemporary kurta set with breathable lining and flattering cut.",
    "stock": 86
  },
  {
    "id": "meadow-kurta-set",
    "name": "Meadow Kurta Set",
    "category": "Kurtas & Suits",
    "image": "/uploads/products/heritage-kurta-set.svg",
    "price": 1899,
    "oldPrice": 2699,
    "rating": 4.5,
    "reviews": 118,
    "sold": 166,
    "isNew": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "women",
      "ethnic"
    ],
    "shortDescription": "Graceful kurta suit designed for festive events and family functions.",
    "stock": 79
  },
  {
    "id": "festive-foil-dupatta",
    "name": "Festive Foil Dupatta",
    "category": "Dupatta",
    "image": "/uploads/products/festive-dupatta.svg",
    "price": 799,
    "oldPrice": 1199,
    "rating": 4.4,
    "reviews": 96,
    "sold": 145,
    "isNew": true,
    "sizes": [
      "Free"
    ],
    "tags": [
      "women",
      "ethnic",
      "new"
    ],
    "shortDescription": "Featherlight dupatta with festive foil accents and smooth fall.",
    "stock": 102
  },
  {
    "id": "city-party-kurta",
    "name": "City Party Kurta",
    "category": "Party Wear",
    "image": "/uploads/products/city-partywear.svg",
    "price": 2099,
    "oldPrice": 2999,
    "rating": 4.7,
    "reviews": 159,
    "sold": 218,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "women",
      "occasion",
      "ai-pick",
      "new"
    ],
    "shortDescription": "Statement party-wear kurta made for premium evening styling.",
    "stock": 64
  },
  {
    "id": "kid-street-jeans",
    "name": "Kid Street Jeans",
    "category": "Jeans",
    "image": "/uploads/products/street-denim-jeans.svg",
    "price": 1099,
    "oldPrice": 1599,
    "rating": 4.6,
    "reviews": 133,
    "sold": 182,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "kids",
      "genz",
      "new"
    ],
    "shortDescription": "Durable stretch-denim jeans made for daily active comfort.",
    "stock": 108
  },
  {
    "id": "kid-cargo-jeans",
    "name": "Kid Cargo Jeans",
    "category": "Jeans",
    "image": "/uploads/products/cargo-denim-jeans.svg",
    "price": 1199,
    "oldPrice": 1699,
    "rating": 4.5,
    "reviews": 117,
    "sold": 163,
    "isNew": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "kids",
      "streetwear"
    ],
    "shortDescription": "Cargo-inspired jeans with utility pockets and relaxed fit.",
    "stock": 93
  },
  {
    "id": "mini-check-shirt",
    "name": "Mini Check Shirt",
    "category": "Shirts",
    "image": "/uploads/products/coastal-check-shirt.svg",
    "price": 999,
    "oldPrice": 1499,
    "rating": 4.6,
    "reviews": 108,
    "sold": 149,
    "isNew": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "kids",
      "daily"
    ],
    "shortDescription": "Soft checked shirt with easy-care fabric and comfortable fit.",
    "stock": 97
  },
  {
    "id": "mini-oxford-shirt",
    "name": "Mini Oxford Shirt",
    "category": "Shirts",
    "image": "/uploads/products/oxford-ease-shirt.svg",
    "price": 1049,
    "oldPrice": 1549,
    "rating": 4.5,
    "reviews": 96,
    "sold": 138,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "kids",
      "daily",
      "new"
    ],
    "shortDescription": "Classic oxford shirt with neat structure and soft handfeel.",
    "stock": 84
  },
  {
    "id": "youth-sport-jogger",
    "name": "Youth Sport Jogger",
    "category": "Active Wear",
    "image": "/uploads/products/velocity-active-jogger.svg",
    "price": 999,
    "oldPrice": 1449,
    "rating": 4.7,
    "reviews": 148,
    "sold": 204,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "kids",
      "active",
      "genz",
      "ai-pick"
    ],
    "shortDescription": "Athletic jogger built for sports practice and outdoor play.",
    "stock": 119
  },
  {
    "id": "junior-graphic-tee",
    "name": "Junior Graphic Tee",
    "category": "T-Shirts",
    "image": "/uploads/products/neon-grid-tee.svg",
    "price": 849,
    "oldPrice": 1249,
    "rating": 4.6,
    "reviews": 130,
    "sold": 189,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "kids",
      "genz",
      "new"
    ],
    "shortDescription": "Trendy graphic tee with durable print and everyday softness.",
    "stock": 136
  },
  {
    "id": "maroon-club-polo",
    "name": "Maroon Club Polo",
    "category": "Polo's",
    "image": "/uploads/products/maroon-club-polo.svg",
    "price": 1099,
    "oldPrice": 1599,
    "rating": 4.5,
    "reviews": 109,
    "sold": 141,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "men",
      "smart-casual",
      "new"
    ],
    "shortDescription": "Classic polo silhouette in rich maroon for elevated casual looks.",
    "stock": 95
  },
  {
    "id": "sandstorm-utility-joggers",
    "name": "Sandstorm Utility Joggers",
    "category": "Joggers",
    "image": "/uploads/products/sandstorm-joggers.svg",
    "price": 1299,
    "oldPrice": 1849,
    "rating": 4.6,
    "reviews": 121,
    "sold": 168,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "tags": [
      "men",
      "active",
      "utility",
      "new"
    ],
    "shortDescription": "Athleisure joggers with cargo detailing and stretch waistband.",
    "stock": 89
  },
  {
    "id": "emberline-winter-hoodie",
    "name": "Emberline Winter Hoodie",
    "category": "Hoodies & Jackets",
    "image": "/uploads/products/emberline-hoodie.svg",
    "price": 2099,
    "oldPrice": 2899,
    "rating": 4.8,
    "reviews": 142,
    "sold": 177,
    "isNew": true,
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "tags": [
      "men",
      "winter",
      "new",
      "ai-pick"
    ],
    "shortDescription": "Insulated heavyweight hoodie designed for cold-weather layering.",
    "stock": 67
  },
  {
    "id": "silkline-festival-dupatta",
    "name": "Silkline Festival Dupatta",
    "category": "Dupatta",
    "image": "/uploads/products/silkline-dupatta.svg",
    "price": 899,
    "oldPrice": 1299,
    "rating": 4.5,
    "reviews": 90,
    "sold": 126,
    "isNew": true,
    "sizes": [
      "Free"
    ],
    "tags": [
      "women",
      "ethnic",
      "new-collection"
    ],
    "shortDescription": "Silky festive dupatta with subtle sheen and ornate border styling.",
    "stock": 92
  },
  {
    "id": "active-flex-top",
    "name": "Active Flex Top",
    "category": "Active Wear",
    "image": "/uploads/products/active-flex-top.svg",
    "price": 1099,
    "oldPrice": 1549,
    "rating": 4.7,
    "reviews": 113,
    "sold": 151,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "women",
      "active",
      "genz",
      "ai-pick"
    ],
    "shortDescription": "Performance training top with body-hugging comfort stretch.",
    "stock": 87
  },
  {
    "id": "mint-breeze-shorts",
    "name": "Mint Breeze Shorts",
    "category": "Shorts",
    "image": "/uploads/products/mint-shorts.svg",
    "price": 949,
    "oldPrice": 1399,
    "rating": 4.4,
    "reviews": 84,
    "sold": 114,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "women",
      "summer",
      "new"
    ],
    "shortDescription": "Lightweight summer shorts with airy fabric and soft waistband.",
    "stock": 103
  },
  {
    "id": "junior-formal-shirt",
    "name": "Junior Formal Shirt",
    "category": "Formals",
    "image": "/uploads/products/ice-formal-shirt.svg",
    "price": 1199,
    "oldPrice": 1699,
    "rating": 4.5,
    "reviews": 77,
    "sold": 99,
    "isNew": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "kids",
      "formals"
    ],
    "shortDescription": "Clean formal shirt tailored for ceremonies and special events.",
    "stock": 76
  },
  {
    "id": "junior-linen-shirt",
    "name": "Junior Linen Shirt",
    "category": "Shirts",
    "image": "/uploads/products/linen-office-shirt.svg",
    "price": 1149,
    "oldPrice": 1649,
    "rating": 4.4,
    "reviews": 69,
    "sold": 92,
    "isNew": false,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "kids",
      "daily"
    ],
    "shortDescription": "Soft linen blend shirt ideal for school functions and outings.",
    "stock": 81
  },
  {
    "id": "sunset-play-shorts",
    "name": "Sunset Play Shorts",
    "category": "Shorts",
    "image": "/uploads/products/sunset-shorts.svg",
    "price": 849,
    "oldPrice": 1249,
    "rating": 4.6,
    "reviews": 94,
    "sold": 137,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "kids",
      "summer",
      "genz"
    ],
    "shortDescription": "Easy movement shorts crafted for playground comfort and durability.",
    "stock": 116
  },
  {
    "id": "cargo-terrain-pants",
    "name": "Cargo Terrain Pants",
    "category": "Cargoes",
    "image": "/uploads/products/cargo-terrain.svg",
    "price": 1499,
    "oldPrice": 2099,
    "rating": 4.6,
    "reviews": 103,
    "sold": 146,
    "isNew": true,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tags": [
      "men",
      "utility",
      "new"
    ],
    "shortDescription": "Structured cargo pants with modern tapered silhouette and depth pockets.",
    "stock": 83
  }
]

export default seedProducts

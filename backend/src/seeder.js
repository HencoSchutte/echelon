import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import bcrypt from "bcryptjs";

// Models
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";

dotenv.config({ path: "../.env" });

/* ===============================
   DATABASE CONNECTION
================================= */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

/* ===============================
   USERS
================================= */
const users = [
  {
    name: "Admin User",
    email: "admin@echelon.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "John Doe",
    email: "john@echelon.com",
    password: "password",
    role: "customer",
  },
  {
    name: "Jane Smith",
    email: "jane@echelon.com",
    password: "password",
    role: "customer",
  },
];

/* ===============================
   PRODUCTS (High-End Focused)
================================= */
const brands = {
  GPU: ["NVIDIA", "ASUS", "MSI", "Gigabyte"],
  CPU: ["AMD", "Intel"],
  Laptop: ["ASUS", "Razer", "Lenovo", "MSI"],
  Mobile: ["Apple", "Samsung"],
  RAM: ["Corsair", "G.Skill", "Kingston"],
  Storage: ["Samsung", "WD", "Seagate"],
  Monitor: ["LG", "Samsung", "Alienware"],
};

const tierPrices = {
  extreme: [30000, 50000],
  high: [12000, 30000],
};

const productTemplates = {
  GPU: [
    { name: "RTX 4090", specs: { vram: 24, cudaCores: 16384 } },
    { name: "RTX 4080 Super", specs: { vram: 16, cudaCores: 10240 } },
    { name: "RTX 4070 Ti", specs: { vram: 12, cudaCores: 7680 } },
  ],
  CPU: [
    { name: "Ryzen 9 7950X", specs: { cores: 16, threads: 32 } },
    { name: "Ryzen 7 7800X3D", specs: { cores: 8, threads: 16 } },
    { name: "Core i9-14900K", specs: { cores: 24, threads: 32 } },
  ],
  Laptop: [
    { name: "ROG Strix Gaming Laptop", specs: { ram: 32, gpu: "RTX 4080" } },
    { name: "Razer Blade Pro", specs: { ram: 32, gpu: "RTX 4070" } },
  ],
  Mobile: [
    { name: "iPhone 15 Pro Max", specs: { storage: 256, display: "OLED" } },
    { name: "Galaxy S24 Ultra", specs: { storage: 256, display: "AMOLED" } },
  ],
  RAM: [
    { name: "DDR5 Performance Kit", specs: { capacity: 32, speed: 6000 } },
    { name: "Extreme DDR5 Kit", specs: { capacity: 64, speed: 6400 } },
  ],
  Storage: [
    { name: "990 Pro NVMe", specs: { capacity: 2000, readSpeed: 7450 } },
    { name: "SN850X NVMe", specs: { capacity: 2000, readSpeed: 7300 } },
  ],
  Monitor: [
    { name: "4K Gaming Monitor", specs: { refreshRate: 144, size: 32 } },
    { name: "Ultrawide Pro Display", specs: { refreshRate: 165, size: 34 } },
  ],
};

const imagesByCategory = {
  GPU: [
    "https://images.unsplash.com/photo-1591488320449-011701bb6704",
    "https://images.unsplash.com/photo-1587202372775-a0f6a0d5d0b1",
    "https://images.unsplash.com/photo-1618410320928-25228d811631",
    "https://images.unsplash.com/photo-1587202372616-b43abea06c2a",
    "https://images.unsplash.com/photo-1624705002806-5d72df19c3e9",
  ],
  CPU: [
    "https://images.unsplash.com/photo-1587202372599-c3c3f52f4f7b",
    "https://images.unsplash.com/photo-1591799265444-d66432b91588",
    "https://images.unsplash.com/photo-1587202372639-32705eab4a9d",
  ],
  Laptop: [
    "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
  ],
  Mobile: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
    "https://images.unsplash.com/photo-1605236453806-6ff36851218e",
  ],
  RAM: [
    "https://images.unsplash.com/photo-1562976540-1502c2145186",
    "https://images.unsplash.com/photo-1591799265444-d66432b91588",
  ],
  Storage: [
    "https://images.unsplash.com/photo-1624705002806-5d72df19c3e9",
    "https://images.unsplash.com/photo-1587202372639-32705eab4a9d",
  ],
  Monitor: [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    "https://images.unsplash.com/photo-1587614382346-4ec70e388b28",
  ],
};

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice([min, max]) {
  return Math.floor(Math.random() * (max - min) + min);
}

const products = [];

let id = 1;

Object.keys(productTemplates).forEach((category) => {
  for (let i = 0; i < 8; i++) {
    const template = randomFrom(productTemplates[category]);
    const performanceTier = Math.random() > 0.4 ? "extreme" : "high";

    products.push({
      name: template.name + " " + (i + 1),
      brand: randomFrom(brands[category]),
      category,
      price: randomPrice(tierPrices[performanceTier]),
      costPrice: randomPrice([5000, 20000]),
      stock: Math.floor(Math.random() * 10) + 1,
      condition: "new",
      performanceTier,
      warrantyMonths: 24 + Math.floor(Math.random() * 12),
      rating: (Math.random() * 1 + 4).toFixed(1),
      reviewCount: Math.floor(Math.random() * 2000),
      tags: [category.toLowerCase(), "premium", "gaming"],
      specifications: template.specs,
      images: [
        randomFrom(imagesByCategory[category]),
        randomFrom(imagesByCategory[category]),
        randomFrom(imagesByCategory[category]),
      ],
      description: `High-end ${category} built for performance and reliability.`,
    });

    id++;
  }
});

export default products;


/* ===============================
   IMPORT FUNCTION
================================= */
const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const createdUsers = await User.insertMany(hashedUsers);
    const createdProducts = await Product.insertMany(products);

    const john = createdUsers.find((u) => u.email === "john@echelon.com");
    const jane = createdUsers.find((u) => u.email === "jane@echelon.com");

    /* ===============================
       SAMPLE ORDERS (For Reports)
    ================================= */

    await Order.create([
  // John's first big order
  {
    user: john._id,
    products: [
      {
        product: createdProducts[0]._id, // RTX 4090
        name: createdProducts[0].name,
        price: createdProducts[0].price,
        quantity: 1,
      },
      {
        product: createdProducts[1]._id, // Ryzen 9
        name: createdProducts[1].name,
        price: createdProducts[1].price,
        quantity: 1,
      },
    ],
    totalPrice:
      createdProducts[0].price +
      createdProducts[1].price,
    paymentMethod: "card",
    status: "complete",
  },

  // John's second order
  {
    user: john._id,
    products: [
      {
        product: createdProducts[3]._id, // RAM
        name: createdProducts[3].name,
        price: createdProducts[3].price,
        quantity: 2,
      },
    ],
    totalPrice:
      createdProducts[3].price * 2,
    paymentMethod: "card",
    status: "complete",
  },

  // Jane order
  {
    user: jane._id,
    products: [
      {
        product: createdProducts[2]._id, // iPhone
        name: createdProducts[2].name,
        price: createdProducts[2].price,
        quantity: 1,
      },
    ],
    totalPrice: createdProducts[2].price,
    paymentMethod: "paypal",
    status: "complete",
  },

  // Another Jane order (repeat customer)
  {
    user: jane._id,
    products: [
      {
        product: createdProducts[3]._id,
        name: createdProducts[3].name,
        price: createdProducts[3].price,
        quantity: 1,
      },
    ],
    totalPrice: createdProducts[3].price,
    paymentMethod: "card",
    status: "complete",
  },
]);



    console.log("🌟 Echelon Data Imported Successfully!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

/* ===============================
   RUN SEEDER
================================= */
connectDB().then(importData);

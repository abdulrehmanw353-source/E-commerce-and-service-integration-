import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { MONGO_URI } from "../constants.js";

import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Booking from "../models/booking.model.js";
import Technician from "../models/technician.model.js";
import Service from "../models/service.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

import { productCatalog, bookingTemplates, orderStatuses } from "./mockData.js";

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function dateMinusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function datePlusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function seedDummyData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("(MONGODB CONNECTED) for dummy seeding");

    await Promise.all([
      Message.deleteMany({}),
      Conversation.deleteMany({}),
      Review.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
      Booking.deleteMany({}),
      Technician.deleteMany({}),
      Service.deleteMany({}),
      Product.deleteMany({}),
    ]);
    // Keep a single admin account aligned with "single-admin" policy.
    await User.deleteMany({ email: { $ne: "admin@admin.com" } });

    let admin = await User.findOne({ email: "admin@admin.com", role: "admin" });
    if (!admin) {
      admin = await User.create({
        firstName: "Admin",
        lastName: "DoorSetFix",
        email: "admin@admin.com",
        password: "admin123",
        role: "admin",
      });
      console.log("(SEED) default admin created: admin@admin.com / admin123");
    }

    const customerDocs = await User.insertMany([
      {
        firstName: "Alex",
        lastName: "Chen",
        phoneNo: "03001234567",
        email: "alex.chen@example.com",
        password: "customer123",
        role: "customer",
        address: { street: "Street 10", city: "Lahore", state: "Punjab", country: "Pakistan" },
      },
      {
        firstName: "Maya",
        lastName: "Khan",
        phoneNo: "03007654321",
        email: "maya.khan@example.com",
        password: "customer123",
        role: "customer",
        address: { street: "Canal Road", city: "Lahore", state: "Punjab", country: "Pakistan" },
      },
      {
        firstName: "Usman",
        lastName: "Ali",
        phoneNo: "03112223344",
        email: "usman.ali@example.com",
        password: "customer123",
        role: "customer",
        address: { street: "Blue Area", city: "Islamabad", state: "ICT", country: "Pakistan" },
      },
      {
        firstName: "Sara",
        lastName: "Noor",
        phoneNo: "03223334455",
        email: "sara.noor@example.com",
        password: "customer123",
        role: "customer",
        address: { street: "DHA", city: "Karachi", state: "Sindh", country: "Pakistan" },
      },
      {
        firstName: "Hassan",
        lastName: "Raza",
        phoneNo: "03334445566",
        email: "hassan.raza@example.com",
        password: "customer123",
        role: "customer",
        address: { street: "Model Town", city: "Lahore", state: "Punjab", country: "Pakistan" },
      },
    ]);

    const products = await Product.insertMany(
      productCatalog.map((p, index) => ({
        ...p,
        createdBy: admin._id,
        ratings: 3.8 + (index % 3) * 0.4,
        numReviews: 4 + index,
        createdAt: dateMinusDays(35 - index * 3),
        updatedAt: dateMinusDays(30 - index * 2),
      })),
    );

    // ─── Electronics Repair Services ───────────────────────
    const services = await Service.insertMany([
      {
        title: "Phone Repair",
        slug: "phone-repair",
        shortDesc: "Screen replacement, battery swap, charging port fix, and water damage recovery.",
        description: "Expert smartphone repairs for all brands — iPhone, Samsung, Xiaomi, OnePlus and more. Genuine parts with 90-day warranty.",
        icon: "📱",
        startingPrice: 49,
        isEnabled: true,
        sortOrder: 1,
        createdBy: admin._id,
        updatedBy: admin._id,
      },
      {
        title: "Laptop Repair",
        slug: "laptop-repair",
        shortDesc: "Screen, keyboard, battery, and motherboard repairs for all laptop brands.",
        description: "MacBook, Dell, HP, Lenovo, ASUS — we handle screen replacements, keyboard fixes, SSD upgrades, hinge repairs, and full diagnostics.",
        icon: "💻",
        startingPrice: 79,
        isEnabled: true,
        sortOrder: 2,
        createdBy: admin._id,
        updatedBy: admin._id,
      },
      {
        title: "PC Build & Repair",
        slug: "pc-build-repair",
        shortDesc: "Custom PC builds, hardware upgrades, OS installation, and troubleshooting.",
        description: "From custom gaming rigs to office workstations — we build, upgrade, and repair desktops. GPU, RAM, PSU, thermal paste, and full diagnostics.",
        icon: "🖥️",
        startingPrice: 99,
        isEnabled: true,
        sortOrder: 3,
        createdBy: admin._id,
        updatedBy: admin._id,
      },
      {
        title: "Tablet Repair",
        slug: "tablet-repair",
        shortDesc: "iPad and Android tablet screen, battery, and port repairs.",
        description: "Cracked iPad screen? Tablet not charging? We repair all tablet brands with fast turnaround and quality replacement parts.",
        icon: "📲",
        startingPrice: 59,
        isEnabled: true,
        sortOrder: 4,
        createdBy: admin._id,
        updatedBy: admin._id,
      },
      {
        title: "Data Recovery",
        slug: "data-recovery",
        shortDesc: "Recover lost files from hard drives, SSDs, USB drives, and memory cards.",
        description: "Accidentally deleted files? Drive not recognized? We recover data from damaged, corrupted, or formatted storage devices.",
        icon: "💾",
        startingPrice: 129,
        isEnabled: true,
        sortOrder: 5,
        createdBy: admin._id,
        updatedBy: admin._id,
      },
      {
        title: "Software & OS Services",
        slug: "software-os-services",
        shortDesc: "OS installation, virus removal, driver updates, and performance tuning.",
        description: "Windows, macOS, or Linux — fresh OS installs, malware cleanup, slow PC optimization, and software troubleshooting.",
        icon: "⚙️",
        startingPrice: 39,
        isEnabled: true,
        sortOrder: 6,
        createdBy: admin._id,
        updatedBy: admin._id,
      },
    ]);

    // ─── Electronics Repair Technicians ────────────────────
    const technicians = await Technician.insertMany([
      {
        firstName: "Bilal",
        lastName: "Ahmed",
        email: "bilal.tech@doorsetfix.com",
        phoneNo: "03005550111",
        cnicImage: "https://images.unsplash.com/photo-1520975958225-2b4b85b2edb0?w=1200",
        address: { street: "Gulberg", city: "Lahore", state: "Punjab", country: "Pakistan" },
        expertise: ["phone repair", "tablet repair", "screen replacement"],
        isAvailable: true,
        status: "available",
        activeTasks: 1,
        createdBy: admin._id,
      },
      {
        firstName: "Asad",
        lastName: "Ali",
        email: "asad.tech@doorsetfix.com",
        phoneNo: "03005550222",
        cnicImage: "https://images.unsplash.com/photo-1520975682031-a0c5d0bca10d?w=1200",
        address: { street: "DHA", city: "Karachi", state: "Sindh", country: "Pakistan" },
        expertise: ["laptop repair", "motherboard", "data recovery"],
        isAvailable: true,
        status: "busy",
        activeTasks: 3,
        createdBy: admin._id,
      },
      {
        firstName: "Sara",
        lastName: "Khan",
        email: "sara.tech@doorsetfix.com",
        phoneNo: "03005550333",
        cnicImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200",
        address: { street: "Blue Area", city: "Islamabad", state: "ICT", country: "Pakistan" },
        expertise: ["pc build", "hardware upgrades", "gpu repair"],
        isAvailable: true,
        status: "available",
        activeTasks: 0,
        createdBy: admin._id,
      },
      {
        firstName: "Hamza",
        lastName: "Farooq",
        email: "hamza.tech@doorsetfix.com",
        phoneNo: "03005550444",
        cnicImage: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=1200",
        address: { street: "Model Town", city: "Lahore", state: "Punjab", country: "Pakistan" },
        expertise: ["software", "os installation", "virus removal"],
        isAvailable: false,
        status: "unavailable",
        activeTasks: 0,
        createdBy: admin._id,
      },
    ]);

    // ─── Reviews ───────────────────────────────────────────
    await Review.insertMany(
      products.slice(0, 6).map((product, idx) => ({
        user: customerDocs[idx % customerDocs.length]._id,
        product: product._id,
        rating: 4 + (idx % 2),
        comment: [
          `Excellent quality! The ${product.title} works perfectly with my setup.`,
          `Great value for money. Fast shipping and exactly as described.`,
          `Perfect accessory — been using it daily for weeks with no issues.`,
          `Solid build quality. Highly recommend for anyone with a tech setup.`,
          `Exactly what I needed. Compatible with all my devices.`,
          `Premium feel and great performance. Would buy again!`,
        ][idx],
        createdAt: dateMinusDays(20 - idx * 2),
        updatedAt: dateMinusDays(20 - idx * 2),
      })),
    );

    // ─── Carts ─────────────────────────────────────────────
    await Cart.insertMany(
      customerDocs.slice(0, 3).map((user, idx) => ({
        user: user._id,
        items: [
          {
            product: products[idx]._id,
            quantity: 1 + idx,
            price: products[idx].price,
          },
        ],
      })),
    );



    // ─── Bookings ──────────────────────────────────────────
    await Booking.insertMany(
      bookingTemplates.map((b, idx) => ({
        ...b,
        customer: customerDocs[idx % customerDocs.length]._id,
        preferredDate: datePlusDays((idx % 4) + 1),
        preferredTime: ["10:00", "11:00", "12:00", "14:00"][idx % 4],
        technician: technicians[idx % technicians.length]._id,
        assignedTechnician: `${technicians[idx % technicians.length].firstName} ${technicians[idx % technicians.length].lastName || ""}`.trim(),
        images: [
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200",
        ],
        createdAt: dateMinusDays(18 - idx * 2),
        updatedAt: dateMinusDays(17 - idx * 2),
      })),
    );

    // ─── Orders ────────────────────────────────────────────
    await Order.insertMany(
      Array.from({ length: 9 }).map((_, idx) => {
        const buyer = customerDocs[idx % customerDocs.length];
        const p1 = products[idx % products.length];
        const p2 = products[(idx + 1) % products.length];
        const quantity1 = 1 + (idx % 2);
        const quantity2 = 1;
        const totalAmount = p1.price * quantity1 + p2.price * quantity2;
        const statusObj = orderStatuses[idx % orderStatuses.length];
        return {
          user: buyer._id,
          items: [
            { product: p1._id, title: p1.title, price: p1.price, quantity: quantity1, image: p1.images[0] },
            { product: p2._id, title: p2.title, price: p2.price, quantity: quantity2, image: p2.images[0] },
          ],
          totalAmount,
          status: statusObj.status,
          paymentStatus: statusObj.paymentStatus,
          createdAt: dateMinusDays(28 - idx * 3),
          updatedAt: dateMinusDays(27 - idx * 3),
        };
      }),
    );

    // ─── Chat Conversation ─────────────────────────────────
    const conversation = await Conversation.create({
      customer: customerDocs[0]._id,
      admin: admin._id,
      status: "open",
      lastMessage: "When will my laptop be ready for pickup?",
      lastMessageAt: new Date(),
    });

    await Message.insertMany([
      {
        conversation: conversation._id,
        sender: customerDocs[0]._id,
        senderRole: "customer",
        content: "Hi, I dropped off my MacBook yesterday for a screen repair. Any update?",
        isRead: true,
      },
      {
        conversation: conversation._id,
        sender: admin._id,
        senderRole: "admin",
        content: "Hi Alex! The replacement screen has been installed. We're running final tests now.",
        isRead: true,
      },
      {
        conversation: conversation._id,
        sender: customerDocs[0]._id,
        senderRole: "customer",
        content: "When will my laptop be ready for pickup?",
        isRead: false,
      },
    ]);

    console.log("(DUMMY SEED COMPLETE)");
    console.log(`- Customers: ${customerDocs.length}`);
    console.log(`- Services: ${services.length}`);
    console.log(`- Technicians: ${technicians.length}`);
    console.log(`- Products: ${products.length}`);
    console.log("- Collections: generated from product categories");
    console.log("- Analytics: generated from dated orders/bookings");
    console.log("- Login credentials:");
    console.log("  Admin: admin@admin.com / admin123");
    console.log("  Customer: alex.chen@example.com / customer123");

    process.exit(0);
  } catch (error) {
    console.error("(DUMMY SEED ERROR)", error.message);
    process.exit(1);
  }
}

seedDummyData();

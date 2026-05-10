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
import TimeSlot from "../models/timeSlot.model.js";
import Booking from "../models/booking.model.js";
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
      TimeSlot.deleteMany({}),
      Product.deleteMany({}),
    ]);
    await User.deleteMany({ email: { $ne: "admin@admin.com" } });

    let admin = await User.findOne({ email: "admin@admin.com", role: "admin" });
    if (!admin) {
      admin = await User.create({
        firstName: "Super",
        lastName: "Admin",
        email: "super.admin@gmail.com",
        password: "Admin123#",
        role: "admin",
      });
      console.log("(SEED) default admin created: super.admin@gmail.com / Admin123#");
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

    await Review.insertMany(
      products.slice(0, 5).map((product, idx) => ({
        user: customerDocs[idx % customerDocs.length]._id,
        product: product._id,
        rating: 4 + (idx % 2),
        comment: `Great quality and service for ${product.title}.`,
        createdAt: dateMinusDays(20 - idx * 2),
        updatedAt: dateMinusDays(20 - idx * 2),
      })),
    );

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

    const slots = await TimeSlot.insertMany([
      { date: datePlusDays(1), startTime: "10:00", endTime: "11:00", maxBookings: 2, currentBookings: 1, isAvailable: true, createdBy: admin._id },
      { date: datePlusDays(1), startTime: "12:00", endTime: "13:00", maxBookings: 2, currentBookings: 2, isAvailable: false, createdBy: admin._id },
      { date: datePlusDays(2), startTime: "09:00", endTime: "10:00", maxBookings: 3, currentBookings: 1, isAvailable: true, createdBy: admin._id },
      { date: datePlusDays(2), startTime: "15:00", endTime: "16:00", maxBookings: 1, currentBookings: 0, isAvailable: true, createdBy: admin._id },
    ]);

    await Booking.insertMany(
      bookingTemplates.map((b, idx) => ({
        ...b,
        customer: customerDocs[idx % customerDocs.length]._id,
        preferredDate: datePlusDays((idx % 4) + 1),
        preferredTimeSlot: slots[idx % slots.length]._id,
        images: [
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200",
        ],
        createdAt: dateMinusDays(18 - idx * 2),
        updatedAt: dateMinusDays(17 - idx * 2),
      })),
    );

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

    const conversation = await Conversation.create({
      customer: customerDocs[0]._id,
      admin: admin._id,
      status: "open",
      lastMessage: "Can you confirm technician ETA?",
      lastMessageAt: new Date(),
    });

    await Message.insertMany([
      {
        conversation: conversation._id,
        sender: customerDocs[0]._id,
        senderRole: "customer",
        content: "Hi, I need an update on my booking.",
        isRead: true,
      },
      {
        conversation: conversation._id,
        sender: admin._id,
        senderRole: "admin",
        content: "Sure, technician is assigned and will arrive by 11:00 AM.",
        isRead: true,
      },
      {
        conversation: conversation._id,
        sender: customerDocs[0]._id,
        senderRole: "customer",
        content: "Can you confirm technician ETA?",
        isRead: false,
      },
    ]);

    console.log("(DUMMY SEED COMPLETE)");
    console.log(`- Customers: ${customerDocs.length}`);
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

import { pgTable, text, timestamp, uuid, varchar, serial } from "drizzle-orm/pg-core";

// --- Tabel Users (Tetap sama) ---
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    name: text("name"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// --- Tabel Jobs (Tetap sama) ---
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

// --- 🚀 PERBAIKAN DI SINI ---
// Nama variabel 'blogsTable' diubah menjadi 'blogs'
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }),
  content: text("content"),
  author_id: uuid("author_id").references(() => users.id, { onDelete: 'set null' }),
  image_url: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type Blog = typeof blogs.$inferSelect; // Disesuaikan
export type NewBlog = typeof blogs.$inferInsert; // Disesuaikan


// --- Tabel Portfolios (Publik, tanpa userId) ---
export const portfoliosTable = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

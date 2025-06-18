
import { serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const uiConfigTable = pgTable('ui_config', {
  id: serial('id').primaryKey(),
  button_text: text('button_text').notNull(),
  button_color: text('button_color').notNull(),
  button_action: text('button_action'), // Nullable by default for no action
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript type for the table schema
export type UIConfig = typeof uiConfigTable.$inferSelect; // For SELECT operations
export type NewUIConfig = typeof uiConfigTable.$inferInsert; // For INSERT operations

// Important: Export all tables for proper query building
export const tables = { uiConfig: uiConfigTable };

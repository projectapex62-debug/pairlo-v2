import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  pairId: text("pair_id").notNull(),
  stayName: text("stay_name").notNull(),
  carName: text("car_name").notNull(),
  destination: text("destination").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  nights: integer("nights").notNull(),
  guestFirstName: text("guest_first_name").notNull(),
  guestLastName: text("guest_last_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  stayTotal: real("stay_total").notNull(),
  carTotal: real("car_total").notNull(),
  tax: real("tax").notNull(),
  grandTotal: real("grand_total").notNull(),
  stayConfirmation: text("stay_confirmation").notNull(),
  carConfirmation: text("car_confirmation").notNull(),
  pairloReference: text("pairlo_reference").notNull(),
  status: text("status", { enum: ["pending","confirmed","failed"] }).notNull().default("confirmed"),
  stayCommission: real("stay_commission").notNull(),
  carCommission: real("car_commission").notNull(),
  totalCommission: real("total_commission").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

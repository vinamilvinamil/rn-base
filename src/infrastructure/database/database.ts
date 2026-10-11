import * as SQLite from "expo-sqlite";
import { CREATE_TABLES_SQL } from "./schema";

let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (!database) database = await SQLite.openDatabaseAsync("eyecare.db");
  return database;
}

export async function initializeDatabase() {
  const db = await getDatabase();

  // 1. Cấu hình PRAGMA hệ thống trước
  await db.execAsync("PRAGMA journal_mode = WAL;");

  // 2. Tách chuỗi SQL dài thành một mảng các câu lệnh đơn dựa trên dấu chấm phẩy
  const statements = CREATE_TABLES_SQL.split(";")
    .map((cmd) => cmd.trim())
    .filter((cmd) => cmd.length > 0); // Loại bỏ các khoảng trắng thừa hoặc dòng trống

  // 3. Thực thi tuần tự từng câu lệnh một cách an toàn
  for (const statement of statements) {
    await db.execAsync(`${statement};`);
  }

  console.log("[EyeCare] All database tables initialized successfully.");
}

import express from "express";
export const router = express.Router();
import mysql from "mysql";
import util from "util";
import { conn } from "../connectdb";

router.get("/", (req, res) => {
  const query = `
      SELECT 
    sa.month AS month,
    sa.year AS year,
    COUNT(sa.serial_no) AS total_cars_sold,
    SUM(sa.price) AS total_sales_amount
    FROM sales sa
    GROUP BY  sa.year,  sa.month
    ORDER BY total_cars_sold DESC;
    `;

  conn.query(query, (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "An error occurred while fetching data." });
      return;
    }
    res.json(result);
  });
});

router.get("/:month/:year/:count", (req, res) => {
    let month = req.params.month;
    let year = req.params.year;
    let count = req.params.count;
  
    conn.query(
      `SELECT s.name, COUNT(sa.serial_no) AS total_cars_sold
       FROM salesperson s
       JOIN sales sa ON s.salesperson_id = sa.salesperson_id
       WHERE sa.month = ? AND sa.year = ?
       GROUP BY s.name
       HAVING COUNT(sa.serial_no) >= ?
       ORDER BY total_cars_sold DESC;`,
      [month, year, count],
      (err, result, fields) => {
        if (err) {
          res.status(500).json({ error: err.message });
          console.error(err);
          return;
        }
        res.json(result);
      }
    );
  });

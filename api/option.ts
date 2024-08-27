import express from "express";
export const router =express.Router();
import mysql from "mysql";
import util from "util";
import { conn } from "../connectdb";



// ดึง option ทั้งหมด  เสร็จแล้ว
router.get("/", (req, res) => {
    conn.query(
        `SELECT c.brand, c.model, o1.option_name
         FROM car c
         JOIN options o1 ON c.serial_no = o1.serial_no`,
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                console.error(err);
                return;
            }

            // จัดกลุ่มข้อมูลในแบบที่คุณต้องการ
            const groupedCars = result.reduce((acc: { brand: string; model: string; options: string[] }[], current: { brand: any; model: string; option_name: string; }) => {
                const key = `${current.brand} ${current.model}`;
                const existingCar = acc.find(car => `${car.brand} ${car.model}` === key);

                if (existingCar) {
                    existingCar.options.push(current.option_name.trim());
                } else {
                    acc.push({
                        brand: current.brand,
                        model: current.model.trim(),
                        options: [current.option_name.trim()]
                    });
                }

                return acc;
            }, []);

            res.json(groupedCars);
        }
    );
});

router.get("/getAllCarOpt", (req, res) => {
    const query = `
      SELECT 
        c.serial_no,
        c.brand,
        c.model,
        c.price,
        COALESCE(SUM(o.price), 0) AS total_option_price,
        c.price + COALESCE(SUM(o.price), 0) AS total_price
      FROM car c
      LEFT JOIN options o ON c.serial_no = o.serial_no
      GROUP BY 
        c.serial_no, 
        c.brand, 
        c.model, 
        c.price;
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
  
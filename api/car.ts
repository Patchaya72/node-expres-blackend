import express from "express";
export const router =express.Router();
import mysql from "mysql";
import util from "util";
import { conn } from "../connectdb";
import { CarGetRespons } from "../model/carGetRespons";


// ดึง branch ทั้งหมด  เสร็จแล้ว
router.get("/", (req, res) => {
    conn.query(
      "SELECT * from car",
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

  router.get("/economiccar", (req, res) => {
    conn.query(
      "SELECT * from economiccar",
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

  router.get("/expensivecar", (req, res) => {
    conn.query(
      "SELECT * from expensivecar",
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

  router.get("/luxuriouscar", (req, res) => {
    conn.query(
      "SELECT * from luxuriouscar",
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

//เพิ่ม car  เสร็จแล้ว
router.post("/:table", (req, res) => {
    let table=req.params.table;
    let car: CarGetRespons = req.body;
    let sql = `INSERT INTO \`${table}\` (\`serial_no\`, \`brand\`, \`model\`, \`manufacturer\`, \`price\`) VALUES (?, ?, ?, ?, ?)`;
    sql = mysql.format(sql, [car.serial_no, car.brand, car.model, car.manufacturer, car.price]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(202)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });


//แก้ไข branch เสร็จแล้ว
router.put("/:name/:id", async (req, res) => {
    let id = String(req.params.id);
    let table =String(req.params.name) 
    
    let car: CarGetRespons = req.body;
    let carOriginal: CarGetRespons | undefined;
    const queryAsync = util.promisify(conn.query).bind(conn);

    try {
        // Fetch original car details
        let sql = mysql.format(`SELECT * FROM  \`${table}\` WHERE serial_no = ?`, [id]);
        let result = await queryAsync(sql);
        const rawData = JSON.parse(JSON.stringify(result));
        console.log(rawData);
        carOriginal = rawData[0] as CarGetRespons;

        if (!carOriginal) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Merge updated car details
        let updateExpensivecar = { ...carOriginal, ...car };

        // Update car details in database
        sql = `UPDATE \`${table}\` SET \`serial_no\` = ?, \`brand\` = ?, \`model\` = ?, \`manufacturer\` = ?, \`price\` = ? WHERE \`serial_no\` = ?`;
        sql = mysql.format(sql, [updateExpensivecar.serial_no, updateExpensivecar.brand, updateExpensivecar.model, updateExpensivecar.manufacturer, updateExpensivecar.price, id]);
        
        // Use promise-based query execution
        await queryAsync(sql);
        res.status(200).json({ message: 'Car updated successfully' });
    } catch (err) {
        console.error('Database error:', err); // Log the actual error
        res.status(500).json({ error: 'ใส่ข้อมูลผิดพลาด' }); // Send a generic error message
    }
});

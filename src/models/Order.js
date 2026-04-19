import pool from "../config/db.js";

export const createOrder = async (
  clientId,
  workshopId,
  type,
  description
) => {
  const result = await pool.query(
    `INSERT INTO orders (client_id, workshop_id, type, description)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [clientId, workshopId, type, description]
  );

  return result.rows[0];
};

export const getOrders = async () => {
  const result = await pool.query(
    "SELECT * FROM orders ORDER BY created_at DESC"
  );
  return result.rows;
};

export const updateOrderStatus = async (id, status) => {
  const result = await pool.query(
    "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
};

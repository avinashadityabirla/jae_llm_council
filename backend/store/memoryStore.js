import { pool } from "../db/pool.js";

export const store = {
  async create(jd) {
    const { rows } = await pool.query(
      `INSERT INTO jds (lob, status, wizard_data)

       VALUES ($1, $2, $3::jsonb)

       RETURNING *`,

      [
        jd.wizardData?.basic?.lob || null,

        jd.status || "DRAFT",

        JSON.stringify(jd.wizardData || {}),
      ],
    );

    return rowToJd(rows[0]);
  },

  async findAll() {
    const { rows } = await pool.query(
      "SELECT * FROM jds ORDER BY created_at DESC",
    );

    return rows.map(rowToJd);
  },

  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM jds WHERE id = $1", [id]);

    return rows[0] ? rowToJd(rows[0]) : null;
  },

  async update(id, updates) {
    const existing = await this.findById(id);

    if (!existing) return null;

    const mergedWizardData = {
      ...existing.wizardData,

      ...(updates.wizardData || {}),
    };

    const newStatus = updates.status || existing.status;

    const { rows } = await pool.query(
      `UPDATE jds

       SET wizard_data = $1::jsonb, status = $2, updated_at = NOW()

       WHERE id = $3

       RETURNING *`,

      [JSON.stringify(mergedWizardData), newStatus, id],
    );

    return rows[0] ? rowToJd(rows[0]) : null;
  },

  async setStatus(id, status) {
    const finalizedClause = status === "FINALIZED" ? "NOW()" : "NULL";

    const { rows } = await pool.query(
      `UPDATE jds

       SET status = $1, finalized_at = ${finalizedClause}, updated_at = NOW()

       WHERE id = $2

       RETURNING *`,

      [status, id],
    );

    return rows[0] ? rowToJd(rows[0]) : null;
  },

  async updateGenerated(id, generated) {
    const { rows } = await pool.query(
      `UPDATE jds

       SET generated_jd = $1::jsonb, updated_at = NOW()

       WHERE id = $2

       RETURNING *`,

      [JSON.stringify(generated), id],
    );

    return rows[0] ? rowToJd(rows[0]) : null;
  },

  async delete(id) {
    const { rowCount } = await pool.query("DELETE FROM jds WHERE id = $1", [
      id,
    ]);

    return rowCount > 0;
  },
};

function rowToJd(row) {
  return {
    id: row.id,

    status: row.status,

    lob: row.lob,

    wizardData: row.wizard_data,

    generatedJd: row.generated_jd,

    complianceScore: row.compliance_score,

    createdAt: row.created_at,

    updatedAt: row.updated_at,

    finalizedAt: row.finalized_at,
  };
}

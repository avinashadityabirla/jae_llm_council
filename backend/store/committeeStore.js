// backend/store/committeeStore.js

import { pool } from "../db/pool.js";

export const committeeStore = {
  async create(jdId, nuances, agents) {
    const { rows } = await pool.query(
      `INSERT INTO committees (jd_id, status, nuances, agents)

       VALUES ($1, 'PENDING', $2::jsonb, $3::jsonb)

       RETURNING *`,

      [jdId, JSON.stringify(nuances || {}), JSON.stringify(agents || {})],
    );

    return rowToCommittee(rows[0]);
  },

  async findById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM committees WHERE id = $1",
      [id],
    );

    return rows[0] ? rowToCommittee(rows[0]) : null;
  },

  async findAll() {
    const { rows } = await pool.query(
      `SELECT c.*, j.wizard_data->'basic'->>'designation' AS jd_designation,

              j.wizard_data->'basic'->>'lob' AS jd_lob,

              j.wizard_data->'basic'->>'department' AS jd_department,

              j.wizard_data->'basic'->>'band' AS jd_band

       FROM committees c

       LEFT JOIN jds j ON j.id = c.jd_id

       ORDER BY c.created_at DESC`,
    );

    return rows.map((r) => ({
      ...rowToCommittee(r),

      jdDesignation: r.jd_designation,

      jdLob: r.jd_lob,

      jdDepartment: r.jd_department,

      jdBand: r.jd_band,
    }));
  },

  async updateStatus(id, status) {
    await pool.query(
      `UPDATE committees SET status = $1, updated_at = NOW() WHERE id = $2`,

      [status, id],
    );
  },

  async appendMessage(id, msg) {
    await pool.query(
      `UPDATE committees

       SET transcript = transcript || $1::jsonb,

           updated_at = NOW()

       WHERE id = $2`,

      [JSON.stringify([msg]), id],
    );
  },

  async setVerdict(id, verdict) {
    await pool.query(
      `UPDATE committees

       SET final_verdict = $1::jsonb,

           status = 'COMPLETED',

           completed_at = NOW(),

           updated_at = NOW()

       WHERE id = $2`,

      [JSON.stringify(verdict), id],
    );
  },
};

function rowToCommittee(row) {
  return {
    id: row.id,

    jdId: row.jd_id,

    status: row.status,

    nuances: row.nuances,

    agents: row.agents,

    transcript: row.transcript || [],

    scores: row.scores,

    finalVerdict: row.final_verdict,

    createdAt: row.created_at,

    updatedAt: row.updated_at,

    completedAt: row.completed_at,
  };
}

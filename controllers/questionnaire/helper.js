const validateQuestionnairePayload = (payload) => {
  if (!payload || typeof payload !== "object") return "Invalid payload";
  if (!payload.name || typeof payload.name !== "string")
    return "Field 'name' is required";
  return null;
};

const checkDuplicateName = async (
  name,
  excludeId = null,
  transaction = null
) => {
  const { Op } = require("sequelize");
  const Questionnaire = require("../../models/questionnaire");

  const whereClause = {
    name: name.trim(),
    is_active: true,
  };

  if (excludeId) {
    whereClause.id = { [Op.ne]: excludeId };
  }

  const existing = await Questionnaire.findOne({
    where: whereClause,
    transaction,
  });

  return existing !== null;
};

function generatePGQueries(payload) {
  const queries = [];

  const sanitize = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  payload.sections.forEach((section) => {
    const sectionPrefix = sanitize(section.name); // table prefix

    section.pages.forEach((page) => {
      const pageName = sanitize(page.name);
      const tableName = `${sectionPrefix}_${pageName}`;

      let columns = [`id UUID PRIMARY KEY`];

      page.tools.forEach((tool) => {
        const colName = sanitize(tool.name);

        // default column type
        let colType = "TEXT";

        // mapping tool types to SQL data types
        switch (tool.type) {
          case "email":
          case "shortanswer":
          case "phone":
          case "radio":
          case "checkbox":
          case "fileupload":
            colType = "TEXT";
            break;

          case "groupinput":
            // group-input has child fields
            if (tool.settings?.fields) {
              tool.settings.fields.forEach((fld) => {
                const fldName = sanitize(fld.label);
                columns.push(`${fldName} TEXT`);
              });
            }
            return; // skip parent block column
        }

        columns.push(`${colName} ${colType}`);
      });

      const query = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    ${columns.join(",\n    ")}
);`;

      queries.push(query.trim());
    });
  });

  return queries;
}
// Update existing tables/columns based on payload oldName -> new name mappings
async function updateTablesFromPayload(payload, transaction) {
  const sanitize = (str) =>
    String(str || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  // Helper to run a query safely
  const runSafe = async (sql, opts = {}) => {
    try {
      await sequelize.query(sql, { transaction, ...opts });
    } catch (err) {
      // log and continue
      console.warn("updateTablesFromPayload SQL error:", err.message || err);
    }
  };

  // 1) Rename tables when section/page names changed
  for (const section of payload.sections || []) {
    const oldSectionName = section.oldName || section.name;
    const newSectionName = section.name;
    for (const page of section.pages || []) {
      const oldPageName = page.oldName || page.name;
      const newPageName = page.name;

      const oldTable = `${sanitize(oldSectionName)}_${sanitize(oldPageName)}`;
      const newTable = `${sanitize(newSectionName)}_${sanitize(newPageName)}`;

      if (oldTable && newTable && oldTable !== newTable) {
        // Attempt to rename table if it exists
        const sql = `ALTER TABLE IF EXISTS "${oldTable}" RENAME TO "${newTable}";`;
        await runSafe(sql);
      }
    }
  }

  // 2) For each page/table ensure columns exist and rename columns if tool/field names changed
  for (const section of payload.sections || []) {
    const sectionName = section.name;
    for (const page of section.pages || []) {
      const pageName = page.name;
      const tableName = `${sanitize(sectionName)}_${sanitize(pageName)}`;

      // get existing columns for this table
      let existingCols = [];
      try {
        const [rows] = await sequelize.query(
          `SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND table_schema='public'`,
          { bind: [tableName], transaction }
        );
        existingCols = rows.map((r) => r.column_name.toLowerCase());
      } catch (err) {
        existingCols = [];
      }

      const items = page.tools || page.blocks || [];
      for (const tool of items) {
        if ((tool.type || "") === "groupinput") {
          const fields = tool.settings?.fields || tool.fields || [];
          for (const f of fields) {
            const desired = sanitize(f.label || f.name || f.oldName);
            const old = sanitize(f.oldName || f.label || f.name);
            // if rename needed
            if (
              old &&
              desired &&
              old !== desired &&
              existingCols.includes(old)
            ) {
              await runSafe(
                `ALTER TABLE IF EXISTS "${tableName}" RENAME COLUMN "${old}" TO "${desired}";`
              );
              // update existingCols
              existingCols = existingCols
                .filter((c) => c !== old)
                .concat([desired]);
            }
            // add column if missing
            if (!existingCols.includes(desired)) {
              await runSafe(
                `ALTER TABLE IF EXISTS "${tableName}" ADD COLUMN "${desired}" TEXT;`
              );
              existingCols.push(desired);
            }
          }
        } else {
          const desired = sanitize(tool.name || tool.id);
          const old = sanitize(tool.oldName || tool.name || tool.id);
          if (old && desired && old !== desired && existingCols.includes(old)) {
            await runSafe(
              `ALTER TABLE IF EXISTS "${tableName}" RENAME COLUMN "${old}" TO "${desired}";`
            );
            existingCols = existingCols
              .filter((c) => c !== old)
              .concat([desired]);
          }
          if (!existingCols.includes(desired)) {
            await runSafe(
              `ALTER TABLE IF EXISTS "${tableName}" ADD COLUMN "${desired}" TEXT;`
            );
            existingCols.push(desired);
          }
        }
      }
    }
  }

  // 3) Finally ensure any missing tables are created (for newly added pages)
  const createQueries = generatePGQueries(payload);
  for (const q of createQueries) {
    await runSafe(q);
  }
}

module.exports = {
  validateQuestionnairePayload,
  checkDuplicateName,
  generatePGQueries,
  updateTablesFromPayload,
};

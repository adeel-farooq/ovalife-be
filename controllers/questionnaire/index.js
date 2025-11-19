const Questionnaire = require("../../models/questionnaire");
const Section = require("../../models/section");
const Page = require("../../models/page");
const { validateQuestionnairePayload } = require("./helper");
const { sequelize } = require("../../db");

// Small helper for timestamps
const now = () => new Date();

// Validate basic questionnaire payload

// Create questionnaire with nested sections and pages
const createQuestionnaire = async (req, res) => {
  try {
    // Extract user_id from JWT token (set by auth middleware)
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }
    const payload = req.body;
    const validationError = validateQuestionnairePayload(payload);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const t = await sequelize.transaction();
    try {
      const questionnaireData = {
        name: payload.name,
        is_active: payload.is_active !== undefined ? payload.is_active : true,
        is_publish:
          payload.is_publish !== undefined ? payload.is_publish : false,
        created_by: payload.created_by || null,
        updated_by: payload.updated_by || null,
        created_at: payload.created_at ? new Date(payload.created_at) : now(),
        updated_at: payload.updated_at ? new Date(payload.updated_at) : now(),
      };

      const createdQuestionnaire = await Questionnaire.create(
        questionnaireData,
        { transaction: t }
      );
      if (!createdQuestionnaire?.id) {
        await t.rollback();
        return res
          .status(500)
          .json({ message: "Failed to create questionnaire." });
      }

      // sections -> pages
      if (Array.isArray(payload.sections) && payload.sections.length) {
        for (const sec of payload.sections) {
          const sectionData = {
            questionnaire_id: createdQuestionnaire.id,
            name: sec.name,
            icon: sec.icon || null,
            sort_order: sec.sortorder || sec.sort_order || 0,
            is_active: sec.is_active !== undefined ? sec.is_active : true,
            created_by: sec.created_by || null,
            updated_by: sec.updated_by || null,
            created_at: sec.created_at ? new Date(sec.created_at) : now(),
            updated_at: sec.updated_at ? new Date(sec.updated_at) : now(),
          };

          const createdSection = await Section.create(sectionData, {
            transaction: t,
          });

          if (Array.isArray(sec.pages) && sec.pages.length) {
            for (const pg of sec.pages) {
              const pageData = {
                section_id: createdSection.id,
                name: pg.name,
                tools: pg.tools || null,
                sort_order: pg.sortorder || pg.sort_order || 0,
                is_active: pg.is_active !== undefined ? pg.is_active : true,
                created_by: pg.created_by || null,
                updated_by: pg.updated_by || null,
                created_at: pg.created_at ? new Date(pg.created_at) : now(),
                updated_at: pg.updated_at ? new Date(pg.updated_at) : now(),
              };

              await Page.create(pageData, { transaction: t });
            }
          }
        }
      }

      await t.commit();

      return res.status(201).json({
        message: "Questionnaire created successfully.",
      });
    } catch (err) {
      await t.rollback();
      console.error("createQuestionnaire transaction error:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  } catch (error) {
    console.error("createQuestionnaire error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Internal: fetch questionnaire with sections and pages
const getQuestionnaireByIdInternal = async (obj) => {
  const { is_active, id } = obj;
  if (!id) return null;
  const where = {};
  if (is_active === "true") where.is_active = true;
  if (is_active === "false") where.is_active = false;
  const questionnaire = await Questionnaire.findOne({
    where: { id, ...where },
    raw: true,
  });
  if (!questionnaire) return null;

  const sections = await Section.findAll({
    where: { questionnaire_id: id },
    order: [["sort_order", "ASC"]],
    raw: true,
  });
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const pages = await Page.findAll({
      where: { section_id: sec.id },
      order: [["sort_order", "ASC"]],
      raw: true,
    });
    sections[i].pages = pages.map((p) => ({ ...p }));
  }

  return { ...questionnaire, sections };
};

// Public: get by id
const getQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Parameter 'id' is required." });

    const full = await getQuestionnaireByIdInternal({
      id,
      is_active: req.query.is_active,
    });
    if (!full)
      return res.status(404).json({ message: "Questionnaire not found." });
    return res.status(200).json({
      message: "Questionnaire retrieved successfully.",
      questionnaire: full,
    });
  } catch (error) {
    console.error("getQuestionnaire error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// List all questionnaires
const listQuestionnaires = async (req, res) => {
  try {
    const { include_nested, is_active } = req.query;
    const where = {};
    if (is_active === "true") where.is_active = true;
    if (is_active === "false") where.is_active = false;

    const questionnaires = await Questionnaire.findAll({
      where,
      order: [["created_at", "DESC"]],
      raw: true,
    });

    if (include_nested === "true") {
      const results = [];
      for (const q of questionnaires) {
        const full = await getQuestionnaireByIdInternal({
          id: q.id,
          is_active,
        });
        results.push(full);
      }
      return res.status(200).json({
        message: "Questionnaires retrieved successfully.",
        questionnaires: results,
      });
    }

    return res.status(200).json({
      message: "Questionnaires retrieved successfully.",
      questionnaires,
    });
  } catch (error) {
    console.error("listQuestionnaires error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Update questionnaire (replace nested sections/pages if provided)
const updateQuestionnaire = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const t = await sequelize.transaction();
    try {
      const questionnaire = await Questionnaire.findByPk(id, {
        transaction: t,
      });
      if (!questionnaire) {
        await t.rollback();
        return res.status(404).json({ message: "Questionnaire not found." });
      }

      await questionnaire.update(
        {
          name: payload.name !== undefined ? payload.name : questionnaire.name,
          is_active:
            payload.is_active !== undefined
              ? payload.is_active
              : questionnaire.is_active,
          is_publish:
            payload.is_publish !== undefined
              ? payload.is_publish
              : questionnaire.is_publish,
          updated_by:
            payload.updated_by !== undefined
              ? payload.updated_by
              : questionnaire.updated_by,
          updated_at: payload.updated_at ? new Date(payload.updated_at) : now(),
        },
        { transaction: t }
      );

      if (Array.isArray(payload.sections)) {
        // remove existing nested data
        const existingSections = await Section.findAll({
          where: { questionnaire_id: id },
          transaction: t,
        });
        const sectionIds = existingSections.map((s) => s.id);
        if (sectionIds.length) {
          await Page.destroy({
            where: { section_id: sectionIds },
            transaction: t,
          });
          await Section.destroy({ where: { id: sectionIds }, transaction: t });
        }

        // create provided sections/pages
        for (const sec of payload.sections) {
          const sectionData = {
            questionnaire_id: id,
            name: sec.name,
            icon: sec.icon || null,
            sort_order: sec.sortorder || sec.sort_order || 0,
            is_active: sec.is_active !== undefined ? sec.is_active : true,
            created_by: sec.created_by || null,
            updated_by: sec.updated_by || null,
            created_at: sec.created_at ? new Date(sec.created_at) : now(),
            updated_at: sec.updated_at ? new Date(sec.updated_at) : now(),
          };

          const createdSection = await Section.create(sectionData, {
            transaction: t,
          });
          if (Array.isArray(sec.pages) && sec.pages.length) {
            for (const pg of sec.pages) {
              const pageData = {
                section_id: createdSection.id,
                name: pg.name,
                tools: pg.tools || null,
                sort_order: pg.sortorder || pg.sort_order || 0,
                is_active: pg.is_active !== undefined ? pg.is_active : true,
                created_by: pg.created_by || null,
                updated_by: pg.updated_by || null,
                created_at: pg.created_at ? new Date(pg.created_at) : now(),
                updated_at: pg.updated_at ? new Date(pg.updated_at) : now(),
              };
              await Page.create(pageData, { transaction: t });
            }
          }
        }
      }

      await t.commit();

      return res.status(200).json({
        message: "Questionnaire updated successfully.",
      });
    } catch (err) {
      await t.rollback();
      console.error("updateQuestionnaire transaction error:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  } catch (error) {
    console.error("updateQuestionnaire error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Soft delete questionnaire and nested items
const deleteQuestionnaire = async (req, res) => {
  const { id } = req.params;
  try {
    const t = await sequelize.transaction();
    try {
      const questionnaire = await Questionnaire.findByPk(id, {
        transaction: t,
      });
      if (!questionnaire) {
        await t.rollback();
        return res.status(404).json({ message: "Questionnaire not found." });
      }

      await questionnaire.update(
        { is_active: false, updated_at: now() },
        { transaction: t }
      );

      const sections = await Section.findAll({
        where: { questionnaire_id: id },
        transaction: t,
      });
      const sectionIds = sections.map((s) => s.id);
      if (sectionIds.length) {
        await Page.update(
          { is_active: false, updated_at: now() },
          { where: { section_id: sectionIds }, transaction: t }
        );
        await Section.update(
          { is_active: false, updated_at: now() },
          { where: { id: sectionIds }, transaction: t }
        );
      }

      await t.commit();
      return res
        .status(200)
        .json({ message: "Questionnaire soft-deleted successfully." });
    } catch (err) {
      await t.rollback();
      console.error("deleteQuestionnaire transaction error:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  } catch (error) {
    console.error("deleteQuestionnaire error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createQuestionnaire,
  getQuestionnaire,
  listQuestionnaires,
  updateQuestionnaire,
  deleteQuestionnaire,
};

const prepareWhereClause = (filters) => {
  const where = {};
  const { user_id, clinic_id } = filters;
  if (user_id) {
    where.user_id = user_id;
  }
  if (clinic_id) {
    where.clinic_id = clinic_id;
  }
  return where;
};

module.exports = {
  prepareWhereClause,
};

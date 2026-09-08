// Extrai a lista de UCs do utilizador a partir do perfil ou do token
export function extractUserUcs(userProfileData, jwtTokenPayload) {
  const userCurricularUnits = [];

  // UCs associadas aos cursos
  const coursesList = userProfileData?.courses || jwtTokenPayload?.courses || [];

  for (const courseEntry of coursesList) {
    const courseName = courseEntry?.name || courseEntry?.courseName || 'Engenharia Informática';
    const courseCode = courseEntry?.code || courseEntry?.courseCode || '501';
    const curricularUnits = courseEntry?.ucs || courseEntry?.unidadesCurriculares || [];

    for (const unit of curricularUnits) {
      const isString = typeof unit === 'string';
      const unitName = isString ? unit : (unit?.name || unit?.descricao || 'UC');
      const unitCode = unit?.code || unit?.cdUc || `UC-${userCurricularUnits.length + 1}`;

      userCurricularUnits.push({
        name: unitName,
        code: unitCode,
        ucName: unitName,
        ucCode: unitCode,
        courseName: courseName,
        courseCode: courseCode,
      });
    }
  }

  // UCs diretas no perfil
  const standaloneCurricularUnits = userProfileData?.ucs || userProfileData?.unidadesCurriculares || [];
  for (const unit of standaloneCurricularUnits) {
    const isString = typeof unit === 'string';
    const unitName = isString ? unit : (unit?.name || unit?.descricao || 'UC');
    const unitCode = unit?.code || unit?.cdUc || `UC-${userCurricularUnits.length + 1}`;

    userCurricularUnits.push({
      name: unitName,
      code: unitCode,
      ucName: unitName,
      ucCode: unitCode,
      courseName: 'Engenharia Informática',
      courseCode: '501',
    });
  }

  return userCurricularUnits;
}

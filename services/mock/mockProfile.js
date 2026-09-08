// DEMO_TOKEN só esta aqui para apresentação da universidade
export function getMockProfile(payload = {}) {
  const defaultMockCourses = [
    {
      code: "501",
      name: "Licenciatura em Engenharia Informática",
      academicYears: ["2025/2026"],
      ucs: [
        { code: "501201", name: "Programação Web", semester: "S2" },
        { code: "501305", name: "Bases de Dados", semester: "S2" },
        { code: "501410", name: "Redes de Computadores", semester: "S2" },
        { code: "501501", name: "Engenharia de Software", semester: "S2" }
      ]
    }
  ];

  return {
    name: payload.name || 'Estudante Simulado (EI)',
    email: payload.email || 'estudante.demo@ipportalegre.pt',
    roles: payload.roles || ['estudante', 'alumni', 'admin'],
    nif: payload.nif || '123456789',
    cc: payload.cc || '12345678',
    courses: (payload.courses && Array.isArray(payload.courses) && payload.courses.length > 0)
      ? payload.courses
      : defaultMockCourses
  };
}

export default { getMockProfile };

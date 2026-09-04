import { normalizeStr } from '../../utils/text.js';
import { TIMELINE_START_HOUR, TIMELINE_END_HOUR, OCCUPATION_COURSE_PALETTE } from './roomsConstants.js';

export function timeToMinutes(hour, minute = 0) {
  return Number(hour) * 60 + Number(minute || 0);
}

export function formatTime(hour, minute = 0) {
  return `${String(hour).padStart(2, '0')}:${String(minute || 0).padStart(2, '0')}`;
}

export function convertTimeToTimelinePercentage(hour, minute = 0) {
  const totalMinutes = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60;
  const offsetMinutes = (hour - TIMELINE_START_HOUR) * 60 + (minute || 0);
  return Math.max(0, Math.min(100, (offsetMinutes / totalMinutes) * 100));
}

export function generateCourseColor(courseCode, palette = OCCUPATION_COURSE_PALETTE) {
  const str = String(courseCode || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function getUniqueOccupations(occupations = []) {
  const seen = new Set();
  return (occupations || []).filter((occ) => {
    if (!occ) return false;
    const key = `${occ.startHour}:${occ.startMinute || 0}-${occ.endHour}:${occ.endMinute || 0}-${occ.courseCode || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Cursos padrão caso o perfil do aluno ainda não tenha UCs carregadas
export const DEFAULT_STUDENT_COURSES = [
  {
    code: '501',
    name: 'Licenciatura em Engenharia Informática',
    ucs: [
      { code: '501201', name: 'Programação Web' },
      { code: '501305', name: 'Bases de Dados' },
      { code: '501410', name: 'Redes de Computadores' },
      { code: '501501', name: 'Engenharia de Software' },
    ],
  },
];

// Extrai e normaliza as cadeiras do aluno a partir do perfil
export function extractUserEnrolledUnits(profile) {
  const courses = profile?.courses?.length ? profile.courses : DEFAULT_STUDENT_COURSES;
  const unitCodes = new Set();
  const unitNames = [];

  const pushUnit = (name, code) => {
    if (code) {
      unitCodes.add(String(code).toLowerCase());
    }
    if (name) {
      unitNames.push(normalizeStr(String(name)));
    }
  };

  for (const c of courses) {
    if (!c) continue;
    pushUnit(c.name || c.courseName || c.descricao, c.code || c.courseCode);
    const ucs = c.ucs || c.unidadesCurriculares || c.unidades || [];
    for (const u of ucs) {
      if (!u) continue;
      pushUnit(u.name || u.ucName || u.courseName || u.descricao, u.code || u.ucCode || u.cdUc);
    }
  }

  if (Array.isArray(profile?.ucs)) {
    for (const u of profile.ucs) {
      if (!u) continue;
      pushUnit(u.name || u.ucName || u.descricao, u.code || u.ucCode || u.cdUc);
    }
  }

  return { unitCodes, unitNames };
}

// Verifica se a aula pertence a alguma das disciplinas do aluno
export function isOccupationMatchingUserUnits(occ, enrolledData) {
  if (!occ || !enrolledData) return false;
  const { unitCodes, unitNames } = enrolledData;

  const occCode = String(occ.courseCode || occ.ucCode || occ.code || occ.cdUc || '').toLowerCase();
  if (occCode && unitCodes?.has(occCode)) return true;

  const rawName = occ.courseName || occ.ucName || occ.name || occ.descricao;
  if (!rawName || !unitNames?.length) return false;
  const nameNorm = normalizeStr(rawName);

  return unitNames.some((uName) => nameNorm.includes(uName) || uName.includes(nameNorm));
}

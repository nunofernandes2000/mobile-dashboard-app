// Mapeamento das escolas do IPP com identificador, cores e ícones
export const SCHOOLS = [
  { id: 'ESTG',  name: 'ESTGD / ESTG', fullName: 'Escola Superior de Tecnologia, Gestão e Design',    icon: 'laptop',        color: '#ff9800' },
  { id: 'ESECS', name: 'ESECS',         fullName: 'Escola Superior de Educação e Ciências Sociais',    icon: 'account-group', color: '#673ab7' },
  { id: 'ESS',   name: 'ESS',           fullName: 'Escola Superior de Saúde',                          icon: 'heart-pulse',   color: '#e91e63' },
  { id: 'ESAE',  name: 'ESAE',          fullName: 'Escola Superior Agrária de Elvas',                  icon: 'sprout',        color: '#4caf50' },
];

export const TIMELINE_START_HOUR = 8;
export const TIMELINE_END_HOUR = 22;

export const OCCUPATION_COURSE_PALETTE = [
  '#5C6BC0', '#26A69A', '#EF5350', '#AB47BC', '#42A5F5', '#FFA726', '#66BB6A', '#EC407A', '#78909C',
];

// Associação entre edifícios e respetivas escolas
const SCHOOL_MATCHERS = {
  ESTG: (desc, code) => desc.includes('estg') || desc.includes('engenharia') || desc.includes('tecnologia') || code === 7 || code === 5,
  ESECS: (desc, code) => desc.includes('esecs') || desc.includes('educação') || desc.includes('artes') || code === 2 || code === 3,
  ESS: (desc, code) => desc.includes('ess') || desc.includes('saúde') || desc.includes('enfermagem') || code === 4,
  ESAE: (desc, code) => desc.includes('esae') || desc.includes('agraria') || desc.includes('agrária') || desc.includes('elvas') || code === 6,
};

export const matchesSchool = (roomItem, schoolId) => {
  const matcher = SCHOOL_MATCHERS[schoolId];
  if (!matcher) return false;
  const desc = (roomItem?.descricaoEdificio || '').toLowerCase();
  return matcher(desc, roomItem?.cdEdificio);
};

export const isRoomOcupada = (roomItem) => (roomItem?.todayOccupations || 0) > 0;

// Ícone conforme o tipo de sala
export const getRoomIcon = (roomType) => {
  const type = (roomType || '').toLowerCase();
  if (type.includes('lab') || type.includes('informática') || type.includes('software')) return 'laptop';
  if (type.includes('estudo') || type.includes('biblioteca')) return 'book-open-variant';
  if (type.includes('multimédia') || type.includes('vídeo')) return 'video';
  return 'door';
};

import { getMockProfile } from './mockProfile';
import { generateSimulatedSchedule } from './mockSchedule';
import { generateSimulatedCalendar } from './mockCalendar';
import { generateSimulatedAnnouncements } from './mockAnnouncements';
import { simulatedFileRequests } from './mockFiles';
import {
  simulatedBirthdays,
  simulatedTeachersWithoutUsername,
  simulatedCoursesAwaitingRegistration,
  simulatedFaultyDtpArtifacts,
  simulatedFaultyDtpArtifactsPrevYear,
  simulatedTickets,
  simulatedPedagogicoStudents,
  simulatedPedagogicoGrouping,
  simulatedPedagogicoTimeline,
} from './mockMonitoring';
import { SIMULATED_ROOMS } from './simulatedRooms';
import { extractUserUcs } from './ucsHelper';

export async function handleMockRequest(url, options = {}) {
  // Simulação de latência de rede realista (100ms)
  await new Promise((resolve) => setTimeout(resolve, 100));

  const urlStr = String(url || '');
  const normalizedUrl = urlStr.startsWith('http')
    ? urlStr
    : `http://localhost${urlStr.startsWith('/') ? '' : '/'}${urlStr}`;

  let pathname = '';
  let searchParams = new URLSearchParams();

  try {
    const urlObj = new URL(normalizedUrl);
    pathname = urlObj.pathname.toLowerCase();
    searchParams = urlObj.searchParams;
  } catch (err) {
    const parts = urlStr.split('?');
    pathname = (parts[0] || '').toLowerCase();
    if (parts[1]) {
      searchParams = new URLSearchParams(parts[1]);
    }
  }

  const mockProfile = getMockProfile();
  const userUcs = extractUserUcs(mockProfile);

  let responseData = null;

  if (pathname.endsWith('/profile')) {
    responseData = { success: true, profile: mockProfile, simulated: true };
  } else if (pathname.endsWith('/preferences')) {
    if (options.method === 'PUT') {
      responseData = { success: true, message: 'Preferências guardadas em modo simulado' };
    } else {
      responseData = {
        success: true,
        preferences: {
          darkMode: false,
          pinnedServices: ['calendar', 'announcements', 'salas', 'upload', 'dashboard'],
          activeNavTabs: ['home', 'rooms', 'profile'],
        },
      };
    }
  } else if (pathname.endsWith('/admin/access')) {
    responseData = {
      success: true,
      access: [
        { moduleKey: 'calendar', allowedRoles: ['estudante', 'docente', 'admin'] },
        { moduleKey: 'announcements', allowedRoles: ['estudante', 'docente', 'admin'] },
        { moduleKey: 'salas', allowedRoles: ['estudante', 'docente', 'admin'] },
        { moduleKey: 'upload', allowedRoles: ['estudante', 'docente', 'admin'] },
        { moduleKey: 'dashboard', allowedRoles: ['estudante', 'docente', 'admin'] },
        { moduleKey: 'admin', allowedRoles: ['admin', 'test.monitor.apis'] },
      ],
      modules: ['calendar', 'announcements', 'salas', 'upload', 'dashboard', 'admin'],
    };
  } else if (pathname.endsWith('/admin/roles')) {
    responseData = {
      success: true,
      roles: [
        { id: 'admin', name: 'Administrador' },
        { id: 'estudante', name: 'Estudante' },
        { id: 'docente', name: 'Docente' },
        { id: 'alumni', name: 'Alumni' },
      ],
    };
  } else if (pathname.endsWith('/rooms')) {
    responseData = { success: true, rooms: SIMULATED_ROOMS, simulated: true };
  } else if (pathname.endsWith('/schedule')) {
    responseData = {
      success: true,
      schedule: generateSimulatedSchedule(userUcs),
      simulated: true,
    };
  } else if (pathname.endsWith('/favorites/rooms')) {
    responseData = { success: true, favorites: [4001, 4002] };
  } else if (pathname.endsWith('/announcements')) {
    responseData = {
      success: true,
      announcements: generateSimulatedAnnouncements(userUcs),
      isMock: true,
    };
  } else if (pathname.endsWith('/calendar')) {
    responseData = {
      success: true,
      events: generateSimulatedCalendar(userUcs),
      isMock: true,
    };
  } else if (pathname.endsWith('/filerequests')) {
    responseData = {
      success: true,
      fileRequests: simulatedFileRequests,
      simulated: true,
    };
  } else if (pathname.endsWith('/files/upload')) {
    responseData = {
      success: true,
      message: 'Ficheiro simulado enviado com sucesso.',
    };
  } else if (pathname.endsWith('/filerequests/fulfill')) {
    responseData = {
      success: true,
      message: 'Pedido de ficheiro cumprido com sucesso.',
    };
  } else if (pathname.endsWith('/tickets')) {
    responseData = { success: true, result: simulatedTickets, simulated: true };
  } else if (pathname.endsWith('/birthdays')) {
    responseData = { success: true, result: simulatedBirthdays, simulated: true };
  } else if (pathname.endsWith('/teachers/without-username')) {
    responseData = { success: true, result: simulatedTeachersWithoutUsername, simulated: true };
  } else if (pathname.endsWith('/courses/awaiting-registration')) {
    responseData = { success: true, result: simulatedCoursesAwaitingRegistration, simulated: true };
  } else if (
    pathname.includes('/dtp/faulty-artifacts-prev-year') ||
    pathname.includes('/dtp/faulty-artifacts/prev-year')
  ) {
    responseData = { success: true, result: simulatedFaultyDtpArtifactsPrevYear, simulated: true };
  } else if (pathname.includes('/dtp/faulty-artifacts')) {
    responseData = { success: true, result: simulatedFaultyDtpArtifacts, simulated: true };
  } else if (pathname.includes('/kpis/pedagogico/students/grouping')) {
    responseData = { success: true, result: simulatedPedagogicoGrouping, simulated: true };
  } else if (pathname.includes('/kpis/pedagogico/students/timeline')) {
    const targetSchool = searchParams.get('school') || 'IPP';
    const timelineList = (simulatedPedagogicoTimeline.timeline || []).map((entry) => ({
      observationDate: entry.period,
      alertValueFloat: entry[targetSchool] || entry.IPP || 4.40,
      metricMetadata: { institutionCode: targetSchool },
    }));
    responseData = {
      success: true,
      result: {
        entity: { name: `Evolução Histórica (${targetSchool})`, timestamp: Date.now() },
        alerts: timelineList,
      },
      simulated: true,
    };
  } else if (pathname.includes('/kpis/pedagogico/students')) {
    const targetSchool = searchParams.get('school') || 'IPP';
    const targetSemester = searchParams.get('semester');
    const schoolMock = (simulatedPedagogicoStudents.schools || []).find((s) => s.code === targetSchool) || {
      mediaAnual: 4.5,
      mediaS1: 4.5,
      mediaS2: 4.4,
    };
    let val = schoolMock.mediaAnual;
    if (targetSemester === 'S1') val = schoolMock.mediaS1 ?? schoolMock.mediaAnual;
    if (targetSemester === 'S2A' || targetSemester === 'S2') {
      val = schoolMock.mediaS2 ?? (schoolMock.mediaAnual ? schoolMock.mediaAnual - 0.05 : null);
    }
    responseData = {
      success: true,
      result: {
        alertValueFloat: val,
        alertValueStr: val != null ? String(val) : null,
        description: schoolMock.name || targetSchool,
        updateDate: new Date().toISOString(),
      },
      simulated: true,
    };
  } else {
    responseData = { success: true, simulated: true };
  }

  const jsonString = JSON.stringify(responseData);
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => responseData,
    text: async () => jsonString,
    headers: {
      get: (h) => (String(h).toLowerCase() === 'content-type' ? 'application/json' : null),
    },
  };
}

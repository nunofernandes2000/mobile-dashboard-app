// DEMO_TOKEN só esta aqui para apresentação da universidade
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

// Registo em memória de pedidos cumpridos durante a sessão de teste
const demoFulfilledUuids = new Set();

export function resetDemoFulfilledRequests() {
  demoFulfilledUuids.clear();
}

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
    const activeRequests = simulatedFileRequests.filter(
      (item) => !demoFulfilledUuids.has(item.uuid)
    );
    responseData = {
      success: true,
      result: activeRequests,
      fileRequests: activeRequests,
      simulated: true,
      count: activeRequests.length,
    };
  } else if (pathname.endsWith('/files/upload') || pathname.endsWith('/upload')) {
    const mockUploadedFile = {
      contentType: 'image/jpeg',
      extension: 'jpg',
      fileName: 'documento_submetido.jpg',
      fileSize: 145230,
      md5: 'd41d8cd98f00b204e9800998ecf8427e',
      tmpName: `simulated_tmp_${Date.now()}`,
    };
    responseData = {
      success: true,
      service: 'ok',
      uploadedFiles: [mockUploadedFile],
      fileUploaded: mockUploadedFile,
      simulated: true,
    };
  } else if (pathname.endsWith('/filerequests/fulfill')) {
    try {
      if (options.body) {
        const bodyObj = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        if (bodyObj?.uuid) {
          demoFulfilledUuids.add(bodyObj.uuid);
        }
      }
    } catch (e) {
      // Ignora erro de parsing no mock
    }

    responseData = {
      success: true,
      service: 'ok',
      message: 'Pedido de ficheiro cumprido com sucesso.',
      simulated: true,
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

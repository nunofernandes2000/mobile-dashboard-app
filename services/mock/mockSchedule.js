// DEMO_TOKEN só esta aqui para apresentação da universidade
function getCourseDetail(course, index) {
    if (!course) return null;
    if (typeof course === 'string') {
        return { name: course, code: `MOCK-${index}` };
    }
    return {
        name: course.name || course.courseName || course.descricao || JSON.stringify(course),
        code: course.code || course.courseCode || course.cdUc || `MOCK-${index}`
    };
}

function generateSimulatedSchedule(userCourses = []) {
    const today = new Date().toISOString().split('T')[0] + ' 00:00:00.0';

    const uc0 = getCourseDetail(userCourses[0], 0);
    const uc1 = getCourseDetail(userCourses[1], 1);
    const uc2 = getCourseDetail(userCourses[2], 2);

    return {
        rooms: [
            {
                cdEdificio: 7, roomCode: 4001, roomName: 'Lab. Informática 1',
                occupations: [
                    { startHour: 9, startMinute: 0, endHour: 11, endMinute: 0, durationMinutes: 120, courseName: uc0?.name || 'Programação Web', courseCode: uc0?.code || '501201', teacherCode: '70123', occupationDate: today, startMillis: 32400000, endMillis: 39600000 },
                    { startHour: 14, startMinute: 0, endHour: 16, endMinute: 30, durationMinutes: 150, courseName: uc1?.name || 'Bases de Dados', courseCode: uc1?.code || '501305', teacherCode: '70456', occupationDate: today, startMillis: 50400000, endMillis: 59400000 },
                ]
            },
            {
                cdEdificio: 7, roomCode: 4002, roomName: 'Lab. Informática 2',
                occupations: [
                    { startHour: 10, startMinute: 0, endHour: 12, endMinute: 0, durationMinutes: 120, courseName: uc2?.name || 'Redes de Computadores', courseCode: uc2?.code || '501410', teacherCode: '70789', occupationDate: today, startMillis: 36000000, endMillis: 43200000 },
                ]
            },
            {
                cdEdificio: 7, roomCode: 4003, roomName: 'Sala de Aulas 101',
                occupations: [
                    { startHour: 8, startMinute: 30, endHour: 10, endMinute: 30, durationMinutes: 120, courseName: 'Matemática Discreta', courseCode: '501102', teacherCode: '70234', occupationDate: today, startMillis: 30600000, endMillis: 37800000 },
                    { startHour: 11, startMinute: 0, endHour: 13, endMinute: 0, durationMinutes: 120, courseName: 'Engenharia de Software', courseCode: '501501', teacherCode: '70567', occupationDate: today, startMillis: 39600000, endMillis: 46800000 },
                    { startHour: 14, startMinute: 30, endHour: 16, endMinute: 0, durationMinutes: 90, courseName: 'Sistemas Operativos', courseCode: '501303', teacherCode: '70890', occupationDate: today, startMillis: 52200000, endMillis: 57600000 },
                ]
            },
            {
                cdEdificio: 5, roomCode: 4010, roomName: 'Sala de Aulas 201',
                occupations: [
                    { startHour: 9, startMinute: 0, endHour: 11, endMinute: 0, durationMinutes: 120, courseName: 'Design de Interfaces', courseCode: '502101', teacherCode: '71123', occupationDate: today, startMillis: 32400000, endMillis: 39600000 },
                    { startHour: 15, startMinute: 0, endHour: 17, endMinute: 0, durationMinutes: 120, courseName: 'Computação Gráfica', courseCode: '502201', teacherCode: '71456', occupationDate: today, startMillis: 54000000, endMillis: 61200000 },
                ]
            },
            {
                cdEdificio: 5, roomCode: 4011, roomName: 'Auditório A',
                occupations: []
            },
            {
                cdEdificio: 2, roomCode: 3001, roomName: 'Sala B1',
                occupations: [
                    { startHour: 10, startMinute: 0, endHour: 12, endMinute: 30, durationMinutes: 150, courseName: 'Psicologia da Educação', courseCode: '301101', teacherCode: '60123', occupationDate: today, startMillis: 36000000, endMillis: 45000000 },
                    { startHour: 14, startMinute: 0, endHour: 16, endMinute: 0, durationMinutes: 120, courseName: 'Didática Geral', courseCode: '301202', teacherCode: '60456', occupationDate: today, startMillis: 50400000, endMillis: 57600000 },
                ]
            },
            {
                cdEdificio: 3, roomCode: 3010, roomName: 'Sala de Artes',
                occupations: [
                    { startHour: 9, startMinute: 30, endHour: 12, endMinute: 30, durationMinutes: 180, courseName: 'Educação Visual e Plástica', courseCode: '301301', teacherCode: '60789', occupationDate: today, startMillis: 34200000, endMillis: 45000000 },
                ]
            },
            {
                cdEdificio: 4, roomCode: 5001, roomName: 'Lab. Enfermagem 1',
                occupations: [
                    { startHour: 8, startMinute: 0, endHour: 13, endMinute: 0, durationMinutes: 300, courseName: 'Ensino Clínico de Enfermagem de SMO, SIP e SMP', courseCode: '704344', teacherCode: '66597', occupationDate: today, startMillis: 28800000, endMillis: 46800000 },
                    { startHour: 14, startMinute: 0, endHour: 20, endMinute: 0, durationMinutes: 360, courseName: 'Ensino Clínico de Enfermagem de SMO, SIP e SMP', courseCode: '704344', teacherCode: '66837', occupationDate: today, startMillis: 50400000, endMillis: 72000000 },
                ]
            },
            {
                cdEdificio: 4, roomCode: 5002, roomName: 'Sala Anatomia',
                occupations: [
                    { startHour: 10, startMinute: 0, endHour: 12, endMinute: 0, durationMinutes: 120, courseName: 'Anatomia e Fisiologia I', courseCode: '704101', teacherCode: '66100', occupationDate: today, startMillis: 36000000, endMillis: 43200000 },
                ]
            },
            {
                cdEdificio: 6, roomCode: 6001, roomName: 'Lab. Ciências Agrárias',
                occupations: [
                    { startHour: 9, startMinute: 0, endHour: 12, endMinute: 0, durationMinutes: 180, courseName: 'Produção Animal', courseCode: '601101', teacherCode: '80123', occupationDate: today, startMillis: 32400000, endMillis: 43200000 },
                    { startHour: 14, startMinute: 0, endHour: 17, endMinute: 0, durationMinutes: 180, courseName: 'Tecnologia Alimentar', courseCode: '601201', teacherCode: '80456', occupationDate: today, startMillis: 50400000, endMillis: 61200000 },
                ]
            },
        ]
    };
}

export { generateSimulatedSchedule };
export default { generateSimulatedSchedule };

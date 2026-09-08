// DEMO_TOKEN só esta aqui para apresentação da universidade
const simulatedAnnouncements = [
    {
        timestamp: 1784397170000,
        code: "50198",
        name: "Avaliação",
        email: "scorreia@ipportalegre.pt",
        url: "https://pae.ipportalegre.pt/user/startLoadAnnouncementFromCourseUnit.do?id=50198",
        metadata: {
            announcementId: 50198,
            announcementTitle: "Avaliação",
            announcementText: "<p>Caros Estudantes,</p><p><br/></p><p>foram publicadas as notas finais da época de recurso.</p><p><br/></p><p>Cumprimentos,</p><p>SCorreia</p>",
            announcementTextHtml: true,
            announcementDate: "2026/07/18",
            courseCode: "9119",
            courseName: "Engenharia Informática",
            personEmail: "scorreia@ipportalegre.pt",
            personName: "Sérgio Duarte Correia",
            personId: 80,
            ucId: 12634,
            ucCode: "209528",
            ucName: "Informática Industrial ",
            semester: "S2",
            courseId: 10
        }
    },
    {
        timestamp: 1784151702000,
        code: "50184",
        name: "Avaliação - Discussão dos Projetos",
        email: "scorreia@ipportalegre.pt",
        url: "https://pae.ipportalegre.pt/user/startLoadAnnouncementFromCourseUnit.do?id=50184",
        metadata: {
            announcementId: 50184,
            announcementTitle: "Avaliação - Discussão dos Projetos",
            announcementText: "<p>Caros Estudantes,</p><p><br/></p><p>amanhã iniciamos a discussão dos projetos às 9h30.</p><p><br/></p><p> 9h30 - Turma 2, Grupo 3</p><p>10h00 - Turma 2, Grupo 7</p><p><br/></p><p>Cumprimentos,</p><p>SCorreia</p>",
            announcementTextHtml: true,
            announcementDate: "2026/07/15",
            courseCode: "9119",
            courseName: "Engenharia Informática",
            personEmail: "scorreia@ipportalegre.pt",
            personName: "Sérgio Duarte Correia",
            personId: 80,
            ucId: 12634,
            ucCode: "209528",
            ucName: "Informática Industrial ",
            semester: "S2",
            courseId: 10
        }
    }
];

function generateSimulatedAnnouncements(userUcs = []) {
    // using simulatedAnnouncements from above
    if (!userUcs || !Array.isArray(userUcs) || userUcs.length === 0) {
        return simulatedAnnouncements;
    }

    const generatedAnnouncements = [];
    let idCounter = 50200;

    userUcs.forEach((uc, index) => {
        const ucName = typeof uc === 'string' ? uc : (uc.ucName || uc.name || uc.descricao || `UC ${index + 1}`);
        const ucCode = typeof uc === 'string' ? `UC-${209500 + index}` : (uc.ucCode || uc.code || uc.cdUc || `20950${index}`);
        const courseName = uc.courseName || uc.curso || 'Engenharia Informática';
        const courseCode = uc.courseCode || '9119';

        idCounter++;
        const dateStr = new Date(Date.now() - 86400000 * (index + 1)).toISOString().split('T')[0].replace(/-/g, '/');

        generatedAnnouncements.push({
            timestamp: Date.now() - 86400000 * (index + 1),
            code: String(idCounter),
            name: `Aviso Importante - ${ucName}`,
            email: "docente@ipportalegre.pt",
            url: `https://pae.ipportalegre.pt/user/startLoadAnnouncementFromCourseUnit.do?id=${idCounter}`,
            metadata: {
                announcementId: idCounter,
                announcementTitle: `Aviso - ${ucName}`,
                announcementText: `<p>Caros Estudantes de <strong>${ucName}</strong>,</p><p>Foram disponibilizados novos materiais e informações relativas às avaliações da disciplina no Moodle.</p><p>Votantes cumprimentos,</p><p>Docente Responsável</p>`,
                announcementTextHtml: true,
                announcementDate: dateStr,
                courseCode: String(courseCode),
                courseName: String(courseName),
                personEmail: "docente@ipportalegre.pt",
                personName: "Docente da UC",
                personId: 80 + index,
                ucId: 12630 + index,
                ucCode: String(ucCode),
                ucName: String(ucName),
                semester: "S2",
                courseId: 10
            }
        });
    });

    return [...generatedAnnouncements, ...simulatedAnnouncements];
}

export { simulatedAnnouncements, generateSimulatedAnnouncements };
export default { simulatedAnnouncements, generateSimulatedAnnouncements };

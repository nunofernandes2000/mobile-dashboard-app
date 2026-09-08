const simulatedCalendarEvents = [
    {
        timestamp: Date.now() + 86400000 * 5,
        name: "Entrega do Trabalho Prático 1",
        code: "EVT-501201-1",
        email: "hugo.farinha@ipportalegre.pt",
        obs: "Submissão do relatório e código fonte no Moodle",
        url: "https://moodle.ipportalegre.pt/mod/assign/view.php?id=8921",
        metadata: {
            assignementId: 501,
            assignementTitle: "Trabalho Prático 1 - Aplicação Full Stack API & Mobile",
            lateDelivers: true,
            eventType: "DELIVERY",
            assignementDescription: "Desenvolvimento de uma API REST em Node.js/Express integrada com React Native.",
            assignementDeliveryDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0] + " 23:59:00",
            assignementSaveDate: "2026-07-20 10:00:00",
            courseCode: "501",
            courseName: "Engenharia Informática",
            personEmail: "hugo.farinha@ipportalegre.pt",
            ucId: 1001,
            semester: "S2",
            courseId: 501,
            personName: "Prof. Hugo Farinha",
            ucCode: "501201",
            personId: 70123,
            ucName: "Programação Web"
        }
    },
    {
        timestamp: Date.now() + 86400000 * 8,
        name: "Frequência Teórico-Prática de BD",
        code: "EVT-501305-2",
        email: "jose.valhondo@ipportalegre.pt",
        obs: "Sala 4001 - Requer comparência 15 minutos antes",
        url: "https://pae.ipportalegre.pt/evaluations/exam.do?id=4302",
        metadata: {
            assignementId: 502,
            assignementTitle: "Frequência Intermédia de Bases de Dados II",
            lateDelivers: false,
            eventType: "TEST",
            assignementDescription: "Avaliação presencial de SQL avançado, transações, indexação e concorrência.",
            assignementDeliveryDate: new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0] + " 10:00:00",
            assignementSaveDate: "2026-07-15 09:00:00",
            courseCode: "501",
            courseName: "Engenharia Informática",
            personEmail: "jose.valhondo@ipportalegre.pt",
            ucId: 1002,
            semester: "S2",
            courseId: 501,
            personName: "Prof. José Valhondo",
            ucCode: "501305",
            personId: 70456,
            ucName: "Bases de Dados"
        }
    },
    {
        timestamp: Date.now() + 86400000 * 12,
        name: "Apresentação Oral de Projeto de Redes",
        code: "EVT-501410-3",
        email: "jpires@ipportalegre.pt",
        obs: "Auditório A - Defesa em grupos de 3 alunos",
        url: "https://pae.ipportalegre.pt/evaluations/presentation.do?id=4305",
        metadata: {
            assignementId: 503,
            assignementTitle: "Defesa do Projeto de Infraestrutura de Redes IP",
            lateDelivers: false,
            eventType: "PRESENTATION",
            assignementDescription: "Apresentação oral com demonstração de topologia de rede simulada no Cisco Packet Tracer.",
            assignementDeliveryDate: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0] + " 14:30:00",
            assignementSaveDate: "2026-07-18 11:30:00",
            courseCode: "501",
            courseName: "Engenharia Informática",
            personEmail: "jpires@ipportalegre.pt",
            ucId: 1003,
            semester: "S2",
            courseId: 501,
            personName: "Prof. José Pires",
            ucCode: "501410",
            personId: 70789,
            ucName: "Redes de Computadores"
        }
    },
    {
        timestamp: Date.now() + 86400000 * 18,
        name: "Exame de Época Normal",
        code: "EVT-501501-4",
        email: "anaremigio@ipportalegre.pt",
        obs: "Exame final escrito - Toda a matéria do 2º Semestre",
        url: "https://pae.ipportalegre.pt/evaluations/exam.do?id=4510",
        metadata: {
            assignementId: 504,
            assignementTitle: "Exame Final de Engenharia de Software",
            lateDelivers: false,
            eventType: "EXAM",
            assignementDescription: "Exame presencial no Auditório 1 cobrindo Arquitetura de Software, Design Patterns e Metodologias Ágeis.",
            assignementDeliveryDate: new Date(Date.now() + 86400000 * 18).toISOString().split('T')[0] + " 09:30:00",
            assignementSaveDate: "2026-07-10 16:00:00",
            courseCode: "501",
            courseName: "Engenharia Informática",
            personEmail: "anaremigio@ipportalegre.pt",
            ucId: 1004,
            semester: "S2",
            courseId: 501,
            personName: "Prof. Ana Remígio",
            ucCode: "501501",
            personId: 70567,
            ucName: "Engenharia de Software"
        }
    },
    {
        timestamp: Date.now() + 86400000 * 22,
        name: "Submissão de Relatório Clínico",
        code: "EVT-704344-5",
        email: "maria.godinho@ipportalegre.pt",
        obs: "Portal DTP - Anexo de Ficha de Avaliação de Estágio",
        url: "https://pae.ipportalegre.pt/dtp/reports.do?id=9102",
        metadata: {
            assignementId: 505,
            assignementTitle: "Relatório de Fim de Estágio Clínico de Enfermagem",
            lateDelivers: true,
            eventType: "DELIVERY",
            assignementDescription: "Submissão do portfólio clínico e validação do orientador de estágio.",
            assignementDeliveryDate: new Date(Date.now() + 86400000 * 22).toISOString().split('T')[0] + " 23:59:00",
            assignementSaveDate: "2026-07-21 15:00:00",
            courseCode: "704",
            courseName: "Licenciatura em Enfermagem",
            personEmail: "maria.godinho@ipportalegre.pt",
            ucId: 2001,
            semester: "S2",
            courseId: 704,
            personName: "Prof. Maria Godinho",
            ucCode: "704344",
            personId: 66597,
            ucName: "Ensino Clínico de Enfermagem"
        }
    }
];

function generateSimulatedCalendar(userUcs = []) {
    // using simulatedCalendarEvents from above

    const sampleTeachers = [
        { name: "Prof. Doutor Hugo Farinha", email: "hugo.farinha@ipportalegre.pt", id: 70123 },
        { name: "Prof. Doutor José Valhondo", email: "jose.valhondo@ipportalegre.pt", id: 70456 },
        { name: "Prof. Doutor José Pires", email: "jpires@ipportalegre.pt", id: 70789 },
        { name: "Prof. Doutora Ana Remígio", email: "anaremigio@ipportalegre.pt", id: 70567 },
        { name: "Prof. Doutora Maria Godinho", email: "maria.godinho@ipportalegre.pt", id: 66597 },
        { name: "Prof. Doutora Sónia Monteiro", email: "sonia.monteiro@ipportalegre.pt", id: 26489 },
        { name: "Prof. Paula Reis", email: "paula.reis@ipportalegre.pt", id: 26921 }
    ];

    const eventTemplates = [
        {
            type: "DELIVERY",
            titlePrefix: "Entrega do Trabalho Prático",
            desc: "Submissão do relatório e código fonte do projeto no Moodle.",
            lateDelivers: true,
            daysAhead: 5,
            time: "23:59:00"
        },
        {
            type: "TEST",
            titlePrefix: "Frequência Intermédia / Avaliação Teórica",
            desc: "Avaliação presencial teórico-prática na sala de aulas.",
            lateDelivers: false,
            daysAhead: 10,
            time: "10:00:00"
        },
        {
            type: "PRESENTATION",
            titlePrefix: "Apresentação & Defesa de Projeto",
            desc: "Defesa oral do projeto prático em grupo perante o corpo docente.",
            lateDelivers: false,
            daysAhead: 16,
            time: "14:30:00"
        },
        {
            type: "EXAM",
            titlePrefix: "Exame de Época Normal",
            desc: "Exame escrito abrangendo toda a matéria lecionada no semestre.",
            lateDelivers: false,
            daysAhead: 24,
            time: "09:30:00"
        }
    ];

    if (!userUcs || !Array.isArray(userUcs) || userUcs.length === 0) {
        return simulatedCalendarEvents;
    }

    const generatedEvents = [];
    let eventIdCounter = 1000;

    userUcs.forEach((uc, index) => {
        const ucName = typeof uc === 'string' ? uc : (uc.ucName || uc.name || uc.descricao || `Unidade Curricular ${index + 1}`);
        const ucCode = typeof uc === 'string' ? `UC-${50100 + index}` : (uc.ucCode || uc.code || uc.cdUc || `50100${index + 1}`);
        const courseName = uc.courseName || uc.curso || 'Engenharia Informática';
        const courseCode = uc.courseCode || '501';

        const teacher = sampleTeachers[index % sampleTeachers.length];

        const template1 = eventTemplates[index % eventTemplates.length];
        const template2 = eventTemplates[(index + 2) % eventTemplates.length];

        [template1, template2].forEach((tmpl, tIndex) => {
            eventIdCounter++;
            const daysOffset = tmpl.daysAhead + (index * 2) + (tIndex * 5);
            const deliveryDate = new Date(Date.now() + 86400000 * daysOffset);
            const deliveryDateStr = deliveryDate.toISOString().split('T')[0] + " " + tmpl.time;

            generatedEvents.push({
                timestamp: deliveryDate.getTime(),
                name: `${tmpl.titlePrefix} - ${ucName}`,
                code: `EVT-${ucCode}-${tIndex + 1}`,
                email: teacher.email,
                obs: `${tmpl.desc} (${ucName})`,
                url: `https://moodle.ipportalegre.pt/mod/assign/view.php?id=${eventIdCounter}`,
                metadata: {
                    assignementId: eventIdCounter,
                    assignementTitle: `${tmpl.titlePrefix} (${ucName})`,
                    lateDelivers: tmpl.lateDelivers,
                    eventType: tmpl.type,
                    assignementDescription: `${tmpl.desc} Para a UC ${ucName}.`,
                    assignementDeliveryDate: deliveryDateStr,
                    assignementSaveDate: "2026-07-20 10:00:00",
                    courseCode: String(courseCode),
                    courseName: String(courseName),
                    personEmail: teacher.email,
                    ucId: 1000 + index,
                    semester: "S2",
                    courseId: 501,
                    personName: teacher.name,
                    ucCode: String(ucCode),
                    personId: teacher.id,
                    ucName: String(ucName)
                }
            });
        });
    });

    return generatedEvents;
}

export { simulatedCalendarEvents, generateSimulatedCalendar };
export default { simulatedCalendarEvents, generateSimulatedCalendar };

// DEMO_TOKEN só esta aqui para apresentação da universidade
const simulatedBirthdays = {
    updateDate: "2026-07-22 11:11:00.0",
    saveDate: "2026-07-01 00:01:01.0",
    entities: [
        {
            obs: "23 de Julho",
            metadata: { birthDate: "1990-07-23", age: 36, birthdayDateCurrentYear: "2026-07-23" },
            code: "anaremigio",
            name: "Ana Maria Duarte Remígio",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=2790",
            timestamp: 1784671808832
        },
        {
            obs: "20 de Julho",
            metadata: { birthDate: "1970-07-20", age: 56, birthdayDateCurrentYear: "2026-07-20" },
            code: "jpires",
            name: "José Manuel Ramilo Pires",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=3465",
            timestamp: 1784671808832
        },
        {
            obs: "20 de Julho",
            metadata: { birthDate: "1985-07-20", age: 41, birthdayDateCurrentYear: "2026-07-20" },
            code: "hugo.farinha",
            name: "Hugo Miguel dos Santos Farinha",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=3862",
            timestamp: 1784671808832
        },
        {
            obs: "19 de Julho",
            metadata: { birthDate: "1977-07-19", age: 49, birthdayDateCurrentYear: "2026-07-19" },
            code: "maria.godinho",
            name: "Maria do Amparo Marques Godinho",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4538",
            timestamp: 1784671808832
        },
        {
            obs: "23 de Julho",
            metadata: { birthDate: "1971-07-23", age: 55, birthdayDateCurrentYear: "2026-07-23" },
            code: "jose.valhondo",
            name: "José Luís Valhondo Crego",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4680",
            timestamp: 1784671808832
        },
        {
            obs: "23 de Julho",
            metadata: { birthDate: "1950-07-23", age: 76, birthdayDateCurrentYear: "2026-07-23" },
            code: "cristina.morais",
            name: "Maria Cristina Reis de Miranda e Morais",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4773",
            timestamp: 1784671808832
        },
        {
            obs: "19 de Julho",
            metadata: { birthDate: "1975-07-19", age: 51, birthdayDateCurrentYear: "2026-07-19" },
            code: "sonia.monteiro",
            name: "Sónia Isabel C. Monteiro",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=26489",
            timestamp: 1784671808832
        },
        {
            obs: "19 de Julho",
            metadata: { birthDate: "1984-07-19", age: 42, birthdayDateCurrentYear: "2026-07-19" },
            code: "paula.reis",
            name: "Paula Sofia dos Reis Amaral",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=26921",
            timestamp: 1784671808832
        },
        {
            obs: "20 de Julho",
            metadata: { birthDate: "1978-07-20", age: 48, birthdayDateCurrentYear: "2026-07-20" },
            code: "joao.bagina",
            name: "João Pedro Polido Bagina",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=31471",
            timestamp: 1784671808832
        },
        {
            obs: "19 de Julho",
            metadata: { birthDate: "1967-07-19", age: 59, birthdayDateCurrentYear: "2026-07-19" },
            code: "isabelbico",
            name: "Isabel Maria Tarico Bico",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=31563",
            timestamp: 1784671808832
        },
        {
            obs: "19 de Julho",
            metadata: { birthDate: "1966-07-19", age: 60, birthdayDateCurrentYear: "2026-07-19" },
            code: "maria.jose.nogueira",
            name: "Maria José Carvalho Nogueira",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=31566",
            timestamp: 1784671808832
        },
        {
            obs: "22 de Julho",
            metadata: { birthDate: "1971-07-22", age: 55, birthdayDateCurrentYear: "2026-07-22" },
            code: "isabel.raminhas",
            name: "Isabel Maria Ramos Raminhas",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=32624",
            timestamp: 1784671808832
        },
        {
            obs: "19 de Julho",
            metadata: { birthDate: "1987-07-19", age: 39, birthdayDateCurrentYear: "2026-07-19" },
            code: "tiagovenancio",
            name: "Tiago André Ferrão Venâncio",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=34997",
            timestamp: 1784671808832
        },
        {
            obs: "22 de Julho",
            metadata: { birthDate: "1999-07-22", age: 27, birthdayDateCurrentYear: "2026-07-22" },
            code: "andreantao",
            name: "André Filipe Barroqueiro Antão",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=35780",
            timestamp: 1784671808832
        },
        {
            obs: "20 de Julho",
            metadata: { birthDate: "1980-07-20", age: 46, birthdayDateCurrentYear: "2026-07-20" },
            code: "rui.monteiro",
            name: "Rui de Oliveira Pires Monteiro",
            url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=36679",
            timestamp: 1784671808832
        }
    ],
    alertValueStr: "15",
    description: "funcionarios a celebrar o aniversário",
    id: 1,
    alertValueInt: 15
};

const simulatedTeachersWithoutUsername = {
    updateDate: "2026-07-22 17:42:36.0",
    entities: [
        { obs: "", code: "66708", name: "Ricardo Filipe Silva de Oliveira", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=2076", timestamp: 1784738299074 },
        { obs: "", code: "20257", name: "António Mário Alves Costeira", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=3458", timestamp: 1784738299074 },
        { obs: "", code: "22349", name: "Joana Francisca Roque Morais", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=3514", timestamp: 1784738299074 },
        { obs: "", code: "66727", name: "Fernando José Freixo Micaelo", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=3849", timestamp: 1784738299074 },
        { obs: "", code: "66722", name: "Ana Cristina Ribeiro da Silva Romão Afonso Martins", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=3851", timestamp: 1784738299074 },
        { obs: "", code: "66754", name: "Ana Rita Pinheiro de Sousa FIgueira", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=3853", timestamp: 1784738299074 },
        { obs: "", code: "66755", name: "Susana Maria Sardinha Vieira Ramos", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=3879", timestamp: 1784738299074 },
        { obs: "", code: "66728", name: "João Pedro Oliveira Valente", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=3883", timestamp: 1784738299074 },
        { obs: "", code: "2000075", name: "Emma Margaret Bray", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4461", timestamp: 1784738299074 },
        { obs: "", code: "22330", name: "Carla Paula Maciel de Carvalho Rocha", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4535", timestamp: 1784738299074 },
        { obs: "", code: "20276", name: "João Filipe da Silva Maris Viegas", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4683", timestamp: 1784738299074 },
        { obs: "", code: "66791", name: "Pedro Alexandre Pires e Santos de Martins Gonçalves", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4772", timestamp: 1784738299074 },
        { obs: "", code: "66793", name: "Maria Cristina Reis de Miranda e Morais", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4773", timestamp: 1784738299074 },
        { obs: "", code: "66795", name: "Fernando Manuel Pinto de Pádua", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4775", timestamp: 1784738299074 },
        { obs: "", code: "20278", name: "Maria Victoria Carrilho Durán", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4783", timestamp: 1784738299074 },
        { obs: "", code: "20277", name: "Cristina Sanabria Lagar", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4784", timestamp: 1784738299074 },
        { obs: "", code: "20279", name: "María García García", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4785", timestamp: 1784738299074 },
        { obs: "", code: "66799", name: "Francisco Manuel de Matos Godinho Vaz", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4810", timestamp: 1784738299074 },
        { obs: "", code: "66658", name: "Colaboradores ESTG", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=4868", timestamp: 1784738299074 },
        { obs: "", code: "2000105", name: "João Maria Cabral Duarte Silva", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=27240", timestamp: 1784738299074 },
        { obs: "", code: "2000115", name: "Catarina Manuela Almeida Coelho", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=28976", timestamp: 1784738299074 },
        { obs: "", code: "2000117", name: "Rita Marisa da Silva Cruz", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=28977", timestamp: 1784738299074 },
        { obs: "", code: "2000116", name: "Alexandre Nuno Vaz Baptista de Vieira e Brito", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=28978", timestamp: 1784738299074 },
        { obs: "", code: "2000118", name: "Luís Manuel Faria Teodósio Figueira", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=28979", timestamp: 1784738299074 },
        { obs: "", code: "2000119", name: "Sónia Maria Gomes Batista", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=28982", timestamp: 1784738299074 },
        { obs: "", code: "66624", name: "Paula Maria Broeiro Gonçalves", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=30825", timestamp: 1784738299074 },
        { obs: "", code: "2000126", name: "Teresa Cristina Tourais de Afonso Rocha", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=31006", timestamp: 1784738299074 },
        { obs: "", code: "66829", name: "Patrícia Alexandra Gonçalves da Fonseca Lôpo", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=31557", timestamp: 1784738299074 },
        { obs: "", code: "66828", name: "Sónia de Fátima Vieira de Oliveira", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=31558", timestamp: 1784738299074 },
        { obs: "", code: "66835", name: "Florbela Maria Marmou Bia", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=31567", timestamp: 1784738299074 },
        { obs: "", code: "200319", name: "Isabel Maria Ramos Raminhas", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=32624", timestamp: 1784738299074 },
        { obs: "", code: "200334", name: "Luís Filipe do Carmo Calado", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=34016", timestamp: 1784738299074 },
        { obs: "", code: "999915", name: "Professor Teste", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=35776", timestamp: 1784738299074 },
        { obs: "", code: "22301", name: "Nuno Manuel Grilo de Oliveira", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=38288", timestamp: 1784738299074 },
        { obs: "", code: "999912", name: "Professor Teste", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=38513", timestamp: 1784738299074 },
        { obs: "", code: "20106", name: "Pedro Manuel Bairrão Henriques", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=38542", timestamp: 1784738299074 },
        { obs: "", code: "44456", name: "Ricardo Nuno da Fonseca Garcia Pereira Braga", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=38969", timestamp: 1784738299074 },
        { obs: "", code: "200659", name: "Luís Filipe Barbosa Proença Alves Domingues", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=39027", timestamp: 1784738299074 },
        { obs: "", code: "200551", name: "Carla Maria Lopes da Silva Afonso dos Santos", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=39028", timestamp: 1784738299074 },
        { obs: "", code: "200501", name: "Ana Isabel Coelho Borges", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=39029", timestamp: 1784738299074 },
        { obs: "", code: "2000158", name: "Pedro Damião de Sousa Henriques", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=39467", timestamp: 1784738299074 },
        { obs: "", code: "2000157", name: "Isabel Alexandra Joaquina Ramos", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=39468", timestamp: 1784738299074 },
        { obs: "", code: "200554", name: "Paula Alexandra Gonçalves Faria", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=39481", timestamp: 1784738299074 },
        { obs: "", code: "200556", name: "Ronney Arismel Mancebo Boloy", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=39487", timestamp: 1784738299074 },
        { obs: "", code: "200555", name: "Gisele Maria Ribeiro ", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=39488", timestamp: 1784738299074 },
        { obs: "", code: "2000161", name: "Maria Teresa Folgôa Batista", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=39503", timestamp: 1784738299074 },
        { obs: "", code: "0", name: "ignorar", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=39558", timestamp: 1784738299074 },
        { obs: "", code: "2000167", name: "Maria Raquel David Pereira Ventura Lucas", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=40135", timestamp: 1784738299074 },
        { obs: "", code: "2000170", name: "David Paulo Fangueiro", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=40141", timestamp: 1784738299074 },
        { obs: "", code: "2000171", name: "Luis Miguel Lindinho da Cunha Mendes Grilo", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=40142", timestamp: 1784738299074 },
        { obs: "", code: "200378", name: "Cristiano de Faveri", url: "https://pae.ipportalegre.pt/user/startProfileFromHome.do?userView.id=40204", timestamp: 1784738299074 }
    ],
    alertValueStr: "51",
    description: "Docentes importados para o PAE ainda sem username atribuido, necessidade de intervenção por parte da adminstração de sistemas para poderem entrar no PAE, necessidade de atribuir o username do email institucional e possivel criação",
    id: 2,
    alertValueInt: 51
};

const simulatedCoursesAwaitingRegistration = {
    updateDate: "2026-07-04 18:49:33.0",
    entities: [
        {
            code: "L5012",
            name: "Engenharia de Software e Inteligência Artificial",
            obs: "ESTG - Escola Superior de Tecnologia e Gestão",
            url: "https://pae.ipportalegre.pt/course/view.do?id=5012",
            timestamp: 1784738299074,
            metadata: { degreeType: "Licenciatura", sigesCode: "5012", temporaryCode: "TEMP-L5012", school: "ESTG" }
        },
        {
            code: "CT204",
            name: "Cibersegurança e Redes de Computadores",
            obs: "ESTG - Escola Superior de Tecnologia e Gestão",
            url: "https://pae.ipportalegre.pt/course/view.do?id=204",
            timestamp: 1784738299074,
            metadata: { degreeType: "CTeSP", sigesCode: "204", temporaryCode: "TEMP-CT204", school: "ESTG" }
        },
        {
            code: "M3015",
            name: "Mestrado em Gestão e Inovação Digital",
            obs: "ESTG - Escola Superior de Tecnologia e Gestão",
            url: "https://pae.ipportalegre.pt/course/view.do?id=3015",
            timestamp: 1784738299074,
            metadata: { degreeType: "Mestrado", sigesCode: "3015", temporaryCode: "TEMP-M3015", school: "ESTG" }
        },
        {
            code: "L7001",
            name: "Enfermagem e Cuidados Continuados",
            obs: "ESS - Escola Superior de Saúde",
            url: "https://pae.ipportalegre.pt/course/view.do?id=7001",
            timestamp: 1784738299074,
            metadata: { degreeType: "Licenciatura", sigesCode: "7001", temporaryCode: "TEMP-L7001", school: "ESS" }
        },
        {
            code: "CT109",
            name: "Produção Agrícola Sustentável e Biotecnologia",
            obs: "ESA - Escola Superior Agrária",
            url: "https://pae.ipportalegre.pt/course/view.do?id=109",
            timestamp: 1784738299074,
            metadata: { degreeType: "CTeSP", sigesCode: "109", temporaryCode: "TEMP-CT109", school: "ESA" }
        },
        {
            code: "L5045",
            name: "Design de Comunicação e Multimédia",
            obs: "ESTG - Escola Superior de Tecnologia e Gestão",
            url: "https://pae.ipportalegre.pt/course/view.do?id=5045",
            timestamp: 1784738299074,
            metadata: { degreeType: "Licenciatura", sigesCode: "5045", temporaryCode: "TEMP-L5045", school: "ESTG" }
        },
        {
            code: "L3002",
            name: "Educação Básica e Tecnologias Educativas",
            obs: "ESE - Escola Superior de Educação e Ciências Sociais",
            url: "https://pae.ipportalegre.pt/course/view.do?id=3002",
            timestamp: 1784738299074,
            metadata: { degreeType: "Licenciatura", sigesCode: "3002", temporaryCode: "TEMP-L3002", school: "ESE" }
        },
        {
            code: "M7020",
            name: "Mestrado em Enfermagem Comunitária",
            obs: "ESS - Escola Superior de Saúde",
            url: "https://pae.ipportalegre.pt/course/view.do?id=7020",
            timestamp: 1784738299074,
            metadata: { degreeType: "Mestrado", sigesCode: "7020", temporaryCode: "TEMP-M7020", school: "ESS" }
        }
    ],
    alertValueStr: "8",
    description: "Cursos encontrados no SIGES diferentes de cursos ficticios e que não têm entrada no PAE, criar Curso ou alterar código siges atribuido ao curso de promoção temporária",
    id: 729,
    alertValueInt: 8
};

const simulatedFaultyDtpArtifacts = [
    {
        entity: { code: "9670", name: "Administração de Publicidade e Marketing", timestamp: 1784748899077 },
        alerts: [
            {
                id: 3, alertValueInt: 12, alertValueStr: "12",
                description: "Planeamento em Falta",
                updateDate: "2026-07-22 17:42:36.0",
                entities: [
                    { code: "9670", name: "Direito do Marketing", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11655", timestamp: 1784738300900 },
                    { code: "9670", name: "Estatística", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11668", timestamp: 1784738300900 },
                    { code: "9670", name: "Marketing Operacional", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11705", timestamp: 1784738300901 },
                    { code: "9670", name: "Opção 1 APM", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11717", timestamp: 1784738300901 },
                    { code: "9670", name: "Comunicação de Marketing", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11743", timestamp: 1784738300901 },
                    { code: "9670", name: "Inglês", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12594", timestamp: 1784738300901 },
                    { code: "9670", name: "Gestão da Comunicação", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12633", timestamp: 1784738300901 },
                    { code: "9670", name: "Tecnologias e Serviços da Internet", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12664", timestamp: 1784738300901 },
                    { code: "9670", name: "Relações Públicas e Eventos", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12857", timestamp: 1784738300901 },
                    { code: "9670", name: "Marketing Internacional", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12865", timestamp: 1784738300901 },
                    { code: "9670", name: "Marketing de Serviços", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=13006", timestamp: 1784738300901 },
                    { code: "9670", name: "Inglês para Negócios", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=13035", timestamp: 1784738300901 }
                ]
            },
            {
                id: 4, alertValueInt: 1, alertValueStr: "1",
                description: "Sumários em Falta",
                updateDate: "2026-07-22 17:42:36.0",
                entities: [
                    { code: "9670", name: "Inglês para Negócios", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=13035", timestamp: 1784738300917 }
                ]
            },
            {
                id: 5, alertValueInt: 23, alertValueStr: "23",
                description: "Ficheiros de Notas em Falta",
                updateDate: "2026-07-22 17:42:36.0",
                entities: [
                    { code: "9670", name: "Introdução ao Marketing", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11641", timestamp: 1784738300938 },
                    { code: "9670", name: "Direito do Marketing", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11655", timestamp: 1784738300938 },
                    { code: "9670", name: "Estatística", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11668", timestamp: 1784738300938 },
                    { code: "9670", name: "Administração de Empresas", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11671", timestamp: 1784738300938 },
                    { code: "9670", name: "Informática de Gestão", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11703", timestamp: 1784738300938 },
                    { code: "9670", name: "Marketing Operacional", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11705", timestamp: 1784738300938 },
                    { code: "9670", name: "Opção 1 APM", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11717", timestamp: 1784738300938 },
                    { code: "9670", name: "Direito do Marketing e da Publicidade", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12016", timestamp: 1784738300938 },
                    { code: "9670", name: "Comportamento do Consumidor", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12073", timestamp: 1784738300938 },
                    { code: "9670", name: "Marketing Digital", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12077", timestamp: 1784738300938 },
                    { code: "9670", name: "Atelier de Publicidade", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12558", timestamp: 1784738300938 },
                    { code: "9670", name: "Laboratório de Marketing V", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12574", timestamp: 1784738300938 },
                    { code: "9670", name: "Inglês", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12594", timestamp: 1784738300938 },
                    { code: "9670", name: "Gestão da Comunicação", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12633", timestamp: 1784738300938 },
                    { code: "9670", name: "Laboratório de Marketing IV", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12648", timestamp: 1784738300938 },
                    { code: "9670", name: "Estágio/Projeto", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12652", timestamp: 1784738300938 },
                    { code: "9670", name: "Laboratório de Marketing II", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12653", timestamp: 1784738300938 },
                    { code: "9670", name: "Mercados e Negociação Comercial", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12678", timestamp: 1784738300938 },
                    { code: "9670", name: "Economia", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12680", timestamp: 1784738300938 },
                    { code: "9670", name: "Marketing de Serviços e de Turismo", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12686", timestamp: 1784738300938 },
                    { code: "9670", name: "Marketing Internacional", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12865", timestamp: 1784738300938 },
                    { code: "9670", name: "Estágio/Projeto", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12988", timestamp: 1784738300938 },
                    { code: "9670", name: "Marketing de Serviços", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=13006", timestamp: 1784738300938 }
                ]
            },
            {
                id: 6, alertValueInt: 21, alertValueStr: "21",
                description: "Enunciados em Falta",
                updateDate: "2026-07-22 17:42:36.0",
                entities: [
                    { code: "9670", name: "Introdução ao Marketing", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11641", timestamp: 1784738300961 },
                    { code: "9670", name: "Direito do Marketing", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11655", timestamp: 1784738300961 },
                    { code: "9670", name: "Estatística", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11668", timestamp: 1784738300961 },
                    { code: "9670", name: "Marketing Operacional", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11705", timestamp: 1784738300961 },
                    { code: "9670", name: "Opção 1 APM", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11717", timestamp: 1784738300961 },
                    { code: "9670", name: "Comunicação de Marketing", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11743", timestamp: 1784738300961 },
                    { code: "9670", name: "Direito do Marketing e da Publicidade", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12016", timestamp: 1784738300961 },
                    { code: "9670", name: "Comportamento do Consumidor", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12073", timestamp: 1784738300961 },
                    { code: "9670", name: "Simulação Empresarial", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12075", timestamp: 1784738300961 },
                    { code: "9670", name: "Atelier de Publicidade", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12558", timestamp: 1784738300961 },
                    { code: "9670", name: "Inglês", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12594", timestamp: 1784738300961 },
                    { code: "9670", name: "Comunicação Audiovisual", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12622", timestamp: 1784738300961 },
                    { code: "9670", name: "Gestão da Comunicação", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12633", timestamp: 1784738300961 },
                    { code: "9670", name: "Estágio/Projeto", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12652", timestamp: 1784738300961 },
                    { code: "9670", name: "Laboratório de Marketing II", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12653", timestamp: 1784738300961 },
                    { code: "9670", name: "Economia", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12680", timestamp: 1784738300961 },
                    { code: "9670", name: "Marketing de Serviços e de Turismo", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12686", timestamp: 1784738300961 },
                    { code: "9670", name: "Relações Públicas e Eventos", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12857", timestamp: 1784738300961 },
                    { code: "9670", name: "Marketing Internacional", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12865", timestamp: 1784738300961 },
                    { code: "9670", name: "Estágio/Projeto", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12988", timestamp: 1784738300961 },
                    { code: "9670", name: "Marketing de Serviços", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=13006", timestamp: 1784738300961 }
                ]
            },
            {
                id: 7, alertValueInt: 2, alertValueStr: "2",
                description: "Ficha de UC em Falta",
                updateDate: "2026-07-22 17:42:36.0",
                entities: [
                    { code: "9670", name: "Design e Composição Visual", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=13034", timestamp: 1784738300981 },
                    { code: "9670", name: "Inglês para Negócios", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=13035", timestamp: 1784738300981 }
                ]
            },
            {
                id: 8, alertValueInt: 2, alertValueStr: "2",
                description: "Ficha de UC por Validar",
                updateDate: "2026-07-22 17:42:36.0",
                entities: [
                    { code: "9670", name: "Marketing de Serviços", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=13006", timestamp: 1784738301000 },
                    { code: "9670", name: "Edição de Imagem", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=13033", timestamp: 1784738301000 }
                ]
            }
        ]
    },
    {
        entity: { code: "6347", name: "Agricultura Sustentável", timestamp: 1784748899104 },
        alerts: [
            {
                id: 9, alertValueInt: 8, alertValueStr: "8",
                description: "Planeamento em Falta",
                updateDate: "2026-07-22 17:42:36.0",
                entities: [
                    { code: "6347", name: "Rega e Gestão da Água", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12459", timestamp: 1784738301067 },
                    { code: "6347", name: "Estágio/Projeto/Dissertação", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12490", timestamp: 1784738301067 },
                    { code: "6347", name: "Modo de Produção Biológico", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12746", timestamp: 1784738301067 },
                    { code: "6347", name: "Agroecologia e biodiversidade", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12748", timestamp: 1784738301067 },
                    { code: "6347", name: "Uso e Conservação do Solo", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12749", timestamp: 1784738301067 },
                    { code: "6347", name: "Mitigação dos impactes ambientais da agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12750", timestamp: 1784738301067 },
                    { code: "6347", name: "Transição energética na agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12752", timestamp: 1784738301067 },
                    { code: "6347", name: "Smart farming e tecnologias de agricultura de precisão", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12755", timestamp: 1784738301067 }
                ]
            },
            {
                id: 10, alertValueInt: 1, alertValueStr: "1",
                description: "Sumários em Falta",
                updateDate: "2026-07-22 17:42:36.0",
                entities: [
                    { code: "6347", name: "Economia circular na agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12747", timestamp: 1784738301086 }
                ]
            },
            {
                id: 11, alertValueInt: 12, alertValueStr: "12",
                description: "Ficheiros de Notas em Falta",
                updateDate: "2026-07-22 17:42:36.0",
                entities: [
                    { code: "6347", name: "Rega e Gestão da Água", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12459", timestamp: 1784738301108 },
                    { code: "6347", name: "Estágio/Projeto/Dissertação", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12490", timestamp: 1784738301108 },
                    { code: "6347", name: "Modo de Produção Biológico", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12746", timestamp: 1784738301108 },
                    { code: "6347", name: "Economia circular na agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12747", timestamp: 1784738301108 },
                    { code: "6347", name: "Agroecologia e biodiversidade", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12748", timestamp: 1784738301108 },
                    { code: "6347", name: "Uso e Conservação do Solo", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12749", timestamp: 1784738301108 },
                    { code: "6347", name: "Mitigação dos impactes ambientais da agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12750", timestamp: 1784738301108 },
                    { code: "6347", name: "Proteção Integrada", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12751", timestamp: 1784738301108 },
                    { code: "6347", name: "Transição energética na agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12752", timestamp: 1784738301108 },
                    { code: "6347", name: "Produção Integrada - Componente Vegetal", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12754", timestamp: 1784738301108 },
                    { code: "6347", name: "Smart farming e tecnologias de agricultura de precisão", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12755", timestamp: 1784738301108 },
                    { code: "6347", name: "Produção Integrada - Componente Animal", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12756", timestamp: 1784738301108 }
                ]
            },
            {
                id: 14, alertValueInt: 1, alertValueStr: "1",
                description: "Ficha de UC por Validar",
                updateDate: "2026-07-22 17:42:37.0",
                entities: [
                    { code: "6347", name: "Gestão Florestal Sustentável", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=12753", timestamp: 1784738301167 }
                ]
            }
        ]
    }
];

const simulatedFaultyDtpArtifactsPrevYear = [
    {
        entity: { code: "9670", name: "Administração de Publicidade e Marketing", timestamp: 1784749596053 },
        alerts: [
            {
                id: 730, alertValueInt: 7, alertValueStr: "7",
                description: "Planeamento em Falta",
                updateDate: "2026-07-22 20:39:05.0",
                entities: [
                    { code: "9670", name: "Laboratório de Marketing I", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10500", timestamp: 1784748676824 },
                    { code: "9670", name: "Laboratório de Marketing II", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10503", timestamp: 1784748676824 },
                    { code: "9670", name: "Laboratório de Marketing V", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10623", timestamp: 1784748676824 },
                    { code: "9670", name: "Laboratório de Marketing III", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10641", timestamp: 1784748676824 },
                    { code: "9670", name: "Métricas de Marketing", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10677", timestamp: 1784748676824 },
                    { code: "9670", name: "Tecnologias e Serviços da Internet", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10732", timestamp: 1784748676824 },
                    { code: "9670", name: "Estágio/Projeto", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11527", timestamp: 1784748676824 }
                ]
            },
            {
                id: 732, alertValueInt: 17, alertValueStr: "17",
                description: "Ficheiros de Notas em Falta",
                updateDate: "2026-07-22 20:39:05.0",
                entities: [
                    { code: "9670", name: "Estatística", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10493", timestamp: 1784748676854 },
                    { code: "9670", name: "Administração de Empresas", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10497", timestamp: 1784748676854 },
                    { code: "9670", name: "Laboratório de Marketing I", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10500", timestamp: 1784748676854 },
                    { code: "9670", name: "Direito do Marketing", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10501", timestamp: 1784748676854 },
                    { code: "9670", name: "Técnicas de Expressão e Comunicação", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10502", timestamp: 1784748676854 },
                    { code: "9670", name: "Laboratório de Marketing II", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10503", timestamp: 1784748676854 },
                    { code: "9670", name: "Economia", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10511", timestamp: 1784748676854 },
                    { code: "9670", name: "Atelier de Publicidade", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10606", timestamp: 1784748676854 },
                    { code: "9670", name: "Comportamento do Consumidor", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10630", timestamp: 1784748676854 },
                    { code: "9670", name: "Laboratório de Marketing III", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10641", timestamp: 1784748676854 },
                    { code: "9670", name: "Marketing Relacional", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10645", timestamp: 1784748676854 },
                    { code: "9670", name: "Métricas de Marketing", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10677", timestamp: 1784748676854 },
                    { code: "9670", name: "Comunicação Audiovisual", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10681", timestamp: 1784748676854 },
                    { code: "9670", name: "Comunicação Publicitária", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10740", timestamp: 1784748676854 },
                    { code: "9670", name: "Marketing Digital", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10758", timestamp: 1784748676854 },
                    { code: "9670", name: "Estágio/Projeto", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11378", timestamp: 1784748676854 },
                    { code: "9670", name: "Estágio/Projeto", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11527", timestamp: 1784748676854 }
                ]
            },
            {
                id: 733, alertValueInt: 19, alertValueStr: "19",
                description: "Enunciados em Falta",
                updateDate: "2026-07-22 20:39:05.0",
                entities: [
                    { code: "9670", name: "Estatística", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10493", timestamp: 1784748676873 },
                    { code: "9670", name: "Introdução ao Marketing", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10494", timestamp: 1784748676873 },
                    { code: "9670", name: "Laboratório de Marketing I", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10500", timestamp: 1784748676873 },
                    { code: "9670", name: "Técnicas de Expressão e Comunicação", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10502", timestamp: 1784748676873 },
                    { code: "9670", name: "Laboratório de Marketing II", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10503", timestamp: 1784748676873 },
                    { code: "9670", name: "Informática de Gestão", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10505", timestamp: 1784748676873 },
                    { code: "9670", name: "Gestão da Comunicação", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10508", timestamp: 1784748676873 },
                    { code: "9670", name: "Economia", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10511", timestamp: 1784748676873 },
                    { code: "9670", name: "Atelier de Publicidade", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10606", timestamp: 1784748676873 },
                    { code: "9670", name: "Relações Públicas e Organizações de Eventos", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10609", timestamp: 1784748676873 },
                    { code: "9670", name: "Comportamento do Consumidor", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10630", timestamp: 1784748676873 },
                    { code: "9670", name: "Laboratório de Marketing III", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10641", timestamp: 1784748676873 },
                    { code: "9670", name: "Métricas de Marketing", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10677", timestamp: 1784748676873 },
                    { code: "9670", name: "Comunicação Audiovisual", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10681", timestamp: 1784748676873 },
                    { code: "9670", name: "Tecnologias e Serviços da Internet", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10732", timestamp: 1784748676873 },
                    { code: "9670", name: "Comunicação Publicitária", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10740", timestamp: 1784748676873 },
                    { code: "9670", name: "Marketing Digital", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10758", timestamp: 1784748676873 },
                    { code: "9670", name: "Estágio/Projeto", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11378", timestamp: 1784748676873 },
                    { code: "9670", name: "Estágio/Projeto", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11527", timestamp: 1784748676873 }
                ]
            }
        ]
    },
    {
        entity: { code: "6347", name: "Agricultura Sustentável", timestamp: 1784749596084 },
        alerts: [
            {
                id: 736, alertValueInt: 9, alertValueStr: "9",
                description: "Planeamento em Falta",
                updateDate: "2026-07-22 20:39:05.0",
                entities: [
                    { code: "6347", name: "Estágio/Projeto/Dissertação", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10878", timestamp: 1784748676922 },
                    { code: "6347", name: "Modo de Produção Biológico", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11200", timestamp: 1784748676922 },
                    { code: "6347", name: "Rega e Gestão da Água", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11201", timestamp: 1784748676922 },
                    { code: "6347", name: "Agroecologia e biodiversidade", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11203", timestamp: 1784748676922 },
                    { code: "6347", name: "Uso e Conservação do Solo", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11204", timestamp: 1784748676922 },
                    { code: "6347", name: "Mitigação dos impactes ambientais da agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11205", timestamp: 1784748676922 },
                    { code: "6347", name: "Transição energética na agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11207", timestamp: 1784748676922 },
                    { code: "6347", name: "Smart farming e tecnologias de agricultura de precisão", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11210", timestamp: 1784748676922 },
                    { code: "6347", name: "Produção Integrada - Componente Animal", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11211", timestamp: 1784748676922 }
                ]
            },
            {
                id: 737, alertValueInt: 2, alertValueStr: "2",
                description: "Sumários em Falta",
                updateDate: "2026-07-22 20:39:05.0",
                entities: [
                    { code: "6347", name: "Rega e Gestão da Água", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11201", timestamp: 1784748676940 },
                    { code: "6347", name: "Transição energética na agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11207", timestamp: 1784748676940 }
                ]
            },
            {
                id: 738, alertValueInt: 11, alertValueStr: "11",
                description: "Ficheiros de Notas em Falta",
                updateDate: "2026-07-22 20:39:05.0",
                entities: [
                    { code: "6347", name: "Estágio/Projeto/Dissertação", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10878", timestamp: 1784748676958 },
                    { code: "6347", name: "Modo de Produção Biológico", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11200", timestamp: 1784748676958 },
                    { code: "6347", name: "Rega e Gestão da Água", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11201", timestamp: 1784748676958 },
                    { code: "6347", name: "Agroecologia e biodiversidade", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11203", timestamp: 1784748676958 },
                    { code: "6347", name: "Uso e Conservação do Solo", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11204", timestamp: 1784748676958 },
                    { code: "6347", name: "Mitigação dos impactes ambientais da agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11205", timestamp: 1784748676958 },
                    { code: "6347", name: "Proteção Integrada", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11206", timestamp: 1784748676958 },
                    { code: "6347", name: "Transição energética na agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11207", timestamp: 1784748676958 },
                    { code: "6347", name: "Produção Integrada - Componente Vegetal", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11209", timestamp: 1784748676958 },
                    { code: "6347", name: "Smart farming e tecnologias de agricultura de precisão", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11210", timestamp: 1784748676958 },
                    { code: "6347", name: "Produção Integrada - Componente Animal", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11211", timestamp: 1784748676958 }
                ]
            },
            {
                id: 739, alertValueInt: 14, alertValueStr: "14",
                description: "Enunciados em Falta",
                updateDate: "2026-07-22 20:39:05.0",
                entities: [
                    { code: "6347", name: "Métodos e Técnicas de Investigação", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10818", timestamp: 1784748676980 },
                    { code: "6347", name: "Estágio/Projeto/Dissertação", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=10878", timestamp: 1784748676980 },
                    { code: "6347", name: "Modo de Produção Biológico", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11200", timestamp: 1784748676980 },
                    { code: "6347", name: "Rega e Gestão da Água", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11201", timestamp: 1784748676980 },
                    { code: "6347", name: "Economia circular na agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11202", timestamp: 1784748676980 },
                    { code: "6347", name: "Agroecologia e biodiversidade", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11203", timestamp: 1784748676980 },
                    { code: "6347", name: "Uso e Conservação do Solo", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11204", timestamp: 1784748676980 },
                    { code: "6347", name: "Mitigação dos impactes ambientais da agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11205", timestamp: 1784748676980 },
                    { code: "6347", name: "Proteção Integrada", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11206", timestamp: 1784748676980 },
                    { code: "6347", name: "Transição energética na agricultura", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11207", timestamp: 1784748676980 },
                    { code: "6347", name: "Gestão Florestal Sustentável", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11208", timestamp: 1784748676980 },
                    { code: "6347", name: "Produção Integrada - Componente Vegetal", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11209", timestamp: 1784748676980 },
                    { code: "6347", name: "Smart farming e tecnologias de agricultura de precisão", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11210", timestamp: 1784748676980 },
                    { code: "6347", name: "Produção Integrada - Componente Animal", url: "https://pae.ipportalegre.pt/user/startLoadCourseUnitFromHome.do?id=11211", timestamp: 1784748676980 }
                ]
            }
        ]
    }
];

const simulatedTickets = {
    alerts: [
        {
            observationDate: "2026/07/25",
            entities: [],
            alertValueStr: "9",
            description: "PAE - Geral",
            id: 0,
            alertValueInt: 9
        },
        {
            observationDate: "2026/07/25",
            entities: [],
            alertValueStr: "8",
            description: "PAE - Problemas na Autenticação do PAE",
            id: 0,
            alertValueInt: 8
        },
        {
            observationDate: "2026/07/25",
            entities: [],
            alertValueStr: "7",
            description: "Informática - Acesso ao EMAIL",
            id: 0,
            alertValueInt: 7
        },
        {
            observationDate: "2026/07/25",
            entities: [],
            alertValueStr: "4",
            description: "Informática - Geral",
            id: 0,
            alertValueInt: 4
        }
    ],
    entity: {
        name: "Tickets abertos por categoria monitorizada",
        url: "https://pae.ipportalegre.pt/user/ticketsMonitor.do",
        timestamp: 0
    }
};

const simulatedPedagogicoStudents = {
    entity: {
        name: "Dashboard dos Inquéritos Pedagógicos",
        url: "https://pae.ipportalegre.pt/user/questionarios/dashboard/dashboard.jsp",
        timestamp: Date.now()
    },
    alerts: [
        { id: 1, description: "IPP", alertValueFloat: 4.51, metricMetadata: { institutionCode: "IPP", institutionName: "Instituto Politécnico de Portalegre" } },
        { id: 2, description: "ESTGD", alertValueFloat: 4.31, metricMetadata: { institutionCode: "ESTGD", institutionName: "Escola Superior de Tecnologia, Gestão e Design" } },
        { id: 3, description: "ESECS", alertValueFloat: 4.51, metricMetadata: { institutionCode: "ESECS", institutionName: "Escola Superior de Educação e Ciências Sociais" } },
        { id: 4, description: "ESBE", alertValueFloat: 4.47, metricMetadata: { institutionCode: "ESBE", institutionName: "Escola Superior de Biociências de Elvas" } },
        { id: 5, description: "ESSP", alertValueFloat: 4.59, metricMetadata: { institutionCode: "ESSP", institutionName: "Escola Superior de Saúde de Portalegre" } }
    ],
    schools: [
        { code: "IPP", name: "Instituto Politécnico de Portalegre", mediaAnual: 4.51, mediaS1: 4.51, mediaS2: null },
        { code: "ESTGD", name: "Escola Superior de Tecnologia, Gestão e Design", mediaAnual: 4.31, mediaS1: 4.31, mediaS2: null },
        { code: "ESECS", name: "Escola Superior de Educação e Ciências Sociais", mediaAnual: 4.51, mediaS1: 4.52, mediaS2: null },
        { code: "ESBE", name: "Escola Superior de Biociências de Elvas", mediaAnual: 4.47, mediaS1: 4.47, mediaS2: null },
        { code: "ESSP", name: "Escola Superior de Saúde de Portalegre", mediaAnual: 4.59, mediaS1: 4.59, mediaS2: null }
    ]
};

const simulatedPedagogicoGrouping = {
    entity: {
        name: "Médias Pedagógicas Agrupadas",
        timestamp: Date.now()
    },
    alerts: [
        { id: 1, description: "Engenharia de Software", alertValueFloat: 4.45, metricMetadata: { institutionCode: "ESTGD", ucName: "Engenharia de Software", personName: "Prof. António Silva", department: "L.INF1" } },
        { id: 2, description: "Sistemas Distribuídos", alertValueFloat: 4.20, metricMetadata: { institutionCode: "ESTGD", ucName: "Sistemas Distribuídos", personName: "Prof. Maria Santos", department: "L.INF2" } },
        { id: 3, description: "Psicologia Educacional", alertValueFloat: 4.55, metricMetadata: { institutionCode: "ESECS", ucName: "Psicologia Educacional", personName: "Prof. Clara Rodrigues", department: "A102" } },
        { id: 4, description: "Biotecnologia Agrícola", alertValueFloat: 4.48, metricMetadata: { institutionCode: "ESBE", ucName: "Biotecnologia Agrícola", personName: "Prof. João Ferreira", department: "L.BIO" } },
        { id: 5, description: "Enfermagem Fundamental", alertValueFloat: 4.62, metricMetadata: { institutionCode: "ESSP", ucName: "Enfermagem Fundamental", personName: "Prof. Teresa Lima", department: "S.SIM" } }
    ],
    groupings: [
        { id: 1, school: "ESTGD", uc: "Engenharia de Software", docente: "Prof. António Silva", sala: "L.INF1", mediaAnual: 4.45, mediaS1: 4.50, mediaS2: 4.40 },
        { id: 2, school: "ESTGD", uc: "Sistemas Distribuídos", docente: "Prof. Maria Santos", sala: "L.INF2", mediaAnual: 4.20, mediaS1: 4.15, mediaS2: 4.25 },
        { id: 3, school: "ESECS", uc: "Psicologia Educacional", docente: "Prof. Clara Rodrigues", sala: "A102", mediaAnual: 4.55, mediaS1: 4.60, mediaS2: 4.50 },
        { id: 4, school: "ESBE", uc: "Biotecnologia Agrícola", docente: "Prof. João Ferreira", sala: "L.BIO", mediaAnual: 4.48, mediaS1: 4.48, mediaS2: null },
        { id: 5, school: "ESSP", uc: "Enfermagem Fundamental", docente: "Prof. Teresa Lima", sala: "S.SIM", mediaAnual: 4.62, mediaS1: 4.62, mediaS2: null }
    ]
};

const simulatedPedagogicoTimeline = {
    entity: {
        name: "Evolução Histórica da Avaliação Pedagógica",
        timestamp: Date.now()
    },
    alerts: [
        { observationDate: "2018/19", alertValueFloat: 4.25, metricMetadata: { institutionCode: "IPP" } },
        { observationDate: "2019/20", alertValueFloat: 4.30, metricMetadata: { institutionCode: "IPP" } },
        { observationDate: "2020/21", alertValueFloat: 4.18, metricMetadata: { institutionCode: "IPP" } },
        { observationDate: "2021/22", alertValueFloat: 4.40, metricMetadata: { institutionCode: "IPP" } },
        { observationDate: "2022/23", alertValueFloat: 4.35, metricMetadata: { institutionCode: "IPP" } },
        { observationDate: "2023/24", alertValueFloat: 4.45, metricMetadata: { institutionCode: "IPP" } },
        { observationDate: "2024/25", alertValueFloat: 4.42, metricMetadata: { institutionCode: "IPP" } },
        { observationDate: "2025/26", alertValueFloat: 4.51, metricMetadata: { institutionCode: "IPP" } }
    ],
    timeline: [
        { period: "2018/19", IPP: 4.25, ESTGD: 4.10, ESECS: 4.30, ESBE: 4.15, ESSP: 4.40 },
        { period: "2019/20", IPP: 4.30, ESTGD: 4.15, ESECS: 4.35, ESBE: 4.20, ESSP: 4.45 },
        { period: "2020/21", IPP: 4.18, ESTGD: 3.95, ESECS: 4.22, ESBE: 4.10, ESSP: 4.38 },
        { period: "2021/22", IPP: 4.40, ESTGD: 4.28, ESECS: 4.38, ESBE: 4.35, ESSP: 4.52 },
        { period: "2022/23", IPP: 4.35, ESTGD: 4.20, ESECS: 4.32, ESBE: 4.30, ESSP: 4.50 },
        { period: "2023/24", IPP: 4.45, ESTGD: 4.30, ESECS: 4.40, ESBE: 4.42, ESSP: 4.56 },
        { period: "2024/25", IPP: 4.42, ESTGD: 4.25, ESECS: 4.39, ESBE: 4.45, ESSP: 4.58 },
        { period: "2025/26", IPP: 4.51, ESTGD: 4.31, ESECS: 4.51, ESBE: 4.47, ESSP: 4.59 }
    ]
};

export {
    simulatedBirthdays,
    simulatedTeachersWithoutUsername,
    simulatedCoursesAwaitingRegistration,
    simulatedFaultyDtpArtifacts,
    simulatedFaultyDtpArtifactsPrevYear,
    simulatedTickets,
    simulatedPedagogicoStudents,
    simulatedPedagogicoGrouping,
    simulatedPedagogicoTimeline
};

export default {
    simulatedBirthdays,
    simulatedTeachersWithoutUsername,
    simulatedCoursesAwaitingRegistration,
    simulatedFaultyDtpArtifacts,
    simulatedFaultyDtpArtifactsPrevYear,
    simulatedTickets,
    simulatedPedagogicoStudents,
    simulatedPedagogicoGrouping,
    simulatedPedagogicoTimeline
};

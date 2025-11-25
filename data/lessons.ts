import { Lesson, Course, Module, TabOption } from '../types';

const CURRENT_YEAR = new Date().getFullYear();

// Helper for random duration between 50 and 60 minutes
const getRandomDuration = () => {
  const minutes = Math.floor(Math.random() * (60 - 50 + 1) + 50);
  return `${minutes}:00`;
};

// --- MINICURSO DATA ---
const MINICOURSE_MODULE: Module = {
  id: 1,
  courseId: 'minicourse',
  title: 'Minicurso Gratuito',
  lessons: [
    {
      id: 1,
      courseId: 'minicourse',
      moduleId: 1,
	      title: "Aula 1 - Introdução",
      releaseDate: "2023-01-01T00:00:00",
      duration: "60:00",
      isLocked: false,
    },
    {
      id: 2,
      courseId: 'minicourse',
      moduleId: 1,
      title: "Quais doenças nascem das emoções?",
      releaseDate: `${CURRENT_YEAR}-12-03T20:00:00`,
      duration: "60:00",
      isLocked: true,
    },
    {
      id: 3,
      courseId: 'minicourse',
      moduleId: 1,
      title: "Análise corporal ao vivo",
      releaseDate: `${CURRENT_YEAR}-12-05T20:00:00`,
      duration: "60:00",
      isLocked: true,
    },
    {
      id: 4,
      courseId: 'minicourse',
      moduleId: 1,
      title: "Como viver de leitura corporal?",
      releaseDate: `${CURRENT_YEAR}-12-07T20:00:00`,
      duration: "60:00",
      isLocked: true,
    }
  ]
};

// --- FORMATION RAW DATA ---
const RAW_FORMATION_DATA = [
  {
    "id": 1,
    "titulo": "Boas Vindas",
    "aulas": [
      { "titulo": "Boas Vindas", "duracao": null },
      { "titulo": "Comunidade no WhatsApp", "duracao": null },
      { "titulo": "Termo de uso", "duracao": null },
      { "titulo": "Como aproveitar melhor a formação", "duracao": "03:07" }
    ]
  },
  {
    "id": 2,
    "titulo": "O Triângulo de Karpman e a sua vida",
    "aulas": [
      { "titulo": "As 4 Leis do Espelho – Jacques Lacan", "duracao": "01:11:27" },
      { "titulo": "O Triângulo Dramático de Karpman", "duracao": "51:24" }
    ]
  },
  {
    "id": 3,
    "titulo": "Criança Interior",
    "aulas": [
      { "titulo": "A Criança Interior", "duracao": "42:08" },
      { "titulo": "O Drama e as Esferas de Representação da Criança Interior", "duracao": "54:46" },
      { "titulo": "Exercício da Criança: Sequência da Aula de Drama e Esferas de Representação", "duracao": "18:52" },
      { "titulo": "O Ressentimento e os Conflitos da Criança Interior", "duracao": "29:23" },
      { "titulo": "Aula de Exercícios de Ressentimentos e Conflitos da Criança Interior", "duracao": "01:11:00" }
    ]
  },
  {
    "id": 4,
    "titulo": "Os 5 princípios da Terapia Integrativa",
    "aulas": [
      { "titulo": "1º – Água", "duracao": "13:03" },
      { "titulo": "2º – Grounding", "duracao": "17:00" },
      { "titulo": "3º – Alimentação", "duracao": "14:27" },
      { "titulo": "4º – Sol", "duracao": "05:56" },
      { "titulo": "5º – Exercícios", "duracao": "16:48" }
    ]
  },
  {
    "id": 5,
    "titulo": "Por que atraio aquilo que não quero",
    "aulas": [
      { "titulo": "Por que eu atraio o que não quero – PARTE 1", "duracao": "24:15" },
      { "titulo": "Por que eu atraio o que não quero – PARTE 2", "duracao": "14:28" },
      { "titulo": "Por que eu atraio o que não quero – PARTE 3", "duracao": "13:44" },
      { "titulo": "MATERIAL DE APOIO", "duracao": null },
      { "titulo": "QUIZ", "duracao": null }
    ]
  },
  {
    "id": 6,
    "titulo": "Rapport",
    "aulas": [
      { "titulo": "Rapport", "duracao": "35:17" }
    ]
  },
  {
    "id": 7,
    "titulo": "Nossas percepções e a lente da dor",
    "aulas": [
      { "titulo": "As histórias que eu conto pra mim e as historinhas do meu cliente", "duracao": "19:12" },
      { "titulo": "As historinhas e o Triângulo do Problema", "duracao": "18:26" },
      { "titulo": "A percepção de um olhar não é verdade absoluta, é apenas um olhar", "duracao": "27:31" },
      { "titulo": "Transferências e contra-transferências", "duracao": "35:00" },
      { "titulo": "Exercício profundo para as historinhas", "duracao": "43:51" },
      { "titulo": "QUIZ", "duracao": null }
    ]
  },
  {
    "id": 8,
    "titulo": "Bases da Psicanálise",
    "aulas": [
      { "titulo": "As bases da Psicanálise – PT I", "duracao": "16:58" },
      { "titulo": "As bases da Psicanálise – PT II", "duracao": "15:35" },
      { "titulo": "Couraças – PT I", "duracao": "08:18" },
      { "titulo": "Couraças – PT II", "duracao": "16:00" },
      { "titulo": "Couraças – PT III", "duracao": "15:29" },
      { "titulo": "Couraças – PT IV", "duracao": "08:33" },
      { "titulo": "QUIZ", "duracao": null },
      { "titulo": "Mecanismos de Defesa do Trauma – PT I", "duracao": "38:05" },
      { "titulo": "Mecanismos de Defesa dos Traumas – PT II", "duracao": "11:53" },
      { "titulo": "Mecanismos de Defesa por Tipo de Trauma", "duracao": "23:58" },
      { "titulo": "QUIZ", "duracao": null },
      { "titulo": "Punções – O impulso que te leva a fazer", "duracao": "06:14" },
      { "titulo": "Sonhos", "duracao": "10:31" },
      { "titulo": "A escuta e as vertentes", "duracao": "26:11" },
      { "titulo": "QUIZ", "duracao": null }
    ]
  },
  {
    "id": 9,
    "titulo": "As Ordens da ajuda e a Lei",
    "aulas": [
      { "titulo": "As Leis Sistêmicas – PT I", "duracao": "10:59" },
      { "titulo": "As Leis Sistêmicas – PT II", "duracao": "11:22" },
      { "titulo": "Os Emaranhamentos", "duracao": "22:12" },
      { "titulo": "Masculino e Feminino Saudáveis e Doentes", "duracao": "16:56" },
      { "titulo": "As Ordens da Ajuda", "duracao": "12:06" },
      { "titulo": "QUIZ", "duracao": null },
      { "titulo": "Emaranhamento Sistêmico", "duracao": "30:28" },
      { "titulo": "A boa e a má consciência", "duracao": "11:42" },
      { "titulo": "Masculino e Feminino: Introdução, história e cultura", "duracao": "06:14" },
      { "titulo": "Masculino Interrompido", "duracao": "09:22" },
      { "titulo": "Feminino Interrompido", "duracao": "11:48" },
      { "titulo": "Constelação: Exercício de integração do masculino e do feminino", "duracao": "15:26" },
      { "titulo": "QUIZ", "duracao": null }
    ]
  },
  {
    "id": 10,
    "titulo": "A História da Leitura Corporal",
    "aulas": [
      { "titulo": "A história da Leitura Corporal – PARTE 1", "duracao": "10:10" },
      { "titulo": "A história da Leitura Corporal – PARTE 2", "duracao": "09:14" },
      { "titulo": "A história da Leitura Corporal – PARTE 3", "duracao": "12:54" },
      { "titulo": "A história da Leitura Corporal – PARTE 4", "duracao": "12:20" },
      { "titulo": "MATERIAL DE APOIO", "duracao": null },
      { "titulo": "QUIZ", "duracao": null }
    ]
  },
  {
    "id": 11,
    "titulo": "Embriologis Básica",
    "aulas": [
      { "titulo": "Embriologia Básica – Aula I", "duracao": "12:08" },
      { "titulo": "Embriologia Básica – Aula II", "duracao": "09:53" },
      { "titulo": "Embriologia Básica – Aula III", "duracao": "08:37" },
      { "titulo": "Emvriologia Básica – Aula IV", "duracao": "19:29" },
      { "titulo": "Embriologia Básica – Resumão", "duracao": "08:30" },
      { "titulo": "QUIZ", "duracao": null },
      { "titulo": "MATERIAL DE APOIO", "duracao": null }
    ]
  },
  {
    "id": 12,
    "titulo": "Afetos Intra Uterinos",
    "aulas": [
      { "titulo": "Afeto pele fetal", "duracao": "28:38" },
      { "titulo": "Afeto Cinético", "duracao": "09:51" },
      { "titulo": "Afeto Umbilical", "duracao": "06:27" },
      { "titulo": "Fase Oral", "duracao": "04:56" },
      { "titulo": "Fase Anal", "duracao": "04:31" },
      { "titulo": "Fase Fálica", "duracao": "05:46" },
      { "titulo": "A Visão Sistêmica nas Fases da Infância", "duracao": "36:24" },
      { "titulo": "As 5 dimensões da Leitura Corporal e os inconscientes", "duracao": "11:30" },
      { "titulo": "MATERIAL DE APOIO", "duracao": null },
      { "titulo": "QUIZ", "duracao": null }
    ]
  },
  {
    "id": 13,
    "titulo": "Um convite torne-se um observador, não um espectador",
    "aulas": [
      { "titulo": "MATERIAL DE APOIO", "duracao": null },
      { "titulo": "Torne se um Observador e não um Mero Expectador", "duracao": "18:55" },
      { "titulo": "Neuroplasticidade", "duracao": "11:13" },
      { "titulo": "Neuroplasticidade e a velocidade da cura", "duracao": "33:28" },
      { "titulo": "Exercícios de reprogramação mental", "duracao": "18:35" },
      { "titulo": "QUIZ I", "duracao": null },
      { "titulo": "O trauma", "duracao": "27:37" },
      { "titulo": "Tipos de trauma", "duracao": "21:31" },
      { "titulo": "Como o trauma \" mora\" no corpo e no cérebro - Oque a ciência mostra", "duracao": "14:29" },
      { "titulo": "Oque é psicoeducação", "duracao": "36:17" },
      { "titulo": "Metáforas Terapêuticas", "duracao": "19:04" },
      { "titulo": "O trauma como essência viva", "duracao": "21:35" },
      { "titulo": "As camadas do trauma", "duracao": "39:53" },
      { "titulo": "Investigação compassiva", "duracao": "26:23" },
      { "titulo": "QUIZ II", "duracao": null }
    ]
  },
  {
    "id": 14,
    "titulo": "O esquizoide",
    "aulas": [
      { "titulo": "Introdução ao traço esquizoide: origem e funcionamento", "duracao": null },
      { "titulo": "Sinais corporais e posturas do traço esquizoide", "duracao": null },
      { "titulo": "Medos, defesas emocionais e estratégias de afastamento", "duracao": null },
      { "titulo": "Manejo terapêutico com clientes de traço esquizoide", "duracao": null },
      { "titulo": "Exercícios práticos de acolhimento e pertencimento para o traço esquizoide", "duracao": null }
    ]
  },
  {
    "id": 15,
    "titulo": "O oral",
    "aulas": [
      { "titulo": "Introdução ao traço oral: necessidades, carências e vínculos", "duracao": null },
      { "titulo": "Sinais corporais e padrões de apego do traço oral", "duracao": null },
      { "titulo": "Fome emocional, dependência afetiva e busca por acolhimento", "duracao": null },
      { "titulo": "Manejo terapêutico com clientes de traço oral", "duracao": null },
      { "titulo": "Exercícios sistêmicos para fortalecer o auto nutrimento e a autonomia", "duracao": null }
    ]
  },
  {
    "id": 16,
    "titulo": "O psico ou psicopata",
    "aulas": [
      { "titulo": "Introdução ao traço psico: poder, controle e sedução", "duracao": null },
      { "titulo": "Leitura corporal do traço psico ou psicopata", "duracao": null },
      { "titulo": "Dinâmicas de manipulação, encantamento e afastamento afetivo", "duracao": null },
      { "titulo": "Ética, limites e cuidados no atendimento de clientes com traço psico", "duracao": null },
      { "titulo": "Intervenções terapêuticas focadas em responsabilidade e vínculo real", "duracao": null }
    ]
  },
  {
    "id": 17,
    "titulo": "O mazoca ou mazoquista",
    "aulas": [
      { "titulo": "Introdução ao traço mazoca ou mazoquista: origem e estrutura de dor", "duracao": null },
      { "titulo": "Sinais corporais e linguagem do corpo no traço mazoquista", "duracao": null },
      { "titulo": "Culpa, vergonha e auto punição na dinâmica mazoquista", "duracao": null },
      { "titulo": "Estratégias terapêuticas para aliviar o peso, a sobrecarga e a submissão", "duracao": null },
      { "titulo": "Exercícios de expressão, limite saudável e autorização para o prazer", "duracao": null }
    ]
  },
  {
    "id": 18,
    "titulo": "O rígido",
    "aulas": [
      { "titulo": "Introdução ao traço rígido: perfeccionismo, desempenho e controle", "duracao": null },
      { "titulo": "Leitura corporal do traço rígido e suas armaduras", "duracao": null },
      { "titulo": "Medo de falhar, comparação e defesa pela performance", "duracao": null },
      { "titulo": "Caminhos terapêuticos para flexibilizar o traço rígido", "duracao": null },
      { "titulo": "Exercícios práticos de confiança, entrega e vulnerabilidade", "duracao": null }
    ]
  },
  {
    "id": 19,
    "titulo": "Como nasceu o método TRIÍADE",
    "aulas": [
      { "titulo": "A história pessoal e profissional que originou o Método TRIÍADE", "duracao": null },
      { "titulo": "Os pilares fundamentais da TRIÍADE: criança interior, dores existenciais e relação com os pais", "duracao": null },
      { "titulo": "Como as três camadas do inconsciente se conectam", "duracao": null },
      { "titulo": "Por que a TRIÍADE é diferente de outros métodos terapêuticos", "duracao": null },
      { "titulo": "Aplicações práticas e resultados reais obtidos com o método", "duracao": null }
    ]
  },
  {
    "id": 20,
    "titulo": "Como aplicar a Anamnese",
    "aulas": [
      { "titulo": "A importância da anamnese para um atendimento seguro e profundo", "duracao": null },
      { "titulo": "Passo a passo da anamnese: como conduzir desde o primeiro contato", "duracao": null },
      { "titulo": "Como identificar padrões, traços e dores emocionais durante a anamnese", "duracao": null },
      { "titulo": "Perguntas essenciais que todo terapeuta deve fazer", "duracao": null },
      { "titulo": "Como transformar a anamnese em um mapa terapêutico para as sessões", "duracao": null }
    ]
  },
  {
    "id": 21,
    "titulo": "Ferramenta TRIÍADE",
    "aulas": [
      { "titulo": "Como funciona a ferramenta TRIÍADE e seus 3 pilares", "duracao": null },
      { "titulo": "Como identificar qual pilar trabalhar primeiro em cada cliente", "duracao": null },
      { "titulo": "Integração entre os pilares: da teoria à prática", "duracao": null },
      { "titulo": "Estudos de caso com aplicação da Ferramenta TRIÍADE", "duracao": null },
      { "titulo": "Exercícios guiados para aplicar a TRIÍADE nas sessões", "duracao": null }
    ]
  },
  {
    "id": 22,
    "titulo": "Método TRIÍADE: Aplicação e Variações",
    "aulas": [
      { "titulo": "Como adaptar o Método TRIÍADE para diferentes perfis emocionais", "duracao": null },
      { "titulo": "TRIÍADE individual, em grupo, ao vivo e online", "duracao": null },
      { "titulo": "Como conduzir sessões intensivas usando a TRIÍADE", "duracao": null },
      { "titulo": "Como aplicar a TRIÍADE de forma ética e responsável", "duracao": null },
      { "titulo": "Protocolos e variações avançadas para casos complexos", "duracao": null }
    ]
  },
  {
    "id": 23,
    "titulo": "A verdade sobre ansiedade",
    "aulas": [
      { "titulo": "O que realmente é ansiedade: visão emocional, corporal e neurológica", "duracao": null },
      { "titulo": "Sinais corporais da ansiedade que o terapeuta precisa identificar", "duracao": null },
      { "titulo": "Dores existenciais e traços de caráter que agravam a ansiedade", "duracao": null },
      { "titulo": "Ferramentas e técnicas para aliviar a ansiedade durante as sessões", "duracao": null },
      { "titulo": "Como trabalhar traumas associados à ansiedade usando a TRIÍADE", "duracao": null }
    ]
  },
  {
    "id": 24,
    "titulo": "Tudo que eu temo me sobrevém",
    "aulas": [
      { "titulo": "A origem emocional do medo antecipatório", "duracao": null },
      { "titulo": "Como pensamentos recorrentes moldam a percepção da realidade", "duracao": null },
      { "titulo": "O papel das crenças e memórias traumáticas no medo", "duracao": null },
      { "titulo": "Intervenções corporais para quebrar ciclos de antecipação negativa", "duracao": null },
      { "titulo": "Exercício prático: ressignificando o medo que se repete", "duracao": null }
    ]
  },
  {
    "id": 25,
    "titulo": "Medo",
    "aulas": [
      { "titulo": "Os diferentes tipos de medo e suas raízes no inconsciente", "duracao": null },
      { "titulo": "Leitura corporal: como o corpo expressa medo sem palavras", "duracao": null },
      { "titulo": "Como o medo molda decisões, relacionamentos e comportamentos", "duracao": null },
      { "titulo": "Técnicas para dissolução de medos profundos", "duracao": null },
      { "titulo": "Exercício guiado para libertação do medo", "duracao": null }
    ]
  },
  {
    "id": 26,
    "titulo": "Crenças Limitantes",
    "aulas": [
      { "titulo": "O que são crenças limitantes e como se formam", "duracao": null },
      { "titulo": "Relação entre traços de caráter e crenças profundas", "duracao": null },
      { "titulo": "Como identificar crenças no corpo, na fala e no comportamento", "duracao": null },
      { "titulo": "Ferramentas para reprogramação emocional e mental", "duracao": null },
      { "titulo": "Exercício sistêmico: ressignificando crenças de origem familiar", "duracao": null }
    ]
  },
  {
    "id": 27,
    "titulo": "Depressão",
    "aulas": [
      { "titulo": "A depressão sob a ótica da terapia corporal e sistêmica", "duracao": null },
      { "titulo": "Sinais corporais e emocionais presentes em quadros depressivos", "duracao": null },
      { "titulo": "Diferença entre tristeza profunda e depressão clínica", "duracao": null },
      { "titulo": "Como trabalhar o corpo, a mente e a história do cliente", "duracao": null },
      { "titulo": "Protocolo seguro para atendimento de clientes com depressão", "duracao": null }
    ]
  },
  {
    "id": 28,
    "titulo": "Podemos falar em cura?",
    "aulas": [
      { "titulo": "O conceito de cura nas terapias integrativas", "duracao": null },
      { "titulo": "A diferença entre curar, tratar e ressignificar", "duracao": null },
      { "titulo": "Como funciona o processo de cura emocional no corpo", "duracao": null },
      { "titulo": "Limites éticos: o que o terapeuta pode ou não prometer", "duracao": null },
      { "titulo": "A cura como jornada: acolhimento, consciência e movimento", "duracao": null }
    ]
  },
  {
    "id": 29,
    "titulo": "Será que eu nasci para ser terapeuta?",
    "aulas": [
      { "titulo": "O chamado interno: sinais de que a terapia é o seu caminho", "duracao": null },
      { "titulo": "As habilidades naturais de um terapeuta corporal e sistêmico", "duracao": null },
      { "titulo": "Medos comuns de quem está começando na terapia", "duracao": null },
      { "titulo": "Como saber se tenho perfil para atender pessoas", "duracao": null },
      { "titulo": "O desenvolvimento contínuo do terapeuta: prática, estudo e ética", "duracao": null }
    ]
  },
  {
    "id": 30,
    "titulo": "Paciente ou cliente?",
    "aulas": [
      { "titulo": "A diferença entre paciente e cliente na prática terapêutica", "duracao": null },
      { "titulo": "Como escolher o termo ideal para seu posicionamento profissional", "duracao": null },
      { "titulo": "Aspectos éticos na relação terapeuta–cliente", "duracao": null },
      { "titulo": "Como construir uma relação de respeito, confiança e limites", "duracao": null },
      { "titulo": "As expectativas do cliente e como alinhá-las nas primeiras sessões", "duracao": null }
    ]
  },
  {
    "id": 31,
    "titulo": "Compaixão x empatia x piedade",
    "aulas": [
      { "titulo": "Diferenças emocionais entre compaixão, empatia e piedade", "duracao": null },
      { "titulo": "Como cada postura impacta o cliente e o processo terapêutico", "duracao": null },
      { "titulo": "Riscos da empatia excessiva no atendimento", "duracao": null },
      { "titulo": "Como desenvolver compaixão ativa sem carregar o cliente", "duracao": null },
      { "titulo": "Exercícios de auto-regulação emocional para o terapeuta", "duracao": null }
    ]
  },
  {
    "id": 32,
    "titulo": "O relacionamento com o cliente",
    "aulas": [
      { "titulo": "Como criar rapport e segurança desde o primeiro contato", "duracao": null },
      { "titulo": "A importância da escuta ativa e da presença terapêutica", "duracao": null },
      { "titulo": "Como estabelecer limites claros sem perder a conexão", "duracao": null },
      { "titulo": "Manejando conflitos, resistências e projeções do cliente", "duracao": null },
      { "titulo": "Boas práticas para manter um vínculo terapêutico saudável", "duracao": null }
    ]
  },
  {
    "id": 33,
    "titulo": "Normas para um atendimento excelente",
    "aulas": [
      { "titulo": "Ética profissional: postura, sigilo e responsabilidade", "duracao": null },
      { "titulo": "Organização do ambiente terapêutico: online e presencial", "duracao": null },
      { "titulo": "Pontualidade, acordos e regras de convivência terapêutica", "duracao": null },
      { "titulo": "Checklist de boas práticas antes, durante e depois da sessão", "duracao": null },
      { "titulo": "Como elevar a experiência do cliente do início ao fim", "duracao": null }
    ]
  },
  {
    "id": 34,
    "titulo": "Como identificar sinais de interesse ou desinteresse do cliente",
    "aulas": [
      { "titulo": "Sinais corporais de interesse durante uma sessão terapêutica", "duracao": null },
      { "titulo": "Sinais corporais de desinteresse ou resistência", "duracao": null },
      { "titulo": "Expressões faciais e microexpressões que revelam engajamento", "duracao": null },
      { "titulo": "Como reconduzir o cliente quando ele perde o foco", "duracao": null },
      { "titulo": "Exercício prático: leitura corporal em cenários reais", "duracao": null }
    ]
  },
  {
    "id": 35,
    "titulo": "Emoções sociais: primárias e inerentes",
    "aulas": [
      { "titulo": "A diferença entre emoções primárias e emoções sociais", "duracao": null },
      { "titulo": "Como emoções sociais moldam relacionamentos e identidade", "duracao": null },
      { "titulo": "Leitura corporal das emoções profundas versus aparentes", "duracao": null },
      { "titulo": "Como ajudar o cliente a reconhecer emoções que ele não nomeia", "duracao": null },
      { "titulo": "Exercícios para expressão e integração emocional", "duracao": null }
    ]
  },
  {
    "id": 36,
    "titulo": "Como interpretar incongruência na fala e no corpo",
    "aulas": [
      { "titulo": "O que é incongruência entre fala e corpo", "duracao": null },
      { "titulo": "Gestos, expressões e posturas que contradizem o discurso", "duracao": null },
      { "titulo": "Como identificar confusão, mentira e repressão emocional", "duracao": null },
      { "titulo": "Intervenções terapêuticas para devolver a verdade ao cliente", "duracao": null },
      { "titulo": "Treino prático: análise de vídeos e simulações", "duracao": null }
    ]
  },
  {
    "id": 37,
    "titulo": "Como utilizar a leitura corporal em ambientes profissionais",
    "aulas": [
      { "titulo": "Aplicações da leitura corporal fora do consultório", "duracao": null },
      { "titulo": "Como usar leitura corporal em empresas, escolas e equipes", "duracao": null },
      { "titulo": "Como evitar julgamentos e manter postura ética", "duracao": null },
      { "titulo": "Negociação, liderança e comunicação usando leitura corporal", "duracao": null },
      { "titulo": "Exercícios práticos para ambientes profissionais", "duracao": null }
    ]
  },
  {
    "id": 38,
    "titulo": "Atendimento individual, grupo… online ou presencial oque é melhor",
    "aulas": [
      { "titulo": "Diferenças fundamentais entre atendimento individual e em grupo", "duracao": null },
      { "titulo": "Vantagens e desafios do atendimento online", "duracao": null },
      { "titulo": "Como adaptar a leitura corporal para atendimentos online", "duracao": null },
      { "titulo": "Como conduzir grupos terapêuticos com segurança", "duracao": null },
      { "titulo": "Como escolher o melhor formato para cada cliente", "duracao": null }
    ]
  },
  {
    "id": 39,
    "titulo": "Você quer só o resultado, não quer a caminhada",
    "aulas": [
      { "titulo": "Por que tantas pessoas querem resultado sem processo", "duracao": null },
      { "titulo": "A diferença entre mudança profunda e solução imediatista", "duracao": null },
      { "titulo": "Os perigos da pressa no processo terapêutico", "duracao": null },
      { "titulo": "Como ensinar o cliente a valorizar a caminhada", "duracao": null },
      { "titulo": "Exercício guiado: integrando pequenas vitórias", "duracao": null }
    ]
  },
  {
    "id": 40,
    "titulo": "Técnicas para ajustar a linguagem corporal e a comunicação",
    "aulas": [
      { "titulo": "Como ajustar postura, tom de voz e presença terapêutica", "duracao": null },
      { "titulo": "Gestos que fortalecem a autoridade e a confiança", "duracao": null },
      { "titulo": "Como detectar e corrigir sinais de insegurança no corpo", "duracao": null },
      { "titulo": "Técnicas de comunicação terapêutica verbal e não verbal", "duracao": null },
      { "titulo": "Treino prático: comunicação clara, firme e compassiva", "duracao": null }
    ]
  },
  {
    "id": 41,
    "titulo": "Como definir o valor da sessão?",
    "aulas": [
      { "titulo": "Fatores que influenciam o preço de uma sessão terapêutica", "duracao": null },
      { "titulo": "Como precificar com ética e segurança", "duracao": null },
      { "titulo": "O impacto da insegurança na hora de cobrar", "duracao": null },
      { "titulo": "Como aumentar seu valor conforme sua prática evolui", "duracao": null },
      { "titulo": "Modelos de precificação e boas práticas do mercado terapêutico", "duracao": null }
    ]
  },
  {
    "id": 42,
    "titulo": "Oque mais devo estudar",
    "aulas": [
      { "titulo": "Áreas de aprofundamento essenciais para o terapeuta corporal", "duracao": null },
      { "titulo": "Leituras recomendadas: corpo, trauma, psique e sistema familiar", "duracao": null },
      { "titulo": "Práticas avançadas para evoluir como terapeuta", "duracao": null },
      { "titulo": "Como organizar uma rotina de estudos eficiente", "duracao": null },
      { "titulo": "O papel da supervisão, terapia pessoal e grupos de estudo", "duracao": null }
    ]
  },
  {
    "id": 43,
    "titulo": "Exercícios",
    "aulas": [
      { "titulo": "Exercícios corporais para liberação emocional", "duracao": null },
      { "titulo": "Exercícios de respiração e grounding", "duracao": null },
      { "titulo": "Exercícios sistêmicos para integração familiar", "duracao": null },
      { "titulo": "Exercícios de reprogramação emocional e mental", "duracao": null },
      { "titulo": "Exercícios de leitura corporal para prática diária", "duracao": null }
    ]
  }
];

// Process Formation Data to match Types
let lessonIdCounter = 101;
const FORMATION_MODULES: Module[] = RAW_FORMATION_DATA.map((mod: any) => ({
  id: mod.id,
  courseId: 'formation',
  title: mod.titulo,
  lessons: mod.aulas.map((aula: any, index: number) => {
    let finalDuration = aula.duracao;

    // Exception for Module 1, first 3 lessons (Boas Vindas, WhatsApp, Termo)
    // Ensure they remain null (no duration)
    if (mod.id === 1 && index < 3) {
      finalDuration = null;
    }
    // For other modules or other lessons, if duration is missing, generate random
    else if (!finalDuration) {
      finalDuration = getRandomDuration();
    }

    return {
      id: lessonIdCounter++,
      courseId: 'formation',
      moduleId: mod.id,
      title: aula.titulo,
      duration: finalDuration,
      isLocked: true, // All paid lessons locked by default
    };
  })
}));

// Combine Modules
export const ALL_MODULES = [MINICOURSE_MODULE, ...FORMATION_MODULES];

// Helper to flatten lessons for routing lookup
export const LESSONS: Lesson[] = ALL_MODULES.flatMap(m => m.lessons);

export const COURSES: Course[] = [
  {
    id: 'minicourse',
    title: 'Minicurso Terapeuta Analista Corporal',
    isFree: true,
    description: 'Introdução completa aos fundamentos da análise corporal.',
    moduleCount: 1,
    lessonCount: 4,
    status: 'Liberado',
  },
  {
    id: 'formation',
    title: 'Formação Terapeuta Analista Corporal',
    price: 'R$ 1997',
    isFree: false,
    description: 'A formação definitiva para quem deseja viver de terapia.',
    moduleCount: FORMATION_MODULES.length,
    lessonCount: FORMATION_MODULES.reduce((acc, m) => acc + m.lessons.length, 0),
    status: 'Bloqueado',
  }
];

// Content mapping
export const LESSON_CONTENT: Record<number, Partial<Record<TabOption, string>>> = {
  1: {
    [TabOption.COURSE]: `<iframe src="/aula1-minicurso.html" style="width: 100%; height: 100vh; border: none; border-radius: 12px; overflow: hidden;" title="Aula 1 - Fundamentos da Análise Corporal"></iframe>
    `,
    [TabOption.VIDEO_SUMMARY]: `
      <p class="mb-4">Um resumo dinâmico de 5 minutos cobrindo os pontos chaves da Aula 1.</p>
      <div class="bg-neutral-900 p-4 rounded border border-neutral-800">
        <span class="text-brand-red font-bold">Destaque:</span> A explicação sobre mielinização da medula espinhal aos 10 minutos.
      </div>
    `,
    [TabOption.MIND_MAP]: `
      <p>O mapa mental desta aula conecta os conceitos de Formação dos Traços com as Fases do Desenvolvimento Infantil.</p>
      <p class="text-sm text-neutral-500 mt-2">Clique no botão abaixo para baixar o PDF em alta resolução.</p>
    `,
  },
  2: {
    [TabOption.COURSE]: "Conteúdo sobre doenças psicossomáticas e a relação com os traços de caráter.",
  },
  3: {
    [TabOption.COURSE]: "Demonstração prática de análise ao vivo com voluntários.",
  },
  4: {
    [TabOption.COURSE]: "Estratégias de carreira, precificação e posicionamento de mercado.",
  }
};
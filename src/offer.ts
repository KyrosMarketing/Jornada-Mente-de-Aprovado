/** Single source of truth. Null means unconfirmed, never an invented sales condition. */
export const offer = {
  name: "Jornada Mente de Aprovado",
  brand: "Preparamente",
  price: 67,
  currency: "BRL",
  edition: "2026",
  HOTMART_CHECKOUT_URL: "https://pay.hotmart.com/G108112534E",
  accessPeriod: null as string | null,
  guarantee: null as string | null,
  paymentMethods: null as string | null,
  // The supplied reference mentions this company; ownership of the new offer is not confirmed.
  merchant: {
    legalName: null as string | null,
    cnpj: null as string | null,
    confirmed: false,
  },
  legal: {
    privacy: null as string | null,
    terms: null as string | null,
    support: null as string | null,
  },
  siteUrl: null as string | null,
  publication: { contentApproved: false, instructorProfileApproved: false },
  instructor: {
    name: "Mateus Tiujo",
    title: "Psicólogo · Criador do Preparamente",
    portrait: null as string | null,
    bio: "Mateus Tiujo é o psicólogo por trás do Preparamente. Seu trabalho conecta conhecimentos da Psicologia às dificuldades vividas por estudantes durante a preparação para vestibulares, com atenção à ansiedade, constância, organização e aspectos emocionais da aprendizagem.",
  },
  materials: [
    {
      name: "Exercícios práticos",
      description: "Para levar os aprendizados à sua rotina de estudos.",
      confirmed: true,
    },
    {
      name: "Materiais de apoio",
      description: "Conteúdos complementares para acompanhar os módulos.",
      confirmed: true,
    },
    {
      name: "Escala EAFV",
      description:
        "Autoavaliação educacional da ansiedade frente ao vestibular. Não é um diagnóstico clínico.",
      confirmed: true,
    },
    {
      name: "Workbook prático",
      description: "Atividades e reflexões guiadas.",
      confirmed: false,
    },
    {
      name: "Ebooks de apoio",
      description: "Leituras para aprofundar os aprendizados.",
      confirmed: false,
    },
    {
      name: "Diário de inteligência emocional",
      description: "",
      confirmed: false,
    },
  ],
  // Only approved, sourced, attributed testimonials belong here. Empty by design.
  testimonials: [] as {
    quote: string;
    attribution: string;
    context: string;
    source: string;
    authorized: boolean;
  }[],
};

export const modules = [
  {
    id: "01",
    title: "Gerenciamento de tempo",
    word: "ORGANIZE.",
    theme: "tempo",
    headline: "Menos tempo perdido. Mais clareza para estudar.",
    description:
      "Aprenda estratégias para organizar sua rotina, priorizar o que importa e tornar seus momentos de revisão mais direcionados.",
    benefits: [
      "Organizar a rotina e definir prioridades",
      "Planejar revisões com mais consciência",
      "Trabalhar estratégias contra a procrastinação",
    ],
  },
  {
    id: "02",
    title: "Foco e disciplina",
    word: "CONTINUE.",
    theme: "foco",
    headline: "A motivação oscila. Sua preparação pode continuar.",
    description:
      "Trabalhe estratégias para manter a constância, lidar com distrações e continuar progredindo mesmo nos dias em que a motivação parece faltar.",
    benefits: [
      "Reconhecer o que prejudica a concentração",
      "Construir uma rotina mais consistente",
      "Lidar melhor com os dias difíceis",
    ],
  },
  {
    id: "03",
    title: "Controle da ansiedade",
    word: "RESPIRE.",
    theme: "ansiedade",
    headline: "O nervosismo não precisa guiar sua prova.",
    description:
      "Conheça ferramentas de preparação psicológica e autorregulação que podem ajudar você a lidar melhor com a ansiedade, a pressão e o medo de dar branco.",
    benefits: [
      "Conhecer recursos de autorregulação",
      "Reconhecer como a pressão aparece na sua rotina",
      "EAFV: autoavaliação educacional, sem finalidade diagnóstica",
    ],
  },
  {
    id: "04",
    title: "Propósito e motivação",
    word: "RECONHEÇA.",
    theme: "proposito",
    headline: "Lembre-se por que você começou.",
    description:
      "Reconecte sua preparação aos objetivos que dão significado à carreira que você deseja construir e encontre referências para enfrentar os dias mais difíceis.",
    benefits: [
      "Refletir sobre seus objetivos pessoais",
      "Reforçar a conexão com a profissão desejada",
      "Relacionar metas a ações cotidianas",
    ],
  },
  {
    id: "05",
    title: "Fim da comparação",
    word: "CONFIE.",
    theme: "confianca",
    headline: "Seu progresso não precisa ter o ritmo dos outros.",
    description:
      "Aprenda a observar sua própria evolução com mais consciência, reduzindo o peso da comparação constante com outros estudantes.",
    benefits: [
      "Reconhecer e valorizar sua trajetória",
      "Trabalhar a autoconfiança",
      "Construir referências mais saudáveis de progresso",
    ],
  },
];

export const price = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: offer.currency,
}).format(offer.price);

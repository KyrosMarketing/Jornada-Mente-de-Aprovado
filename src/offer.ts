/** Single source of truth. Null means unconfirmed, never an invented sales condition. */
export const offer = {
  name: "Jornada Mente de Aprovado",
  brand: "Preparamente",
  price: 67,
  paymentPlan: { installments: 12, amount: 6.93 },
  currency: "BRL",
  edition: "2026",
  branding: {
    logoLight: "images/preparamente-creme.webp",
    logoDark: "images/preparamente-azul.webp",
    palette: {
      cream: "#e7e5da",
      green: "#02aa91",
      navy: "#2b347c",
      amber: "#fbaf40",
      rose: "#d91b5c",
    },
  },
  presentation: {
    youtubeId: "sIXC3d7DKdg",
    poster: "images/mateus-palestra.webp",
    context:
      "Apresentação institucional de Mateus Tiujo e do Preparamente. Este vídeo não é uma apresentação específica da Jornada Mente de Aprovado.",
  },
  // Official presentation: HTTPS media URLs for the WordPress widget.
  productPreview: {
    mp4: null as string | null,
    webm: null as string | null,
    poster: null as string | null,
  },
  HOTMART_CHECKOUT_URL: "https://pay.hotmart.com/G108112534E",
  accessPeriod: null as string | null,
  guarantee: "7 dias de garantia, conforme as condições da Hotmart." as
    | string
    | null,
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
    title: "Psicólogo · Especialista em Neuropsicologia",
    portrait: "images/mateus-retrato.webp" as string | null,
    bio: "Mateus Tiujo é psicólogo, especialista em Neuropsicologia e fundador do Preparamente. Estuda os fatores psicológicos e cognitivos ligados à alta performance acadêmica e esportiva.",
    background:
      "Integra Psicologia e Neuropsicologia para compreender como ansiedade, regulação emocional, atenção, motivação e organização influenciam a aprendizagem, a constância e o desempenho sob pressão.",
    areas: [
      "Psicologia Clínica",
      "Terapia Cognitivo-Comportamental",
      "Avaliação Psicológica",
      "Neuropsicologia",
    ],
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
  featuredTestimonial: {
    quote:
      "Quando conheci o trabalho da equipe pelo Instagram,confesso que bateu aquela dúvida natural por serem de outro estado. Mas fiz minha pesquisa, conversei com o time e decidi confiar. Hoje, após 4 semanas de acompanhamento com a minha filha, só tenho a agradecer! Que entrega incrível! A atenção, a organização e o profissionalismo de vocês têm sido fundamentais para ela construir uma rotina de estudos de verdade e se sentir incentivada todos os dias. Ter a certeza de que ela está em boas mãos, mesmo à distância, traz uma paz enorme. Parabéns pelo trabalho impecável! Obrigada! 🙏 ❤️",
    attribution: "Rosana",
    handle: "@rosana_srs",
    context: "Mãe de aluna acompanhada pelo Preparamente",
  },
  // Transcribed from the official reference supplied by the user. No source links were supplied.
  testimonials: [
    {
      quote:
        "A mentoria Preparamente está sendo essencial para o meu desempenho e saúde mental. O acompanhamento está me ajudando a encontrar o equilíbrio que eu preciso nos estudos. Os profissionais são extremamente atenciosos, disponíveis e oferecem todo o suporte necessário. Com certeza, a Preparamente me deixa cada dia mais confiante e perto da minha aprovação!",
      attribution: "Isabela C.",
      context: "Mentoria Preparamente",
      source: null,
      authorized: true,
      rating: 5,
    },
    {
      quote:
        "O Mateus é um excelente profissional, muito didático nos atendimentos e técnicas de manejo, gosto muito da sua abordagem baseada em evidências, tem me ajudado de maneira objetiva e prática.",
      attribution: "Alex G.",
      context: "Avaliação no Google",
      source: null,
      authorized: true,
      rating: 5,
    },
    {
      quote:
        "O Mateus é um excelente profissional! Ele me auxiliou/auxilia a entender meus comportamentos, refletir e a evoluir, por meio de conversas, desafios e feedbacks. Recomendo seu trabalho sem medo algum.",
      attribution: "Yan S.",
      context: "Avaliação no Google",
      source: null,
      authorized: true,
      rating: 5,
    },
    {
      quote:
        "Excelente trabalho, me ajuda a tempos com suas técnicas, mente blindada graças a você, muito obrigado Mateus.",
      attribution: "Pedro E.",
      context: "Avaliação no Google",
      source: null,
      authorized: true,
      rating: 5,
    },
    {
      quote: "Ótimos profissionais, ótimas pessoas, parabéns pelo trabalho!!",
      attribution: "Vinicius A.",
      context: "Avaliação no Google",
      source: null,
      authorized: true,
      rating: 5,
    },
  ] as {
    quote: string;
    attribution: string;
    context: string;
    source: string | null;
    authorized: boolean;
    rating: number;
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

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: offer.currency,
  }).format(value);
export const installmentPrice = money(offer.paymentPlan.amount);
export const installmentTotal = money(
  (Math.round(offer.paymentPlan.amount * 100) *
    offer.paymentPlan.installments) /
    100,
);
export const installmentLabel = `${offer.paymentPlan.installments}x de ${installmentPrice}`;
export const marqueeWords = [
  "Foco",
  "Disciplina",
  "Equilíbrio",
  "Propósito",
  "Confiança",
  "Alta performance",
  "Organização",
];

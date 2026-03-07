export const translations = {
  en: {
    hero: {
      title: "Giancarlo Larios.<br />Information Systems Engineer.",
      subtitle: "Crafting high-performance web applications, scalable architectures, and immersive digital experiences."
    },
    mode: {
      recruiter: "Recruiter",
      developer: "Developer"
    },
    gradeo: {
      title: "GRADEO",
      subtitle: "Real-time data. Frictionless evaluation.",
      caseStudyBtn: "View Technical Case Study",
      lifecycleTitle: "The Lifecycle of a Review",
      scrollIndicator: "Scroll down"
    },
    bento: {
      liveMetrics: "Live Metrics",
      totalReviews: "Total Reviews",
      listedProfessors: "Listed Professors",
      campus: "Campus USAT",
      city: "Chiclayo, Peru",
      topRated: "Top Rated Professors",
      devInsight: "Developer Insight <br/> <span class='text-xs'>(Turn on Developer Mode)</span>",
      weightedLogic: "Weighted Average Logic"
    },
    scrolly: {
      instruction: "Scroll to explore the architecture of a seamless and secure interaction. A single tap initiates a complex sequence of validations and real-time updates directly hooked to the Edge.",
      step1Title: "1. Anonymous Submission",
      step1Desc: "Users submit reviews via Next.js natively. No login walls, maximizing friction-free participation while keeping strict data formats.",
      step2Title: "2. Edge Payload Routing",
      step2Desc: "The payload is processed through Vercel's Edge network globally, skipping cold boots and ensuring extremely low latency.",
      step3Title: "3. Relational Triggers",
      step3Desc: "Supabase database triggers intercept operations to validate incoming data against the strict Universities and Professors relational schemas.",
      step4Title: "4. Data Aggregation",
      step4Desc: "Metadata such as historical score averages and review counts are recalculated dynamically on the database before fetching."
    },
    caseStudy: {
      title: "GRADEO: Architecture & Anonymity",
      desc: "Case study on building a highly scalable and normalized anonymous review system.",
      challengeTitle: "The Challenge",
      challengeText: "Academic review systems typically suffer from either restrictive access walls or unstructured, chaotic data from anonymous sources. The challenge was to maintain a frictionless, anonymous user experience while ensuring that the underlying data (Professors, Universities, Careers) was strictly normalized and trustworthy.",
      solutionTitle: "The Solution",
      solutionText: "Implemented a fully anonymous feedback system supported by a robust relational schema in Supabase. Although frontend submissions are anonymous and frictionless, every review is tied to strictly defined relational entities. Real-time Database hooks handle the complex aggregations of scores.",
      resultTitle: "The Result",
      resultText: "A highly resilient database that currently indexes <strong class='text-emerald-400'>900+ professors</strong> and handles instant aggregations effortlessly. The platform scales on Vercel's Edge network, leveraging ISR to serve professor data without fetching overhead."
    },
    devConsole: {
      monitor: "SYS.PERF.MONITOR",
      memory: "MEMORY ALOC",
      network: "NETWORK",
      loading: "Loading Developer Environment...",
      ready: "› Ready in 1205ms",
      whoamiText1: "Gian - Information Systems Engineer",
      whoamiText2: "Systems engineering student obsessed with optimization and scalable architecture."
    },
    cv: {
      sectionTitle: "Profile & Experience",
      sectionSubtitle: "A systemic view of my professional foundation and the core tools I use to build scalable solutions.",
      profile: {
        title: "Professional Profile",
        content: "Information Systems Engineering student with solid technical background, looking to contribute skills in technical support, data management, and software development. Recognized for rapid learning, problem-solving, and operational efficiency."
      },
      experience: {
        title: "Experience",
        xpande: {
          role: "IT Intern",
          company: "Corporación Xpande S.A.C.",
          date: "Oct 2023 - Mar 2024",
          bullets: [
            "Technical support and operational continuity for internal users.",
            "Infrastructure administration and network preventive maintenance.",
            "Data analysis and reporting using Advanced Excel for management decision-making."
          ]
        }
      },
      skills: {
        title: "Core Competencies",
        tech: "Technical: Java, JavaScript, HTML5, CSS (Tailwind), SQL",
        tools: "Tools: Excel (Advanced), VS Code, Git, PostgreSQL, MySQL",
        soft: "Soft Skills: Problem resolution, effective communication, adaptability"
      }
    }
  },
  es: {
    hero: {
      title: "Giancarlo Larios.<br />Ingeniero de Sistemas y Computación.",
      subtitle: "Creando aplicaciones web de alto rendimiento, arquitecturas escalables y experiencias digitales inmersivas."
    },
    mode: {
      recruiter: "Reclutador",
      developer: "Desarrollador"
    },
    gradeo: {
      title: "GRADEO",
      subtitle: "Datos en tiempo real. Evaluación sin fricción.",
      caseStudyBtn: "Ver Case Study Técnico",
      lifecycleTitle: "El Ciclo de Vida de una Reseña",
      scrollIndicator: "Desplázate hacia abajo"
    },
    bento: {
      liveMetrics: "Métricas en Vivo",
      totalReviews: "Reseñas Totales",
      listedProfessors: "Profesores Listados",
      campus: "Campus USAT",
      city: "Chiclayo, Perú",
      topRated: "Profesores Mejor Calificados",
      devInsight: "Developer Insight <br/> <span class='text-xs'>(Activa el Developer Mode)</span>",
      weightedLogic: "Lógica de Promedio Ponderado"
    },
    scrolly: {
      instruction: "Haz scroll para explorar la arquitectura de una interacción fluida y segura. Un solo toque inicia una secuencia de validaciones y actualizaciones en tiempo real conectadas directamente al Edge.",
      step1Title: "1. Envío Anónimo",
      step1Desc: "Los usuarios envían la reseña de manera nativa en Next.js. Sin inicios de sesión, eliminando fricciones pero exigiendo formato estricto de datos.",
      step2Title: "2. Redirección en el Edge",
      step2Desc: "La carga de datos viaja globalmente a través de la red Vercel Edge, acortando tiempos de latencia drásticamente.",
      step3Title: "3. Triggers Relacionales",
      step3Desc: "La base de datos en Supabase utiliza triggers automáticos que validan la operación contra los esquemas relacionales de profesores y universidades.",
      step4Title: "4. Agregación de Datos",
      step4Desc: "El puntaje total y los promedios son re-calculados en tiempo real mediante funciones del lado de la base de datos, siempre seguros."
    },
    caseStudy: {
      title: "GRADEO: Arquitectura y Anonimato",
      desc: "Caso de estudio sobre la construcción de un sistema de reseñas anónimo, escalable y normalizado.",
      challengeTitle: "El Desafío",
      challengeText: "Los sistemas de reseñas académicas suelen sufrir de muros de acceso restrictivos o, por el contrario, de datos caóticos y no estructurados provenientes de fuentes anónimas. El reto era mantener una experiencia de usuario anónima y sin fricciones, asegurando al mismo tiempo que los datos subyacentes (Profesores, Universidades) estuvieran estrictamente normalizados.",
      solutionTitle: "La Solución",
      solutionText: "Se implementó un sistema de feedback totalmente anónimo respaldado por un sólido esquema relacional en Supabase. Aunque los envíos en el front-end son anónimos, cada reseña está vinculada a entidades relacionales estrictamente definidas. Triggers en tiempo real manejan las complejas agregaciones de puntajes.",
      resultTitle: "El Resultado",
      resultText: "Una base de datos altamente resiliente que actualmente indexa a <strong class='text-emerald-400'>más de 900 profesores</strong> y maneja agregaciones instantáneas sin esfuerzo. La plataforma escala en la red Edge de Vercel, aprovechando ISR para servir datos sin sobrecarga."
    },
    devConsole: {
      monitor: "SIS.MONITOR.PERF",
      memory: "USO DE MEMORIA",
      network: "RED",
      loading: "Cargando Entorno de Desarrollo...",
      ready: "› Listo en 1205ms",
      whoamiText1: "Gian - Ingeniero de Sistemas de Información",
      whoamiText2: "Estudiante de ingeniería de sistemas obsesionado con la optimización y la arquitectura escalable."
    },
    cv: {
      sectionTitle: "Perfil y Experiencia",
      sectionSubtitle: "Una visión sistémica de mi base profesional y las herramientas centrales que utilizo para construir soluciones escalables.",
      profile: {
        title: "Perfil Profesional",
        content: "Estudiante de Ingeniería de Sistemas de Información con sólida formación técnica, interesado en aportar habilidades en soporte técnico, gestión de datos y desarrollo de software. Reconocido por una capacidad de aprendizaje rápido, resolución de problemas y eficiencia operativa."
      },
      experience: {
        title: "Experiencia",
        xpande: {
          role: "Practicante Pre Profesional de TI",
          company: "Corporación Xpande S.A.C.",
          date: "Oct 2023 - Mar 2024",
          bullets: [
            "Soporte técnico y diagnóstico de incidencias de hardware/software para usuarios internos.",
            "Colaboración en administración de servidores y mantenimiento preventivo de la red.",
            "Recolección y procesamiento de datos comerciales mediante Excel Avanzado para reportes gerenciales."
          ]
        }
      },
      skills: {
        title: "Competencias",
        tech: "Técnicas: Java, JavaScript, HTML5, CSS (Tailwind), SQL",
        tools: "Herramientas: Excel (Avanzado), VS Code, Git, PostgreSQL, MySQL",
        soft: "Habilidades Blandas: Resolución de problemas, comunicación efectiva, adaptabilidad"
      }
    }
  }
}

export type Language = keyof typeof translations
export type TranslationDict = typeof translations.en

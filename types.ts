export interface Lesson {
  id: number;
  courseId: string;
  moduleId: number;
  title: string;
  releaseDate?: string; // Optional for paid course (always locked or unlocked by purchase)
  duration: string | null;
  isLocked: boolean;
}

export interface Module {
  id: number;
  courseId: string;
  title: string;
  lessons: Lesson[];
}

export enum TabOption {
  COURSE = 'Curso',
  VIDEO_SUMMARY = 'Resumo em Vídeo',
  AUDIO_SUMMARY = 'Resumo em Áudio',
  MIND_MAP = 'Mapa Mental',
  FLASHCARDS = 'Cartões Didáticos',
  INFOGRAPHIC = 'Infográfico',
  REPORT = 'Relatório',
  QUIZ = 'Teste',
  SLIDES = 'Slides',
}

export interface Course {
  id: string;
  title: string;
  price?: string;
  isFree: boolean;
  description: string;
  moduleCount: number;
  lessonCount: number;
  status: 'Liberado' | 'Bloqueado';
}

// --- Dynamic Content Types ---

export interface BadgeConfig {
  label: string;
  icon: string;
  color: string;
  threshold: number;
}

export interface GamificationConfig {
  pointsPerSection: number;
  badges: Record<string, BadgeConfig>;
}

export interface LessonMetadata {
  title: string;
  subtitle: string;
  totalSections: number;
  gamification: GamificationConfig;
}

export interface HeaderInfo {
  progressLabel: string;
  certificateInfo: {
    title: string;
    text: string;
  };
}

export interface ContentItem {
  label: string;
  icon: string;
  target: string;
  tab?: string;
}

export interface MultimediaItem {
  id: string;
  type: 'audio' | 'video';
  title: string;
  subtitle: string;
  url: string;
  buttonText: string;
}

export interface CardContent {
  id: string;
  type: 'card' | 'highlight_card' | 'trait_card' | 'alert_card';
  title?: string; // Optional because trait_card uses 'name'
  name?: string;
  subtitle?: string;
  text?: string;
  buttonText?: string;
  style?: string;
  // Trait card specific
  archetype?: string;
  icon?: string;
  color?: string;
  body?: string;
  pain?: string;
  power?: string;
  story?: string;
  deal?: string;
  // Alert card specific
  list?: string[];
  highlightBox?: string;
}

export interface TabData {
  id: string;
  label: string;
  content: CardContent[];
}

export interface ExerciseContent {
  id: string;
  title: string;
  instructions: string[];
  placeholder: string;
  buttonText: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Section {
  id: string;
  type: 'intro' | 'navigation' | 'multimedia' | 'tabs' | 'exercise' | 'quiz' | 'footer';
  title?: string;
  subtitle?: string;
  content?: string[] | ExerciseContent; // Can be array of strings (intro) or object (exercise)
  items?: ContentItem[] | MultimediaItem[];
  tabs?: TabData[];
  questions?: QuizQuestion[];
}

export interface LessonContent {
  metadata: LessonMetadata;
  header: HeaderInfo;
  sections: Section[];
}
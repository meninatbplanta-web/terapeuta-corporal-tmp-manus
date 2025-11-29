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

export interface StyleHints {
  [key: string]: any;
}

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
  iconColor?: string; // Added for new schema
}

export interface MultimediaItem {
  id: string;
  type: 'audio' | 'video' | 'media_player_card'; // Added media_player_card
  mediaType?: 'audio' | 'video'; // Added for new schema
  title: string;
  subtitle: string;
  url: string;
  buttonText: string;
  buttonStyle?: string; // Added for new schema
}

export interface CardContent {
  id: string;
  type: 'card' | 'highlight_card' | 'trait_card' | 'alert_card' | 'info_card' | 'highlight_box' | 'profile_card' | 'exercise_card' | 'quiz_card'; // Added new types
  title?: string;
  name?: string;
  subtitle?: string;
  text?: string;
  buttonText?: string;
  buttonStyle?: string; // Added for new schema
  style?: string;
  style_hints?: StyleHints; // Added for new schema
  // Trait/Profile card specific
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
  highlightBox?: string | { text: string; style: StyleHints }; // Updated to support object
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
  buttonStyle?: string; // Added for new schema
  type?: string; // Added for new schema
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Section {
  id: string;
  type: 'intro' | 'navigation' | 'multimedia' | 'tabs' | 'exercise' | 'quiz' | 'footer' | 'text_block' | 'navigation_grid' | 'expandable_section' | 'simple_footer';
  title?: string;
  subtitle?: string;
  content?: string[] | ExerciseContent | CardContent[] | any; // Can be array of strings, object, or array of cards
  items?: ContentItem[] | MultimediaItem[] | any[];
  tabs?: TabData[];
  questions?: QuizQuestion[];
  style_hints?: StyleHints;
  links?: { label: string; url: string; }[]; // For simple_footer
  copyright?: string; // For simple_footer
}

export interface LessonContent {
  metadata?: LessonMetadata; // Made optional
  header?: HeaderInfo; // Made optional
  sections: Section[];
}

export interface PageSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
  layout: string;
  seo: {
    title: string;
    description: string;
  };
}

export interface HeaderBar {
  style_hints?: StyleHints;
  logo: {
    image_url: string;
    alt_text: string;
  };
  badge: {
    text: string;
    style: StyleHints;
  };
}

export interface VideoPlayerHero {
  style_hints?: StyleHints;
  lesson_title: string;
  status_label: string;
  thumbnail_url: string;
  locked_message: {
    icon: string;
    title: string;
    text: string;
    style: StyleHints;
  };
}

export interface GamificationBar {
  style_hints?: StyleHints;
  label: string;
  progress_percentage: number;
  badges: {
    id: string;
    label: string;
    icon: string;
    status: string;
    activeColor: string;
  }[];
}

export interface PageStructure {
  banner?: {
    image_url: string;
    alt_text: string;
  };
  header_info?: {
    badge: {
      text: string;
      color: string;
    };
    title: string;
  };
  lesson_list?: {
    title: string;
    lessons: any[];
  };
  video_player?: {
    placeholder_text: string;
    locked_message: {
      title: string;
      text: string;
    };
  };
  // New fields
  header_bar?: HeaderBar;
  video_player_hero?: VideoPlayerHero;
  gamification_bar?: GamificationBar;
}

export interface FullLessonData {
  page_settings?: PageSettings;
  page_structure: PageStructure;
  lesson_content: LessonContent;
}
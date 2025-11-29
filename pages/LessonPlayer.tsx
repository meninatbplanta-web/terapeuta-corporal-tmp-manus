import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Lock, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, FileText, Video, Mic, BrainCircuit, Layers, BarChart3, FileBarChart, Presentation, HelpCircle, Hourglass } from 'lucide-react';
import Header from '../components/Header';
import CoursePageContent from '../components/CoursePageContent';
import LoginModal from '../components/LoginModal';
import { isLessonAvailable, formatReleaseDate } from '../constants';
import { LESSONS, LESSON_CONTENT, ALL_MODULES, COURSES } from '../data/lessons';
import { TabOption, LessonContent, FullLessonData } from '../types';
import DynamicLessonContent from '../components/DynamicLessonContent';
import novoJson from '../data/novo.json';
import novo2Json from '../data/novo2.json';
import novo3Json from '../data/novo3.json';

const LessonPlayer: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabOption>(TabOption.COURSE);
  const [showLockedModal, setShowLockedModal] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Sidebar state: which module is expanded?
  // Initialize with the module containing the current lesson
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);

  const currentLessonId = Number(lessonId);
  const currentLesson = LESSONS.find(l => l.id === currentLessonId);
  const currentCourse = COURSES.find(c => c.id === currentLesson?.courseId);

  // Map lessons to their JSON data
  const lessonDataMap: Record<number, FullLessonData> = {
    1: novoJson as unknown as FullLessonData,
    2: novoJson as unknown as FullLessonData,
    3: novo2Json as unknown as FullLessonData,
    4: novo3Json as unknown as FullLessonData,
  };

  const currentJson = lessonDataMap[currentLessonId];

  // Validation: if lesson doesn't exist
  useEffect(() => {
    if (!currentLesson) {
      navigate('/');
    } else {
      // Automatically expand the module of the current lesson if not already expanded
      setExpandedModuleId((prev) => prev === null ? currentLesson.moduleId : prev);
    }
  }, [currentLesson, navigate]);

  if (!currentLesson) return null;

  const isUnlocked = currentLesson.courseId === 'minicourse'
    ? isLessonAvailable(currentLesson)
    : false; // Paid course is always locked in preview mode

  // Special rule: Lesson 1 contents always unlocked for minicourse. Paid course always locked.
  const isContentUnlocked = currentLesson.courseId === 'minicourse' && (currentLesson.id === 1 || isUnlocked);

  // Get next/prev lessons specifically within the context of the entire flat list
  const nextLesson = LESSONS.find(l => l.id === currentLessonId + 1 && l.courseId === currentLesson.courseId);
  const prevLesson = LESSONS.find(l => l.id === currentLessonId - 1 && l.courseId === currentLesson.courseId);

  // Get modules for the current course only
  const courseModules = ALL_MODULES.filter(m => m.courseId === currentLesson.courseId);

  const handleLessonChange = (id: number) => {
    const targetLesson = LESSONS.find(l => l.id === id);
    if (!targetLesson) return;

    // Allow navigation to locked lessons to '''see''' them, but lock content.
    // Except for minicourse future lessons which are date-locked.
    if (targetLesson.courseId === 'minicourse' && !isLessonAvailable(targetLesson)) {
      setShowLockedModal(formatReleaseDate(targetLesson.releaseDate || ''));
      return;
    }

    // PAYWALL LOGIC: Intercept clicks for Formation course
    if (targetLesson.courseId === 'formation') {
      setShowLoginModal(true);
      return;
    }

    navigate(`/aula/${id}`);
    // No window.scrollTo(0,0) needed here as the content div scrolls independently, 
    // but we can scroll the main content div if we had a ref. 
    // For now, let's rely on user scroll or reset if we add a ref later.
  };

  const toggleModule = (modId: number) => {
    setExpandedModuleId(expandedModuleId === modId ? null : modId);
  };

  const getDynamicContent = () => {
    const lessonContent = LESSON_CONTENT[currentLesson.id];
    if (lessonContent && lessonContent[activeTab]) {
      return lessonContent[activeTab];
    }
    return `
      <p>Conteúdo para <strong>${activeTab}</strong> da aula <strong>${currentLesson.title}</strong> será adicionado em breve.</p>
      <br/>
      <p class="text-sm text-neutral-500">Aguarde a atualização do material didático.</p>
    `;
  };

  const renderTabContent = () => {
    if (!isContentUnlocked) {
      return (
        <div className="h-64 w-full flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-neutral-800 rounded-lg bg-gray-50 dark:bg-neutral-950/50">
          <Lock className="text-gray-400 dark:text-neutral-600 mb-4" size={48} />
          <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-2">Conteúdo Bloqueado</h3>
          <p className="text-gray-500 dark:text-neutral-500">
            {currentLesson.courseId === 'minicourse'
              ? `A aula estará disponível em ${formatReleaseDate(currentLesson.releaseDate || '')}.`
              : 'Faça o login ou adquira a formação para acessar este conteúdo.'}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-brand-black border border-gray-200 dark:border-neutral-900 p-8 rounded-lg min-h-[300px] animate-fade-in transition-colors duration-300">
        <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
          {getTabIcon(activeTab)}
          {activeTab}
        </h3>

        <div
          className="text-gray-700 dark:text-neutral-300 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: getDynamicContent() || '' }}
        />
      </div>
    );
  };

  const getTabIcon = (tab: TabOption) => {
    switch (tab) {
      case TabOption.COURSE: return <FileText size={18} />;
      case TabOption.VIDEO_SUMMARY: return <Video size={18} />;
      case TabOption.AUDIO_SUMMARY: return <Mic size={18} />;
      case TabOption.MIND_MAP: return <BrainCircuit size={18} />;
      case TabOption.FLASHCARDS: return <Layers size={18} />;
      case TabOption.INFOGRAPHIC: return <BarChart3 size={18} />;
      case TabOption.REPORT: return <FileBarChart size={18} />;
      case TabOption.QUIZ: return <HelpCircle size={18} />;
      case TabOption.SLIDES: return <Presentation size={18} />;
      default: return <FileText size={18} />;
    }
  };

  const renderVideoSection = () => (
    <div id="video-section" className="w-full aspect-video bg-black rounded-xl border border-gray-200 dark:border-neutral-800 mb-8 relative overflow-hidden shadow-2xl">
      {isContentUnlocked ? (
        <div className="absolute inset-0 bg-black group cursor-pointer transition-colors duration-300">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/zLz7AYdBoGU"
            title="Vídeo Demonstrativo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>

          {/* Premiere Mask */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 pointer-events-none">
            <div className="text-center">
              <h3 className="text-2xl font-heading font-bold text-white mb-2">ESTREIA</h3>
              <p className="text-xl text-brand-red font-bold">DIA 01/12 às 20hs</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-neutral-950 text-center p-6 transition-colors duration-300">
          <Lock size={48} className="text-gray-400 dark:text-neutral-700 mb-4" />
          <h3 className="text-xl font-heading font-bold text-gray-700 dark:text-neutral-300 mb-2">
            {currentJson?.page_structure?.video_player?.locked_message?.title || "Aula Bloqueada"}
          </h3>
          <p className="text-gray-500 dark:text-neutral-500 max-w-md mx-auto">
            {currentLesson.courseId === 'minicourse'
              ? <span>
                {currentJson?.page_structure?.video_player?.locked_message?.text ||
                  <>A aula estará disponível em <span className="text-brand-red">{formatReleaseDate(currentLesson.releaseDate || '')}</span>.</>
                }
              </span>
              : <span>Conteúdo exclusivo para alunos matriculados na formação.</span>
            }
          </p>
        </div>
      )}
    </div>
  );

  // --- MINICURSO LAYOUT ---
  if (currentLesson.courseId === 'minicourse') {
    return (
      <div className="bg-gray-50 dark:bg-brand-darker text-gray-900 dark:text-white flex flex-col min-h-screen transition-colors duration-300">
        <Header />
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <main className="container mx-auto px-4 md:px-6 py-6 md:py-12 max-w-4xl transition-all duration-300">

            {/* Banner Image */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg mb-8 group">
              <img
                src={currentJson?.page_structure?.banner?.image_url || "https://priscilla-moreira.com/imagens/minicurso-banner1.jpg"}
                alt={currentJson?.page_structure?.banner?.alt_text || "Banner do Curso"}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Header Info */}
            <div className="mb-8 md:mb-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-4 bg-gray-100 dark:bg-neutral-800/80 px-4 py-1.5 rounded-full border border-gray-200 dark:border-neutral-700 backdrop-blur-sm">
                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse ${currentJson?.page_structure?.header_info?.badge?.color === 'green' ? 'bg-green-500' : 'bg-green-500'}`}></div>
                <span className="text-[10px] md:text-xs font-bold text-gray-600 dark:text-neutral-300 uppercase tracking-widest">
                  {currentJson?.page_structure?.header_info?.badge?.text || "MINICURSO GRATUITO"}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white leading-tight mb-2">
                {currentJson?.page_structure?.header_info?.title || currentCourse?.title}
              </h1>
              <p className="text-sm md:text-base text-gray-500 dark:text-neutral-400 max-w-2xl mx-auto md:mx-0">
                Domine a leitura corporal e transforme sua percepção sobre as pessoas.
              </p>
            </div>

            {/* Inline Lesson List */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                  {currentJson?.page_structure?.lesson_list?.title || "CONTEÚDO DO MINICURSO"}
                </h3>
                <span className="text-xs text-gray-400 dark:text-neutral-500">{courseModules[0]?.lessons.length} Aulas</span>
              </div>

              <div className="flex flex-col gap-4">
                {courseModules[0]?.lessons.map((lesson, index) => {
                  const isActive = lesson.id === currentLessonId;
                  const isLocked = !isLessonAvailable(lesson);
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonChange(lesson.id)}
                      className={`relative overflow-hidden flex items-center gap-4 p-4 rounded-xl cursor-pointer group transition-all duration-300 border 
                        ${isActive
                          ? 'bg-white dark:bg-neutral-900 border-brand-red/30 shadow-md transform scale-[1.02]'
                          : 'bg-white/50 dark:bg-neutral-900/30 border-transparent hover:bg-white dark:hover:bg-neutral-900 hover:shadow-sm hover:border-gray-200 dark:hover:border-neutral-800'
                        }`}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red"></div>}

                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors
                        ${isActive ? 'bg-brand-red/10 text-brand-red' : 'bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 group-hover:text-gray-600 dark:group-hover:text-neutral-300'}`}>
                        {isActive ? <Play size={20} fill="currentColor" /> : (isLocked ? <Lock size={18} /> : <Play size={18} />)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-brand-red' : 'text-gray-400 dark:text-neutral-500'}`}>
                            Aula {index + 1}
                          </span>
                          {isActive && <span className="text-[10px] bg-brand-red text-white px-1.5 py-0.5 rounded-full">Tocando agora</span>}
                        </div>
                        <h4 className={`font-heading font-bold text-base md:text-lg leading-tight truncate transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-neutral-300'}`}>
                          {lesson.title}
                        </h4>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-mono text-gray-400 dark:text-neutral-600 bg-gray-50 dark:bg-neutral-950 px-2 py-1 rounded">
                          {lesson.releaseDate ? (() => {
                            const date = new Date(lesson.releaseDate);
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const hours = date.getHours().toString().padStart(2, '0');
                            return `${day}/${month} • ${hours}h`;
                          })() : (lesson.duration || '60:00')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-brand-black border border-gray-200 dark:border-neutral-900 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">

              <div className="p-6 md:p-10">
                <div className="mb-8 border-b border-gray-100 dark:border-neutral-800 pb-6">
                  <h1 className="text-2xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {currentJson?.lesson_content?.metadata?.title || `Aula ${currentLessonId}: ${currentLesson.title}`}
                  </h1>
                  <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400">
                    {currentJson?.lesson_content?.metadata?.subtitle || "O Mapa da Mente Humana"}
                  </p>
                </div>

                {/* Welcome Box - Only show if not dynamic content, OR if dynamic content doesn't handle it? 
                    Actually DynamicLessonContent handles the 'intro' section.
                    But the hardcoded version has a 'Welcome Box'.
                    If we use DynamicLessonContent, we might not need this hardcoded Welcome Box.
                    However, for Lesson 1, it's hardcoded.
                    For Lesson 2, 3, 4, DynamicLessonContent renders 'intro'.
                    So we should ONLY render this Welcome Box for Lesson 1 (or if no dynamic content).
                */}
                {currentLessonId === 1 && (
                  <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-lg mb-8 border-l-4 border-brand-red relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <BrainCircuit size={120} />
                    </div>
                    <div className="relative z-10">
                      <h2 className="text-xl md:text-2xl font-bold mb-4 leading-snug">Bem-vindo ao mundo que ninguém te contou que existia.</h2>
                      <div className="space-y-4 text-gray-100/90 text-sm md:text-base leading-relaxed">
                        <p>
                          Você está prestes a receber a <strong className="text-brand-red bg-white/10 px-1 rounded">Chave Mestra</strong> da mente humana. Uma habilidade que mudará para sempre a forma como você enxerga as pessoas.
                        </p>
                        <p>
                          Imagine olhar para qualquer um e — sem que seja dita uma única palavra — saber exatamente como aquela pessoa pensa, sente e age. O <strong>Raio-X Invisível</strong> não é apenas teoria; é o poder de ler a mente através do corpo.
                        </p>
                        <p className="font-bold text-white pt-2 border-t border-white/10">
                          Prepare-se: depois dessa aula, você nunca mais conseguirá "desver" a verdade.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Premiere Notice - Hardcoded for now, or could come from JSON */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-brand-red font-bold mb-8 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20 text-center md:text-left animate-pulse-slow">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <Lock size={20} />
                  </div>
                  <span className="text-sm md:text-base">ESTREIA EXCLUSIVA: 01/12 às 20h — A aula com Priscilla Moreira será liberada aqui neste horário. Agende-se.</span>
                </div>

                {renderVideoSection()}

                {/* CTA Below Video - Only for Lesson 1? */}
                {currentLessonId === 1 && (
                  <div className="mb-10 p-6 md:p-8 bg-slate-50 dark:bg-neutral-900/30 rounded-2xl border border-slate-200 dark:border-neutral-800 text-center md:text-left">
                    <h3 className="font-heading font-bold text-xl md:text-2xl text-slate-900 dark:text-white mb-3">
                      Não espere: Comece a usar a Chave Mestra agora.
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                      Enquanto a estreia não acontece, você tem acesso antecipado aos nossos arquivos confidenciais. Acesse o <strong>Resumo da Aula</strong> e estude os <strong>Traços de Caráter</strong> nos botões abaixo para chegar na aula com vantagem total.
                    </p>
                  </div>
                )}

                {/* Conteúdo da Aula 1 - Inserido do repositório analise-corporal-page */}
                {currentLessonId === 1 && <CoursePageContent />}
                {currentLessonId === 2 && <DynamicLessonContent data={novoJson.lesson_content as unknown as LessonContent} />}
                {currentLessonId === 3 && <DynamicLessonContent data={novo2Json.lesson_content as unknown as LessonContent} />}
                {currentLessonId === 4 && <DynamicLessonContent data={novo3Json.lesson_content as unknown as LessonContent} />}

                {isContentUnlocked && currentLessonId !== 1 && currentLessonId !== 2 && currentLessonId !== 3 && currentLessonId !== 4 && (
                  <div>
                    {/* Simplified Tabs for Minicurso */}
                    <div className="mb-8 overflow-x-auto scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                      <div className="flex gap-3 min-w-max pb-2">
                        {Object.values(TabOption).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 
                                          ${activeTab === tab
                                ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20 transform scale-105'
                                : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 border border-transparent hover:bg-gray-200 dark:hover:bg-neutral-700'}
                                      `}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>
                    {renderTabContent()}
                  </div>
                )}
              </div>
            </div>

          </main>
        </div>

        {/* Locked Modal */}
        {showLockedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-brand-black border border-gray-200 dark:border-neutral-800 p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
              <Hourglass className="mx-auto text-orange-500 mb-4" size={40} />
              <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">Segura a ansiedade! 🧡</h3>
              <p className="text-gray-500 dark:text-neutral-400 mb-6">
                Estamos preparando tudo com carinho. Esta aula estreia <br />
                <span className="text-orange-500 font-bold text-lg">{showLockedModal}</span>.
              </p>
              <button
                onClick={() => setShowLockedModal(null)}
                className="bg-gray-100 dark:bg-white text-gray-900 dark:text-black hover:bg-gray-200 dark:hover:bg-neutral-200 font-bold py-3 px-8 rounded uppercase tracking-wide transition-colors"
              >
                Combinado
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- DEFAULT FORMATION LAYOUT ---
  return (
    <div className="h-screen bg-gray-50 dark:bg-brand-darker text-gray-900 dark:text-white flex flex-col overflow-hidden transition-colors duration-300">
      <Header />



      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full overflow-hidden">

        {/* Sidebar */}
        <aside className="w-full lg:w-96 border-r border-gray-200 dark:border-neutral-900 bg-white dark:bg-brand-black flex-shrink-0 flex flex-col h-full overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-900 shrink-0">
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-neutral-500">
              {currentLesson.courseId === 'minicourse' ? 'Conteúdo do Minicurso' : 'Módulos da Formação'}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {courseModules.map((module) => {
              const isExpanded = expandedModuleId === module.id;

              return (
                <div key={module.id} className="border-b border-gray-100 dark:border-neutral-900/50 transition-colors">
                  {/* Module Header */}
                  {currentLesson.courseId === 'formation' ? (
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors duration-200"
                    >
                      <div>
                        <p className="text-xs font-mono text-gray-400 dark:text-neutral-600 mb-1">Módulo {module.id}</p>
                        <h3 className="font-heading font-bold text-gray-900 dark:text-white">{module.title}</h3>
                      </div>
                      <ChevronDown
                        className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        size={20}
                      />
                    </button>
                  ) : (
                    <div className="p-6">
                      <h3 className="font-heading font-bold text-gray-900 dark:text-white">{module.title}</h3>
                    </div>
                  )}

                  {/* Lessons List */}
                  {isExpanded && (
                    <div className="bg-gray-50/50 dark:bg-black/20 transition-all duration-500 ease-in-out overflow-hidden">
                      {module.lessons.map((lesson) => {
                        const isActive = lesson.id === currentLessonId;
                        const isLocked = !isLessonAvailable(lesson);

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => handleLessonChange(lesson.id)}
                            className={`flex items-center gap-4 p-4 pl-8 border-l-4 transition-colors duration-200 cursor-pointer 
                                          ${isActive
                                ? 'border-brand-red bg-red-50 dark:bg-red-900/10'
                                : isLocked
                                  ? 'border-transparent text-gray-400 dark:text-neutral-700'
                                  : 'border-transparent hover:bg-gray-100 dark:hover:bg-neutral-900/70'
                              }`}
                          >
                            <div className={`flex-shrink-0 ${isActive ? 'text-brand-red' : 'text-gray-400 dark:text-neutral-600'}`}>
                              {isActive ? <Play size={16} fill="currentColor" /> : (isLocked ? <Lock size={16} /> : <Play size={16} />)}
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-semibold text-sm leading-tight ${isActive ? 'text-gray-900 dark:text-white' : (isLocked ? '' : 'text-gray-700 dark:text-neutral-300')}`}>
                                {lesson.title}
                              </h4>
                            </div>
                            <span className="text-xs font-mono text-gray-400 dark:text-neutral-600">{lesson.duration || '60:00'}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-900 flex justify-between items-center shrink-0">
            <div>
              {currentLesson.courseId === 'formation' && (
                <span className="text-xs font-mono text-gray-400 dark:text-neutral-600 mb-1 block">
                  Módulo {currentLesson.moduleId} • Aula {currentLesson.id - 100}
                  {/* Note: ID math is a rough display approximation, real app would use array index */}
                </span>
              )}
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">{currentLesson.title}</h2>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => prevLesson && handleLessonChange(prevLesson.id)}
                disabled={!prevLesson}
                className="p-3 rounded-full bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => nextLesson && handleLessonChange(nextLesson.id)}
                disabled={!nextLesson}
                className="p-3 rounded-full bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {renderTabContent()}
          </div>
        </main>
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default LessonPlayer;

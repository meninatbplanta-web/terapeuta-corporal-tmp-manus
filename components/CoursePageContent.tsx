import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CheckCircle2, Trophy, Heart, Brain, Shield, Star, Zap, BookOpen, PlayCircle, Headphones, FileText, AlertTriangle, Video } from "lucide-react";
import { MINICOURSE_MODULE } from "../data/lessons";

interface CompletedSection {
  [key: string]: boolean;
}

const CoursePageContent: React.FC = () => {
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const [completedSections, setCompletedSections] = useState<CompletedSection>(() => {
    const saved = localStorage.getItem('lms_completedSections');
    return saved ? JSON.parse(saved) : {};
  });
  const [userPoints, setUserPoints] = useState(() => {
    const saved = localStorage.getItem('lms_userPoints');
    return saved ? Number(saved) : 0;
  });
  const [badges, setBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('lms_badges');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('fundamentos');
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('lms_completedSections', JSON.stringify(completedSections));
    localStorage.setItem('lms_userPoints', userPoints.toString());
    localStorage.setItem('lms_badges', JSON.stringify(badges));
  }, [completedSections, userPoints, badges]);

  // Mapeamento das atividades por aba para controle de navegação
  const activityMap: Record<string, string[]> = {
    intro: ["audio_summary", "video_summary"],
    fundamentos: ["fundamentos_1"],
    tracos_carater: ["esquizoide", "oral", "psicopata", "masoquista", "rigido"],
    alerta_saude: ["alerta_saude_content"],
    exercicios: ["ex_analise"],
  };

  const totalSections = 11; // Total de itens pontuáveis
  const completedCount = Object.values(completedSections).filter(Boolean).length;
  const progressPercentage = (completedCount / totalSections) * 100;

  const toggleSection = (sectionId: string) => {
    setCompletedSections((prev) => {
      const newState = { ...prev, [sectionId]: !prev[sectionId] };
      if (!prev[sectionId]) {
        setUserPoints((p) => p + 50);
        checkBadges(newState);
      } else {
        setUserPoints((p) => Math.max(0, p - 50));
      }
      return newState;
    });
  };

  const tabOrder = ['intro', 'fundamentos', 'tracos_carater', 'alerta_saude'];

  const handleGoToNext = (currentId: string, tabId: string) => {
    const tabActivities = activityMap[tabId];
    if (!tabActivities) return;

    const currentIndex = tabActivities.findIndex(id => id === currentId);
    const nextIndex = currentIndex + 1;

    if (nextIndex < tabActivities.length) {
      const nextId = tabActivities[nextIndex];
      const nextCard = cardRefs.current[nextId];
      if (nextCard) {
        nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        nextCard.classList.add('highlight-card');
        setTimeout(() => nextCard.classList.remove('highlight-card'), 1500);
      }
    } else {
      const currentTabIndex = tabOrder.findIndex(tab => tab === tabId);
      if (currentTabIndex !== -1 && currentTabIndex < tabOrder.length - 1) {
        const nextTab = tabOrder[currentTabIndex + 1];
        // Only switch tab if it's a real tab (not intro)
        if (nextTab !== 'intro') {
          setActiveTab(nextTab);
        }

        setTimeout(() => {
          if (tabsRef.current && nextTab !== 'intro') {
            tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          const firstActivityId = activityMap[nextTab]?.[0];
          if (firstActivityId) {
            const firstCard = cardRefs.current[firstActivityId];
            if (firstCard) {
              // If moving from intro to fundamentals, scroll to the card specifically
              if (tabId === 'intro') {
                firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
              firstCard.classList.add('highlight-card');
              setTimeout(() => firstCard.classList.remove('highlight-card'), 1500);
            }
          }
        }, 300);
      } else if (tabId === 'alerta_saude') {
        const exercisesSection = document.getElementById('exercises-section');
        if (exercisesSection) {
          exercisesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const checkBadges = (sections: CompletedSection) => {
    const newBadges = [...badges];
    const completedCount = Object.values(sections).filter(Boolean).length;

    if (completedCount >= 3 && !newBadges.includes("iniciante")) newBadges.push("iniciante");
    if (completedCount >= 6 && !newBadges.includes("explorador")) newBadges.push("explorador");
    if (completedCount === totalSections && !newBadges.includes("mestre")) newBadges.push("mestre");

    setBadges(newBadges);
  };

  const badgeConfig = {
    iniciante: { icon: "🌱", label: "Iniciante", color: "bg-green-100 text-green-800" },
    explorador: { icon: "🔍", label: "Explorador", color: "bg-blue-100 text-blue-800" },
    mestre: { icon: "👑", label: "Mestre", color: "bg-purple-100 text-purple-800" },
  };

  const GamificationStatus = () => (
    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-neutral-800/50 p-2 rounded border border-slate-100 dark:border-neutral-800">
      <div className="flex items-center gap-1.5">
        <Trophy className="w-3.5 h-3.5 text-amber-500" />
        <span className="font-semibold text-slate-700 dark:text-slate-300">{userPoints} pontos</span>
      </div>
      <span> | {completedCount} de {totalSections} lições</span>
    </div>
  );

  const handleQuizSubmit = () => {
    const correctAnswers = { 1: "Masoquista", 2: "Psicopata", 3: "Oral" };
    let score = 0;
    Object.keys(correctAnswers).forEach((key) => {
      if (quizAnswers[Number(key)] === correctAnswers[Number(key) as keyof typeof correctAnswers]) {
        score++;
      }
    });
    setQuizResult(`Você acertou ${score} de 3 questões!`);
  };

  return (
    <div className="space-y-12 mt-12">
      {/* Header Info */}
      <div className="border-b border-gray-200 dark:border-neutral-900 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Aula 1: O Raio-X Invisível</h2>
            <p className="text-slate-500 dark:text-slate-400">O Mapa da Mente Humana</p>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">{userPoints}</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">pontos</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progresso do Minicurso</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">{completedCount} de {totalSections} lições</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <div className="flex gap-2 mt-4">
          {badges.map((badge) => (
            <div key={badge} className={`px-3 py-1 rounded-full text-sm font-medium ${badgeConfig[badge as keyof typeof badgeConfig].color}`}>
              {badgeConfig[badge as keyof typeof badgeConfig].icon} {badgeConfig[badge as keyof typeof badgeConfig].label}
            </div>
          ))}
        </div>
      </div>

      {/* Intro Section */}
      <section>
        <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <CardTitle className="text-2xl">Bem-vindo à Visão de Raio-X</CardTitle>
                <CardDescription className="text-blue-100 mt-2">
                  "Eu não tenho bola de cristal. Eu tenho técnica."
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Nesta aula, você descobriu que ler pessoas não é um dom sobrenatural. O formato do corpo humano é determinado por um processo biológico chamado mielinização da medula espinhal.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Tudo o que você viveu, desde o útero até os 5 anos de idade, moldou o corpo que você tem hoje. O seu corpo é uma armadura criada para proteger a sua mente das dores que você sentiu na infância.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Lesson Index Section */}
      <section className="py-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Índice das Lições</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {MINICOURSE_MODULE.lessons.map((lesson) => (
            <a
              key={lesson.id}
              href={`#/aula/${lesson.id}`}
              className={`
                        flex flex-col p-3 rounded-lg border transition-all duration-200
                        ${lesson.id === 1
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 ring-1 ring-blue-500/20'
                  : 'bg-white border-slate-200 dark:bg-neutral-900 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700'
                }
                    `}
            >
              <span className={`text-xs font-bold mb-1 ${lesson.id === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                AULA {lesson.id}
              </span>
              <span className={`text-sm font-medium leading-tight line-clamp-2 ${lesson.id === 1 ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-300'}`}>
                {lesson.title}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Multimedia Section */}
      <div className="flex flex-col gap-4 mb-8">
        <Card ref={el => cardRefs.current["audio_summary"] = el} className="bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <Headphones className="w-8 h-8 text-blue-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Resumo em Áudio</h3>
            <p className="text-xs text-slate-500">Para ouvir no trânsito (12 min)</p>
            <audio controls className="w-full mt-2 h-8 mb-4">
              <source src="https://priscilla-moreira.com/imagens/audio-cpl1.m4a" type="audio/mp4" />
              Seu navegador não suporta áudio.
            </audio>

            <Button size="sm" className={`w-full ${completedSections["audio_summary"] ? "bg-green-600" : "bg-slate-900"} text-white`} onClick={() => toggleSection("audio_summary")}>
              {completedSections["audio_summary"] ? <><CheckCircle2 className="w-4 h-4 mr-2" />Concluído</> : "Marcar como ouvido"}
            </Button>
            {completedSections["audio_summary"] && (
              <Button size="sm" className="w-full mt-2 bg-brand-red" onClick={() => handleGoToNext("audio_summary", "intro")}>
                Próximo 👉
              </Button>
            )}
            <GamificationStatus />
          </CardContent>
        </Card>

        <Card ref={el => cardRefs.current["video_summary"] = el} className="bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <Video className="w-8 h-8 text-green-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Resumo em Vídeo</h3>
            <p className="text-xs text-slate-500">O Guia das Armaduras</p>

            <div className="w-full mt-4 bg-black rounded-xl border border-gray-200 dark:border-neutral-800 shadow-2xl overflow-hidden mb-4">
              <div className="aspect-video w-full">
                <video controls className="w-full h-full">
                  <source src="https://priscilla-moreira.com/imagens/video-cpl1.mp4" type="video/mp4" />
                  Seu navegador não suporta vídeo.
                </video>
              </div>
            </div>

            <Button size="sm" className={`w-full ${completedSections["video_summary"] ? "bg-green-600" : "bg-slate-900"} text-white`} onClick={() => toggleSection("video_summary")}>
              {completedSections["video_summary"] ? <><CheckCircle2 className="w-4 h-4 mr-2" />Concluído</> : "Marcar como assistido"}
            </Button>
            {completedSections["video_summary"] && (
              <Button size="sm" className="w-full mt-2 bg-brand-red" onClick={() => handleGoToNext("video_summary", "intro")}>
                Próximo 👉
              </Button>
            )}
            <GamificationStatus />
          </CardContent>
        </Card>
      </div>

      <Tabs ref={tabsRef} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-full justify-start gap-3 bg-transparent p-0 h-auto overflow-x-auto scrollbar-hide pb-2">
          <TabsTrigger value="fundamentos" className="rounded-full px-6 py-2 h-auto text-sm font-medium transition-all duration-200 data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800">
            Fundamentos
          </TabsTrigger>
          <TabsTrigger value="tracos_carater" className="rounded-full px-6 py-2 h-auto text-sm font-medium transition-all duration-200 data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800">
            Traços de Caráter
          </TabsTrigger>
          <TabsTrigger value="alerta_saude" className="rounded-full px-6 py-2 h-auto text-sm font-medium transition-all duration-200 data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800">
            Alerta Saúde
          </TabsTrigger>
        </TabsList>

        {/* Fundamentos Tab */}
        <TabsContent value="fundamentos" className="space-y-6">
          <div className="space-y-6">
            <Card ref={el => cardRefs.current["fundamentos_1"] = el} className="border-2 border-slate-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 dark:text-white">A Formação da Armadura</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  O corpo não é moldado apenas pela genética. Ele reflete as necessidades básicas vividas em 5 fases de desenvolvimento. Se a necessidade não foi atendida, o corpo criou uma defesa física e comportamental.
                </p>
                <Button size="sm" className={`w-full ${completedSections["fundamentos_1"] ? "bg-green-600" : "bg-slate-900"} text-white`} onClick={() => toggleSection("fundamentos_1")}>
                  {completedSections["fundamentos_1"] ? <><CheckCircle2 className="w-4 h-4 mr-2" />Concluído</> : "Marcar como lido"}
                </Button>
                {completedSections["fundamentos_1"] && (
                  <Button size="sm" className="w-full mt-2 bg-brand-red" onClick={() => handleGoToNext("fundamentos_1", "fundamentos")}>
                    Próximo 👉
                  </Button>
                )}
                <GamificationStatus />
              </CardContent>
            </Card>

            <Card ref={el => cardRefs.current["fundamentos_key"] = el} className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900 dark:text-blue-200">Conceito Chave: O Processo de Mielinização</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 dark:text-blue-300 mb-4">
                  Ocorre do útero aos 5 anos. Cada etapa molda uma parte do corpo e define um traço de caráter predominante.
                </p>
                <Button size="sm" className={`w-full ${completedSections["fundamentos_key"] ? "bg-green-600" : "bg-blue-600"}`} onClick={() => toggleSection("fundamentos_key")}>
                  {completedSections["fundamentos_key"] ? <><CheckCircle2 className="w-4 h-4 mr-2" />Concluído</> : "Entendi o conceito"}
                </Button>
                <GamificationStatus />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Traços de Caráter Tab */}
        <TabsContent value="tracos_carater" className="space-y-6">
          <div className="grid gap-6">
            {[
              { id: "esquizoide", name: "1. O ESQUIZOIDE", icon: Brain, color: "text-purple-500", archetype: "A Mente Brilhante", body: "Magro, alongado, cheio de 'quinas'. Cabeça grande.", pain: "Rejeição (Útero)", power: "Criatividade, lógica e ideias geniais.", story: "O Tiago: Gênio da computação que queria ficar invisível.", deal: "Respeite a 'caverna' dele." },
              { id: "oral", name: "2. O ORAL", icon: Heart, color: "text-pink-500", archetype: "O Sentir e a Conexão", body: "Formas arredondadas, macias. Olhar 'pidão'.", pain: "Abandono (Amamentação)", power: "Comunicação, acolhimento e sensibilidade.", story: "A Cláudia: Sentia um 'buraco no peito' e precisava ser vista.", deal: "Ofereça colo e escuta." },
              { id: "psicopata", name: "3. O PSICOPATA", icon: Trophy, color: "text-amber-500", archetype: "O Líder Articulador", body: "Triângulo invertido. Ombros largos, quadril estreito.", pain: "Manipulação (Primeiros passos)", power: "Liderança, vendas e negociação.", story: "O Marcos: Só ganhava aplausos se fizesse 'gracinha'.", deal: "Mostre o 'ganha-ganha'." },
              { id: "masoquista", name: "4. O MASOQUISTA", icon: Shield, color: "text-slate-600", archetype: "O Cofre Forte", body: "Quadrado, compacto. Bumbum travado/achatado.", pain: "Humilhação (Desfralde)", power: "Planejamento, consistência e lealdade.", story: "A Ana: Carregava a família nas costas.", deal: "Nunca exponha em público." },
              { id: "rigido", name: "5. O RÍGIDO", icon: Star, color: "text-red-500", archetype: "A Perfeição Competitiva", body: "Harmônico, curvas de violão. Atraente.", pain: "Traição/Exclusão (Pares)", power: "Agilidade, execução e perfeição.", story: "A Juliana: Impecável e exausta.", deal: "Elogie a competência e beleza." }
            ].map((trait) => (
              <Card key={trait.id} ref={el => cardRefs.current[trait.id] = el} className="border-2 border-slate-200 dark:border-neutral-800 hover:border-brand-red transition-all">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={`p-3 rounded-full bg-slate-100 dark:bg-neutral-800 ${trait.color}`}>
                    <trait.icon size={32} />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-900 dark:text-white">{trait.name}</CardTitle>
                    <CardDescription className="font-bold text-brand-red">{trait.archetype}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 dark:bg-neutral-900 p-3 rounded">
                      <span className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Corpo:</span>
                      <span className="text-slate-600 dark:text-slate-400">{trait.body}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-neutral-900 p-3 rounded">
                      <span className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Dor Principal:</span>
                      <span className="text-red-500 font-medium">{trait.pain}</span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded col-span-2">
                      <span className="font-bold block mb-1 text-green-800 dark:text-green-300">Superpoder:</span>
                      <span className="text-green-700 dark:text-green-400">{trait.power}</span>
                    </div>
                  </div>
                  <p className="text-sm italic text-slate-500 border-l-2 border-slate-300 pl-3">"{trait.story}"</p>

                  <Button size="sm" className={`w-full ${completedSections[trait.id] ? "bg-green-600" : "bg-slate-900"} text-white`} onClick={() => toggleSection(trait.id)}>
                    {completedSections[trait.id] ? <><CheckCircle2 className="w-4 h-4 mr-2" />Estudado</> : "Marcar como estudado"}
                  </Button>
                  {completedSections[trait.id] && (
                    <Button size="sm" className="w-full mt-2 bg-brand-red" onClick={() => handleGoToNext(trait.id, "tracos_carater")}>
                      Próximo Traço 👉
                    </Button>
                  )}
                  <GamificationStatus />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Alerta Saúde Tab */}
        <TabsContent value="alerta_saude" className="space-y-6">
          <Card ref={el => cardRefs.current["alerta_saude_content"] = el} className="border-0 shadow-lg bg-red-50 dark:bg-red-950/20 border-l-8 border-l-red-600">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <CardTitle className="text-2xl text-red-700 dark:text-red-400">⚠️ O Grito do Corpo</CardTitle>
                  <CardDescription className="text-red-600/80">Quando o traço entra em sofrimento</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                Você aprendeu a ler o formato. Mas o que acontece quando ignoramos quem somos? O corpo grita em forma de DOENÇA.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li>Gastrite e Refluxo</li>
                <li>Enxaqueca constante</li>
                <li>Dores nas costas que não passam</li>
                <li>Travamento na lombar</li>
              </ul>
              <div className="bg-white dark:bg-black p-4 rounded border border-red-200 dark:border-red-900 mt-4">
                <p className="font-bold text-center text-red-600">
                  Isso não é azar. NA AULA 2, revelaremos a Causa Emocional das Doenças e o que sua dor tenta dizer.
                </p>
              </div>
              <Button size="lg" className={`w-full mt-4 ${completedSections["alerta_saude_content"] ? "bg-green-600" : "bg-red-600 hover:bg-red-700"}`} onClick={() => toggleSection("alerta_saude_content")}>
                {completedSections["alerta_saude_content"] ? <><CheckCircle2 className="w-4 h-4 mr-2" />Lido e Entendido</> : "Entendi o Alerta"}
              </Button>
              {completedSections["alerta_saude_content"] && (
                <Button size="sm" className="w-full mt-2 bg-slate-800 text-white" onClick={() => handleGoToNext("alerta_saude_content", "alerta_saude")}>
                  Ir para Exercícios 👉
                </Button>
              )}
              <GamificationStatus />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Exercises Section */}
      <section id="exercises-section">
        <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-start gap-3">
              <BookOpen className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <CardTitle className="text-2xl">Dever de Casa</CardTitle>
                <CardDescription className="text-cyan-100">Praticando o Olhar de Raio-X</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Card ref={el => cardRefs.current["ex_analise"] = el} className="border-2 border-cyan-200 dark:border-cyan-900">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 dark:text-white">Exercício: O Corpo Não Mente</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setExpandedExercise(expandedExercise === "ex_analise" ? null : "ex_analise")}>
                  {expandedExercise === "ex_analise" ? "−" : "👇 Abrir Instruções"}
                </Button>
              </CardHeader>
              {expandedExercise === "ex_analise" && (
                <CardContent className="space-y-4">
                  <ol className="list-decimal pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Pegue fotos antigas de família ou observe as pessoas ao seu redor hoje.</li>
                    <li>Identifique: Quem tem as 'quinas' do Esquizoide?</li>
                    <li>Identifique: Quem tem o 'bumbum travado' do Masoquista?</li>
                    <li>Identifique: Quem tem o olhar 'pidão' do Oral?</li>
                    <li>Anote suas percepções.</li>
                  </ol>
                  <textarea
                    placeholder="Anote aqui suas percepções..."
                    className="w-full p-3 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
                    rows={4}
                  />
                  <Button className={`w-full ${completedSections["ex_analise"] ? "bg-green-600" : "bg-cyan-600 hover:bg-cyan-700"}`} onClick={() => toggleSection("ex_analise")}>
                    {completedSections["ex_analise"] ? <><CheckCircle2 className="w-4 h-4 mr-2" />Exercício Concluído</> : "Marcar como Feito"}
                  </Button>
                  {completedSections["ex_analise"] && (
                    <Button size="sm" className="w-full mt-2 bg-slate-800 text-white" onClick={() => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })}>
                      Ir para o Quiz 👉
                    </Button>
                  )}
                  <GamificationStatus />
                </CardContent>
              )}
            </Card>
          </CardContent>
        </Card>
      </section>

      {/* Quiz Section */}
      <section id="quiz-section">
        <Card className="border-0 shadow-lg bg-slate-50 dark:bg-neutral-900 border-t-4 border-t-amber-500">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 dark:text-white">Teste seu Conhecimento: Qual é o Traço?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { id: 1, q: "Qual traço tem o corpo quadrado e o 'bumbum travado' como sinal de tensão?", options: ["Oral", "Masoquista", "Rígido"] },
              { id: 2, q: "Quem possui o corpo em formato de triângulo invertido e gosta de liderar?", options: ["Psicopata", "Esquizoide", "Oral"] },
              { id: 3, q: "Qual traço tem formas arredondadas e um olhar que conecta (pidão)?", options: ["Rígido", "Oral", "Masoquista"] }
            ].map((q) => (
              <div key={q.id} className="space-y-2">
                <p className="font-medium text-slate-800 dark:text-slate-200">{q.id}. {q.q}</p>
                <div className="flex gap-2 flex-wrap">
                  {q.options.map((opt) => (
                    <Button
                      key={opt}
                      variant={quizAnswers[q.id] === opt ? "default" : "outline"}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      className={quizAnswers[q.id] === opt ? "bg-amber-500 hover:bg-amber-600" : ""}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            <Button onClick={handleQuizSubmit} className="w-full bg-slate-900 text-white hover:bg-slate-800">
              Verificar Respostas
            </Button>
            {quizResult && (
              <div className="p-4 bg-green-100 text-green-800 rounded font-bold text-center animate-pulse">
                {quizResult}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Final Celebration */}
      {progressPercentage === 100 && (
        <div className="text-center py-8 animate-bounce">
          <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-4 rounded-lg shadow-lg">
            <p className="text-lg font-bold mb-2">🎉 Parabéns!</p>
            <p className="text-sm">Você dominou o Raio-X Invisível! Nos vemos na Aula 2.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePageContent;

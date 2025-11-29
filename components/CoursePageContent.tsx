import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CheckCircle2, Trophy, Heart, Brain, Shield, Star, Zap, BookOpen, PlayCircle, Headphones, FileText, AlertTriangle, Video, HelpCircle, Layers } from "lucide-react";
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
  const [badges, setBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('lms_badges');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('fundamentos');
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  const completedCount = Object.values(completedSections).filter(Boolean).length;
  const userPoints = completedCount * 50;
  const totalSections = 11; // Total de itens pontuáveis
  const progressPercentage = (completedCount / totalSections) * 100;

  useEffect(() => {
    localStorage.setItem('lms_completedSections', JSON.stringify(completedSections));
    localStorage.setItem('lms_userPoints', userPoints.toString());
    localStorage.setItem('lms_badges', JSON.stringify(badges));
  }, [completedSections, userPoints, badges]);

  useEffect(() => {
    const newBadges = [...badges];
    let hasChanges = false;

    if (completedCount >= 3 && !newBadges.includes("iniciante")) { newBadges.push("iniciante"); hasChanges = true; }
    if (completedCount >= 6 && !newBadges.includes("explorador")) { newBadges.push("explorador"); hasChanges = true; }
    if (completedCount === totalSections && !newBadges.includes("mestre")) { newBadges.push("mestre"); hasChanges = true; }

    if (hasChanges) {
      setBadges(newBadges);
    }
  }, [completedCount, badges]);

  // Mapeamento das atividades por aba para controle de navegação
  const activityMap: Record<string, string[]> = {
    intro: ["audio_summary", "video_summary"],
    fundamentos: ["fundamentos_1"],
    tracos_carater: ["esquizoide", "oral", "psicopata", "masoquista", "rigido"],
    alerta_saude: ["alerta_saude_content"],
    exercicios: ["ex_analise"],
  };

  const toggleSection = (sectionId: string) => {
    if (completedSections[sectionId]) return; // Prevent unmarking
    setCompletedSections((prev) => ({ ...prev, [sectionId]: true }));
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

  const scrollToSection = (sectionId: string, tabId?: string) => {
    if (tabId && tabId !== activeTab) {
      setActiveTab(tabId);
      // Wait for tab switch animation/render
      setTimeout(() => {
        const element = document.getElementById(sectionId) || cardRefs.current[sectionId];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          element.classList.add('highlight-card');
          setTimeout(() => element.classList.remove('highlight-card'), 1500);
        }
      }, 300);
    } else {
      const element = document.getElementById(sectionId) || cardRefs.current[sectionId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        element.classList.add('highlight-card');
        setTimeout(() => element.classList.remove('highlight-card'), 1500);
      }
    }
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
    <div className="space-y-8 md:space-y-12 mt-8 md:mt-12">
      {/* Dashboard Section */}
      <div className="bg-slate-50 dark:bg-neutral-900/50 rounded-2xl p-6 md:p-8 mb-8 border border-slate-100 dark:border-neutral-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">

          {/* Progress */}
          <div className="w-full md:w-1/2 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Seu Progresso
              </span>
              <span className="text-slate-500 font-medium">{completedCount} de {totalSections} atividades</span>
            </div>
            <Progress value={progressPercentage} className="h-4 rounded-full bg-slate-200 dark:bg-neutral-800" />
          </div>

          {/* Points */}
          <div className="w-full md:w-auto flex items-center gap-4 bg-white dark:bg-black px-5 py-3 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm transition-transform hover:scale-105 duration-300">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Sua Pontuação</span>
              <span className="block text-2xl font-bold text-slate-900 dark:text-white">{userPoints} <span className="text-sm font-normal text-slate-500">XP</span></span>
            </div>
          </div>
        </div>

        {/* Badges & Info */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-t border-slate-200 dark:border-neutral-800 pt-6">

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {badges.length === 0 && <span className="text-sm text-slate-400 italic flex items-center gap-2"><Star size={14} /> Complete atividades para ganhar medalhas!</span>}
            {badges.map((badge) => (
              <div key={badge} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm border ${badgeConfig[badge as keyof typeof badgeConfig].color} border-current/20 transition-all hover:scale-105 cursor-default`}>
                <span className="text-lg">{badgeConfig[badge as keyof typeof badgeConfig].icon}</span>
                <span>{badgeConfig[badge as keyof typeof badgeConfig].label}</span>
              </div>
            ))}
          </div>

          {/* Mini Info */}
          <div className="w-full md:w-auto flex items-start md:items-center gap-3 text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/10 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-900/20 max-w-md">
            <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 md:mt-0" />
            <p className="leading-snug">
              Complete todas as lições até a <strong>Aula 4</strong> para liberar seu <strong className="text-blue-600 dark:text-blue-400">Certificado Gratuito</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section>
        <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Zap className="w-8 h-8 text-yellow-300" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl mb-2">Bem-vindo à Visão de Raio-X</CardTitle>
                <CardDescription className="text-blue-100 text-base md:text-lg">
                  "Eu não tenho bola de cristal. Eu tenho técnica."
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 text-base md:text-lg">
              Nesta aula, você descobriu que ler pessoas não é um dom sobrenatural. O formato do corpo humano é determinado por um processo biológico chamado mielinização da medula espinhal.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg border-l-4 border-purple-500 pl-4 italic">
              "Tudo o que você viveu, desde o útero até os 5 anos de idade, moldou o corpo que você tem hoje. O seu corpo é uma armadura criada para proteger a sua mente das dores que você sentiu na infância."
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Content Index Section */}
      <section className="py-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Layers size={16} />
            Navegação Rápida
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "Resumo em Áudio", icon: Headphones, action: () => scrollToSection("audio_summary") },
            { label: "Resumo em Vídeo", icon: Video, action: () => scrollToSection("video_summary") },
            { label: "Fundamentos", icon: BookOpen, action: () => scrollToSection("fundamentos_1", "fundamentos") },
            { label: "Traços de Caráter", icon: Brain, action: () => scrollToSection("esquizoide", "tracos_carater") },
            { label: "Alerta Saúde", icon: AlertTriangle, action: () => scrollToSection("alerta_saude_content", "alerta_saude") },
            { label: "Dever de Casa", icon: FileText, action: () => scrollToSection("exercises-section") },
            { label: "Teste seu Conhecimento", icon: CheckCircle2, action: () => scrollToSection("quiz-section") },
          ].map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="flex flex-col items-center justify-center p-4 rounded-xl border bg-white border-slate-200 dark:bg-neutral-900 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md transition-all duration-300 gap-3 text-center h-full group"
            >
              <div className="p-2 bg-slate-50 dark:bg-neutral-800 rounded-full group-hover:bg-white dark:group-hover:bg-neutral-700 transition-colors">
                <item.icon className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Multimedia Section */}
      <div className="flex flex-col gap-6 mb-8">
        <Card ref={el => cardRefs.current["audio_summary"] = el} className="bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
          <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2">
              <Headphones className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Resumo em Áudio</h3>
              <p className="text-sm text-slate-500">Para ouvir no trânsito (12 min)</p>
            </div>

            <div className="w-full bg-white dark:bg-black p-4 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-inner">
              <audio controls className="w-full h-10">
                <source src="https://priscilla-moreira.com/imagens/audio-cpl1.m4a" type="audio/mp4" />
                Seu navegador não suporta áudio.
              </audio>
            </div>

            <Button size="lg" className={`w-full py-6 text-base font-bold shadow-lg transition-all hover:scale-[1.02] ${completedSections["audio_summary"] ? "bg-green-600 hover:bg-green-700" : "bg-slate-900 hover:bg-slate-800"} text-white rounded-xl`} onClick={() => toggleSection("audio_summary")}>
              {completedSections["audio_summary"] ? <><CheckCircle2 className="w-5 h-5 mr-2" />Concluído</> : "Marcar como ouvido"}
            </Button>
            {completedSections["audio_summary"] && (
              <Button variant="outline" size="lg" className="w-full py-6 text-brand-red border-brand-red hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-bold" onClick={() => handleGoToNext("audio_summary", "intro")}>
                Próximo: Vídeo Resumo 👉
              </Button>
            )}
            <GamificationStatus />
          </CardContent>
        </Card>

        <Card ref={el => cardRefs.current["video_summary"] = el} className="bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
          <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
              <Video className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Resumo em Vídeo</h3>
              <p className="text-sm text-slate-500">O Guia das Armaduras</p>
            </div>

            <div className="w-full bg-black rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-2xl overflow-hidden mb-4">
              <div className="aspect-video w-full">
                <video controls className="w-full h-full">
                  <source src="https://priscilla-moreira.com/imagens/video-cpl1.mp4" type="video/mp4" />
                  Seu navegador não suporta vídeo.
                </video>
              </div>
            </div>

            <Button size="lg" className={`w-full py-6 text-base font-bold shadow-lg transition-all hover:scale-[1.02] ${completedSections["video_summary"] ? "bg-green-600 hover:bg-green-700" : "bg-slate-900 hover:bg-slate-800"} text-white rounded-xl`} onClick={() => toggleSection("video_summary")}>
              {completedSections["video_summary"] ? <><CheckCircle2 className="w-5 h-5 mr-2" />Concluído</> : "Marcar como assistido"}
            </Button>
            {completedSections["video_summary"] && (
              <Button variant="outline" size="lg" className="w-full py-6 text-brand-red border-brand-red hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-bold" onClick={() => handleGoToNext("video_summary", "intro")}>
                Próximo: Fundamentos 👉
              </Button>
            )}
            <GamificationStatus />
          </CardContent>
        </Card>
      </div>

      <Tabs ref={tabsRef} value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="sticky top-0 z-20 bg-gray-50/95 dark:bg-brand-darker/95 backdrop-blur-sm py-4 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:backdrop-blur-none">
          <TabsList className="flex w-full justify-start gap-3 bg-transparent p-0 h-auto overflow-x-auto scrollbar-hide pb-2">
            <TabsTrigger value="fundamentos" className="rounded-full px-6 py-2.5 h-auto text-sm font-bold transition-all duration-300 data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800 flex-shrink-0">
              Fundamentos
            </TabsTrigger>
            <TabsTrigger value="tracos_carater" className="rounded-full px-6 py-2.5 h-auto text-sm font-bold transition-all duration-300 data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800 flex-shrink-0">
              Traços de Caráter
            </TabsTrigger>
            <TabsTrigger value="alerta_saude" className="rounded-full px-6 py-2.5 h-auto text-sm font-bold transition-all duration-300 data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800 flex-shrink-0">
              Alerta Saúde
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Fundamentos Tab */}
        <TabsContent value="fundamentos" className="space-y-8 animate-fade-in">
          <div className="space-y-8">
            <Card ref={el => cardRefs.current["fundamentos_1"] = el} className="border-2 border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
              <CardHeader className="bg-slate-50 dark:bg-neutral-900/50">
                <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-white">A Formação da Armadura</CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                  O corpo não é moldado apenas pela genética. Ele reflete as necessidades básicas vividas em 5 fases de desenvolvimento. Se a necessidade não foi atendida, o corpo criou uma defesa física e comportamental.
                </p>
                <Button size="lg" className={`w-full py-6 text-base font-bold rounded-xl shadow-md transition-transform hover:scale-[1.01] ${completedSections["fundamentos_1"] ? "bg-green-600 hover:bg-green-700" : "bg-slate-900 hover:bg-slate-800"} text-white`} onClick={() => toggleSection("fundamentos_1")}>
                  {completedSections["fundamentos_1"] ? <><CheckCircle2 className="w-5 h-5 mr-2" />Concluído</> : "Marcar como lido"}
                </Button>
                {completedSections["fundamentos_1"] && (
                  <Button variant="outline" size="lg" className="w-full mt-3 py-6 text-brand-red border-brand-red hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-bold" onClick={() => handleGoToNext("fundamentos_1", "fundamentos")}>
                    Próximo: Conceito Chave 👉
                  </Button>
                )}
                <GamificationStatus />
              </CardContent>
            </Card>

            <Card ref={el => cardRefs.current["fundamentos_key"] = el} className="border-l-8 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10 rounded-r-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  Conceito Chave: O Processo de Mielinização
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-blue-800 dark:text-blue-300 mb-6 text-lg">
                  Ocorre do útero aos 5 anos. Cada etapa molda uma parte do corpo e define um traço de caráter predominante.
                </p>
                <Button size="lg" className={`w-full py-6 text-base font-bold rounded-xl shadow-md ${completedSections["fundamentos_key"] ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"} text-white`} onClick={() => toggleSection("fundamentos_key")}>
                  {completedSections["fundamentos_key"] ? <><CheckCircle2 className="w-5 h-5 mr-2" />Concluído</> : "Entendi o conceito"}
                </Button>
                <GamificationStatus />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Traços de Caráter Tab */}
        <TabsContent value="tracos_carater" className="space-y-8 animate-fade-in">
          <div className="grid gap-8">
            {[
              { id: "esquizoide", name: "1. O ESQUIZOIDE", icon: Brain, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/20", archetype: "A Mente Brilhante", body: "Magro, alongado, cheio de 'quinas'. Cabeça grande.", pain: "Rejeição (Útero)", power: "Criatividade, lógica e ideias geniais.", story: "O Tiago: Gênio da computação que queria ficar invisível.", deal: "Respeite a 'caverna' dele." },
              { id: "oral", name: "2. O ORAL", icon: Heart, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/20", archetype: "O Sentir e a Conexão", body: "Formas arredondadas, macias. Olhar 'pidão'.", pain: "Abandono (Amamentação)", power: "Comunicação, acolhimento e sensibilidade.", story: "A Cláudia: Sentia um 'buraco no peito' e precisava ser vista.", deal: "Ofereça colo e escuta." },
              { id: "psicopata", name: "3. O PSICOPATA", icon: Trophy, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/20", archetype: "O Líder Articulador", body: "Triângulo invertido. Ombros largos, quadril estreito.", pain: "Manipulação (Primeiros passos)", power: "Liderança, vendas e negociação.", story: "O Marcos: Só ganhava aplausos se fizesse 'gracinha'.", deal: "Mostre o 'ganha-ganha'." },
              { id: "masoquista", name: "4. O MASOQUISTA", icon: Shield, color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-800", archetype: "O Cofre Forte", body: "Quadrado, compacto. Bumbum travado/achatado.", pain: "Humilhação (Desfralde)", power: "Planejamento, consistência e lealdade.", story: "A Ana: Carregava a família nas costas.", deal: "Nunca exponha em público." },
              { id: "rigido", name: "5. O RÍGIDO", icon: Star, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/20", archetype: "A Perfeição Competitiva", body: "Harmônico, curvas de violão. Atraente.", pain: "Traição/Exclusão (Pares)", power: "Agilidade, execução e perfeição.", story: "A Juliana: Impecável e exausta.", deal: "Elogie a competência e beleza." }
            ].map((trait) => (
              <Card key={trait.id} ref={el => cardRefs.current[trait.id] = el} className="border-2 border-slate-200 dark:border-neutral-800 hover:border-brand-red transition-all duration-300 rounded-2xl overflow-hidden group">
                <CardHeader className="flex flex-row items-center gap-4 bg-slate-50 dark:bg-neutral-900/50 p-6">
                  <div className={`p-4 rounded-2xl ${trait.bg} ${trait.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <trait.icon size={36} />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-white mb-1">{trait.name}</CardTitle>
                    <CardDescription className="font-bold text-brand-red text-base">{trait.archetype}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-4 text-sm md:text-base">
                    <div className="bg-slate-50 dark:bg-neutral-900 p-4 rounded-xl border border-slate-100 dark:border-neutral-800">
                      <span className="font-bold block mb-1 text-slate-700 dark:text-slate-300 uppercase text-xs tracking-wider">Corpo</span>
                      <span className="text-slate-600 dark:text-slate-400">{trait.body}</span>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20">
                      <span className="font-bold block mb-1 text-red-700 dark:text-red-300 uppercase text-xs tracking-wider">Dor Principal</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">{trait.pain}</span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/20 col-span-1 md:col-span-2">
                      <span className="font-bold block mb-1 text-green-800 dark:text-green-300 uppercase text-xs tracking-wider">Superpoder</span>
                      <span className="text-green-700 dark:text-green-400 font-medium">{trait.power}</span>
                    </div>
                  </div>

                  <div className="relative pl-6 border-l-4 border-slate-300 dark:border-neutral-700 py-2">
                    <p className="text-base italic text-slate-600 dark:text-slate-400">"{trait.story}"</p>
                  </div>

                  <Button size="lg" className={`w-full py-6 text-base font-bold rounded-xl shadow-md transition-all hover:scale-[1.01] ${completedSections[trait.id] ? "bg-green-600 hover:bg-green-700" : "bg-slate-900 hover:bg-slate-800"} text-white`} onClick={() => toggleSection(trait.id)}>
                    {completedSections[trait.id] ? <><CheckCircle2 className="w-5 h-5 mr-2" />Estudado</> : "Marcar como estudado"}
                  </Button>
                  {completedSections[trait.id] && (
                    <Button variant="outline" size="lg" className="w-full mt-2 py-6 text-brand-red border-brand-red hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-bold" onClick={() => handleGoToNext(trait.id, "tracos_carater")}>
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
        <TabsContent value="alerta_saude" className="space-y-8 animate-fade-in">
          <Card ref={el => cardRefs.current["alerta_saude_content"] = el} className="border-0 shadow-xl bg-red-50 dark:bg-red-950/20 border-l-8 border-l-red-600 rounded-r-2xl overflow-hidden">
            <CardHeader className="bg-red-100/50 dark:bg-red-900/10 p-6 md:p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full animate-pulse">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl text-red-700 dark:text-red-400">⚠️ O Grito do Corpo</CardTitle>
                  <CardDescription className="text-red-600/80 text-lg">Quando o traço entra em sofrimento</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6 md:p-8">
              <p className="text-slate-800 dark:text-slate-200 font-medium text-lg leading-relaxed">
                Você aprendeu a ler o formato. Mas o que acontece quando ignoramos quem somos? O corpo grita em forma de DOENÇA.
              </p>
              <div className="bg-white/60 dark:bg-black/40 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
                <ul className="grid md:grid-cols-2 gap-3">
                  {["Gastrite e Refluxo", "Enxaqueca constante", "Dores nas costas que não passam", "Travamento na lombar"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white dark:bg-black p-6 rounded-xl border border-red-200 dark:border-red-900 shadow-sm">
                <p className="font-bold text-center text-red-600 text-lg">
                  Isso não é azar. NA AULA 2, revelaremos a Causa Emocional das Doenças e o que sua dor tenta dizer.
                </p>
              </div>
              <Button size="lg" className={`w-full mt-4 py-6 text-base font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] ${completedSections["alerta_saude_content"] ? "bg-green-600" : "bg-red-600 hover:bg-red-700"}`} onClick={() => toggleSection("alerta_saude_content")}>
                {completedSections["alerta_saude_content"] ? <><CheckCircle2 className="w-5 h-5 mr-2" />Lido e Entendido</> : "Entendi o Alerta"}
              </Button>
              {completedSections["alerta_saude_content"] && (
                <Button variant="outline" size="lg" className="w-full mt-2 py-6 text-slate-800 dark:text-white border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl font-bold" onClick={() => handleGoToNext("alerta_saude_content", "alerta_saude")}>
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
        <Card className="border-0 shadow-xl bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <BookOpen className="w-8 h-8 text-cyan-100" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl">Dever de Casa</CardTitle>
                <CardDescription className="text-cyan-100 text-lg">Praticando o Olhar de Raio-X</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <Card ref={el => cardRefs.current["ex_analise"] = el} className="border-2 border-cyan-200 dark:border-cyan-900 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/10 transition-colors" onClick={() => setExpandedExercise(expandedExercise === "ex_analise" ? null : "ex_analise")}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg md:text-xl text-slate-900 dark:text-white">Exercício: O Corpo Não Mente</CardTitle>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    {expandedExercise === "ex_analise" ? "−" : "👇 Abrir"}
                  </Button>
                </div>
              </CardHeader>
              {expandedExercise === "ex_analise" && (
                <CardContent className="space-y-6 p-6 animate-fade-in">
                  <div className="bg-cyan-50 dark:bg-cyan-900/10 p-6 rounded-xl">
                    <ol className="list-decimal pl-5 space-y-3 text-slate-700 dark:text-slate-300 text-base">
                      <li>Pegue fotos antigas de família ou observe as pessoas ao seu redor hoje.</li>
                      <li>Identifique: Quem tem as 'quinas' do Esquizoide?</li>
                      <li>Identifique: Quem tem o 'bumbum travado' do Masoquista?</li>
                      <li>Identifique: Quem tem o olhar 'pidão' do Oral?</li>
                      <li>Anote suas percepções.</li>
                    </ol>
                  </div>
                  <textarea
                    placeholder="Anote aqui suas percepções..."
                    className="w-full p-4 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 shadow-inner min-h-[150px]"
                  />
                  <Button size="lg" className={`w-full py-6 text-base font-bold rounded-xl shadow-md transition-transform hover:scale-[1.02] ${completedSections["ex_analise"] ? "bg-green-600" : "bg-cyan-600 hover:bg-cyan-700"}`} onClick={() => toggleSection("ex_analise")}>
                    {completedSections["ex_analise"] ? <><CheckCircle2 className="w-5 h-5 mr-2" />Exercício Concluído</> : "Marcar como Feito"}
                  </Button>
                  {completedSections["ex_analise"] && (
                    <Button variant="outline" size="lg" className="w-full mt-2 py-6 text-slate-800 dark:text-white border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl font-bold" onClick={() => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })}>
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
        <Card className="border-0 shadow-xl bg-slate-50 dark:bg-neutral-900 border-t-8 border-t-amber-500 rounded-2xl overflow-hidden">
          <CardHeader className="bg-amber-50 dark:bg-amber-900/10 p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <Brain className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-white">Teste seu Conhecimento: Qual é o Traço?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6 md:p-8">
            {[
              { id: 1, q: "Qual traço tem o corpo quadrado e o 'bumbum travado' como sinal de tensão?", options: ["Oral", "Masoquista", "Rígido"] },
              { id: 2, q: "Quem possui o corpo em formato de triângulo invertido e gosta de liderar?", options: ["Psicopata", "Esquizoide", "Oral"] },
              { id: 3, q: "Qual traço tem formas arredondadas e um olhar que conecta (pidão)?", options: ["Rígido", "Oral", "Masoquista"] }
            ].map((q) => (
              <div key={q.id} className="space-y-3 bg-white dark:bg-black p-6 rounded-xl border border-slate-100 dark:border-neutral-800 shadow-sm">
                <p className="font-bold text-lg text-slate-800 dark:text-slate-200">{q.id}. {q.q}</p>
                <div className="flex gap-3 flex-wrap">
                  {q.options.map((opt) => (
                    <Button
                      key={opt}
                      variant={quizAnswers[q.id] === opt ? "default" : "outline"}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      className={`flex-1 min-w-[120px] py-6 rounded-xl font-medium transition-all ${quizAnswers[q.id] === opt ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md scale-105" : "hover:bg-amber-50 dark:hover:bg-amber-900/20"}`}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            <Button size="lg" onClick={handleQuizSubmit} className="w-full py-6 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-lg transition-transform hover:scale-[1.01]">
              Verificar Respostas
            </Button>
            {quizResult && (
              <div className="p-6 bg-green-100 text-green-800 rounded-xl font-bold text-center text-lg animate-bounce border border-green-200 shadow-sm">
                {quizResult}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer Progress & Points */}
      <div className="border-t border-gray-200 dark:border-neutral-800 pt-8 pb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Progresso do Minicurso</h3>
            <p className="text-slate-500 dark:text-slate-400">Continue assim para conquistar seu certificado!</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-neutral-800 px-6 py-3 rounded-full">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{userPoints}</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">pontos</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{completedCount} de {totalSections} lições</span>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3 rounded-full" />
        </div>
      </div>

      {/* Final Celebration */}
      {progressPercentage === 100 && (
        <div className="text-center py-12 animate-bounce">
          <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white px-10 py-6 rounded-2xl shadow-xl transform hover:scale-110 transition-transform cursor-pointer">
            <p className="text-2xl font-bold mb-2">🎉 Parabéns!</p>
            <p className="text-lg">Você dominou o Raio-X Invisível! Nos vemos na Aula 2.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePageContent;

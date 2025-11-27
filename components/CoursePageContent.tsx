import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CheckCircle2, Award, Zap, Heart, Brain, Eye, Lightbulb, BookOpen, Trophy } from "lucide-react";

interface CompletedSection {
  [key: string]: boolean;
}

const CoursePageContent: React.FC = () => {
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
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

  useEffect(() => {
    localStorage.setItem('lms_completedSections', JSON.stringify(completedSections));
    localStorage.setItem('lms_userPoints', userPoints.toString());
    localStorage.setItem('lms_badges', JSON.stringify(badges));
  }, [completedSections, userPoints, badges]);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

    // Mapeamento das atividades por aba para controle de navegação
  const activityMap: Record<string, string[]> = {
    proposito: ["curar", "ajudar", "remunerado"],
    principios: ["principios"], // Apenas um card grande
    pilares: ["observacao", "escuta", "interpretacao"],
    sinais: ["sinais"], // Apenas um card grande com tabela
    exercicios: ["exercicio1", "exercicio2"],
  };

  const totalSections = 10;
  const completedCount = Object.values(completedSections).filter(Boolean).length;
  const progressPercentage = (completedCount / totalSections) * 100;

    const toggleSection = (sectionId: string) => {
    setCompletedSections((prev) => {
      const newState = { ...prev, [sectionId]: !prev[sectionId] };
      if (!prev[sectionId]) {
        setUserPoints((p) => p + 50);
        checkBadges(newState);
      } else {
        // Revert points if unmarking, though the UI doesn't allow it yet
        setUserPoints((p) => Math.max(0, p - 50));
      }
      return newState;
    });
  };

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
        // Optional: Add a temporary visual highlight (e.g., a class)
        nextCard.classList.add('highlight-card');
        setTimeout(() => {
          nextCard.classList.remove('highlight-card');
        }, 1500);
      }
    }
  };


  const checkBadges = (sections: CompletedSection) => {
    const newBadges = [...badges];
    const completedCount = Object.values(sections).filter(Boolean).length;

    if (completedCount >= 3 && !newBadges.includes("iniciante")) {
      newBadges.push("iniciante");
    }
    if (completedCount >= 6 && !newBadges.includes("explorador")) {
      newBadges.push("explorador");
    }
    if (completedCount === 8 && !newBadges.includes("mestre")) {
      newBadges.push("mestre");
    }

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
      <span>{completedCount} de {totalSections} seções</span>
    </div>
  );

  return (
    <div className="space-y-12 mt-12">
      {/* Header Info - Simplified for insertion */}
      <div className="border-b border-gray-200 dark:border-neutral-900 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Conteúdo da Aula: Fundamentos da Análise Corporal
          </h2>
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">{userPoints}</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">pontos</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progresso da Aula</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">{completedCount} de {totalSections} seções</span>
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

      {/* Introduction Section */}
      <section>
        <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <CardTitle className="text-2xl">O Início da Sua Jornada</CardTitle>
                <CardDescription className="text-blue-100 mt-2">
                  Bem-vindo à descoberta do universo da Análise Corporal
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              A primeira e mais transformadora lição que você aprendeu é que a habilidade de ler o corpo humano não é um dom místico restrito a poucos, mas sim uma ferramenta poderosa que pode ser treinada por qualquer pessoa.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Ao dominar estes fundamentos, você começará a decifrar as histórias que cada corpo conta, mesmo quando a boca se cala. Vamos explorar juntos o propósito fundamental que move um analista corporal.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Main Content Tabs */}
      <Tabs defaultValue="proposito" className="space-y-6">
        <TabsList className="flex w-full justify-start gap-3 bg-transparent p-0 h-auto overflow-x-auto scrollbar-hide pb-2">
          <TabsTrigger
            value="proposito"
            className="rounded-full px-6 py-2 h-auto text-sm font-medium transition-all duration-200 data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800"
          >
            Propósito
          </TabsTrigger>
          <TabsTrigger
            value="principios"
            className="rounded-full px-6 py-2 h-auto text-sm font-medium transition-all duration-200 data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800"
          >
            Princípios
          </TabsTrigger>
          <TabsTrigger
            value="pilares"
            className="rounded-full px-6 py-2 h-auto text-sm font-medium transition-all duration-200 data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800"
          >
            Pilares
          </TabsTrigger>
          <TabsTrigger
            value="sinais"
            className="rounded-full px-6 py-2 h-auto text-sm font-medium transition-all duration-200 data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800"
          >
            Sinais
          </TabsTrigger>
        </TabsList>

        {/* Propósito Tab */}
        <TabsContent value="proposito" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <CardTitle className="text-2xl">Os Três Caminhos da Análise Corporal</CardTitle>
                  <CardDescription className="text-emerald-100">
                    Três benefícios transformadores que aguardam você
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: "curar", title: "Se Curar", icon: "💚", description: "Olhe para dentro e compreenda a origem das suas próprias dores, tanto físicas quanto emocionais. Uma ferramenta de autoconhecimento que traz clareza sobre seus padrões." },
                  { id: "ajudar", title: "Ajudar Pessoas", icon: "🤝", description: "Torne-se um ponto de apoio genuíno para familiares, amigos ou clientes. Sua capacidade de escuta se aprofunda, permitindo um acolhimento que realmente enxerga o outro." },
                  { id: "remunerado", title: "Ser Remunerado", icon: "💼", description: "Transforme o conhecimento em uma profissão com alma. Posicione-se como um profissional diferenciado e essencial no mercado atual." },
                ].map((path) => (
                  <Card key={path.id}
                    ref={el => cardRefs.current[path.id] = el}
                    className="border-2 border-slate-200 dark:border-neutral-800 hover:border-emerald-400 transition-colors"
                  >
                    <CardHeader>
                      <div className="text-3xl mb-2">{path.icon}</div>
                      <CardTitle className="text-lg text-slate-900 dark:text-white">{path.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{path.description}</p>
                      <Button size="sm"
                        className={`w-full transition-all duration-300 ${completedSections[path.id] ? "bg-green-600 hover:bg-green-700 text-white" : "bg-slate-900 hover:bg-slate-800 text-white shadow-md"}`}
                        onClick={(e) => { e.stopPropagation(); toggleSection(path.id); }}
                        disabled={completedSections[path.id]}
                      >
                        {completedSections[path.id] ? (<><CheckCircle2 className="w-4 h-4 mr-2" />Concluído ✅</>) : ("Marcar como completo")}
                      </Button>
                      {completedSections[path.id] && (
                        // Check if it's the last activity in the 'proposito' tab
                        activityMap.proposito.indexOf(path.id) < activityMap.proposito.length - 1 && (
                          <Button
                            size="sm"
                            className="w-full mt-2 bg-brand-red hover:bg-red-700 text-white shadow-md"
                            onClick={() => handleGoToNext(path.id, "proposito")}
                          >
                            👉 Ir para a próxima atividade
                          </Button>
                        )
                      )}
                      <GamificationStatus />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Princípios Tab */}
        <TabsContent value="principios" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900 border-l-4 border-l-red-500">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-t-lg">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <CardTitle className="text-2xl">O Princípio Fundamental</CardTitle>
                  <CardDescription className="text-red-100">O Corpo Nunca Mente</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-red-50 dark:bg-red-950/50 border-l-4 border-red-500 p-4 rounded mb-6">
                <p className="text-red-900 dark:text-red-200 font-semibold italic">"O corpo é um repositório sagrado e fiel de todas as nossas experiências de vida."</p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">O Mapa Vivo das Emoções</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Seu corpo é um mapa vivo de sua jornada emocional. Muito antes do seu nascimento, ele já estava sendo moldado não apenas pelo DNA, mas também pelas experiências emocionais vividas no útero. Tudo o que você viveu, sentiu e reprimiu está impresso em sua postura, em suas tensões e até na sua forma de respirar.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">As Sete Dores Existenciais</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Rejeição', 'Abandono', 'Manipulação', 'Humilhação', 'Troca', 'Traição', 'Exclusão'].map((dor) => (
                      <div key={dor} className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-neutral-800 rounded-lg">
                        <span className="text-red-500">●</span>
                        <span className="text-slate-700 dark:text-slate-300">{dor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                ref={el => cardRefs.current["principios"] = el}
                className={`w-full mt-6 transition-all duration-300 ${completedSections["principios"] ? "bg-green-600 hover:bg-green-700 text-white" : "bg-slate-900 hover:bg-slate-800 text-white shadow-md"}`}
                size="lg"
                onClick={() => toggleSection("principios")}
                disabled={completedSections["principios"]}
              >
                {completedSections["principios"] ? (<><CheckCircle2 className="w-4 h-4 mr-2" />Concluído ✅</>) : ("Marcar como completo")}
              </Button>
              {/* Última atividade da aba, não exibe o botão de próxima atividade */}
              <GamificationStatus />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pilares Tab */}
        <TabsContent value="pilares" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-lg">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <CardTitle className="text-2xl">Os Três Pilares da Prática</CardTitle>
                  <CardDescription className="text-amber-100">Como começar a ler o corpo com método e clareza</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  { id: "observacao", icon: "👀", title: "Observação Atenta", description: "Reparar em pequenos detalhes: mãos inquietas, olhos distantes, ombros curvados. A verdadeira observação vai além do óbvio.", reflection: "Durante sua última conversa importante, que pequenos detalhes você notou no corpo da outra pessoa?" },
                  { id: "escuta", icon: "🎧", title: "Escuta Profunda", description: "O corpo fala, mas é preciso aprender a ouvir o que está por trás do gesto. Conectar-se com a mensagem emocional.", reflection: "Pense em uma situação em que as palavras diziam uma coisa, mas você sentiu que havia outra mensagem." },
                  { id: "interpretacao", icon: "🧠", title: "Interpretação Consciente", description: "Conectar sinais físicos às emoções, sem julgamentos. Baseada nos 3 C's: Coerência, Congruência e Conjunto de Sinais.", reflection: "Como a análise dos 3 C's pode evitar que você tire conclusões precipitadas sobre o que observa?" },
                ].map((pilar) => (
                  <Card key={pilar.id}
                    ref={el => cardRefs.current[pilar.id] = el}
                    className="border-2 border-slate-200 dark:border-neutral-800"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{pilar.icon}</span>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-slate-900 dark:text-white">{pilar.title}</CardTitle>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{pilar.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-blue-900 dark:text-blue-200">
                          <span className="font-semibold">Ponto de Reflexão:</span> {pilar.reflection}
                        </p>
                      </div>
                      <Button size="sm"
                        className={`w-full transition-all duration-300 ${completedSections[pilar.id] ? "bg-green-600 hover:bg-green-700 text-white" : "bg-slate-900 hover:bg-slate-800 text-white shadow-md"}`}
                        onClick={() => toggleSection(pilar.id)}
                        disabled={completedSections[pilar.id]}
                      >
                        {completedSections[pilar.id] ? (<><CheckCircle2 className="w-4 h-4 mr-2" />Concluído ✅</>) : ("Marcar como completo")}
                      </Button>
                      {completedSections[pilar.id] && (
                        // Check if it's the last activity in the 'pilares' tab
                        activityMap.pilares.indexOf(pilar.id) < activityMap.pilares.length - 1 && (
                          <Button
                            size="sm"
                            className="w-full mt-2 bg-brand-red hover:bg-red-700 text-white shadow-md"
                            onClick={() => handleGoToNext(pilar.id, "pilares")}
                          >
                            👉 Ir para a próxima atividade
                          </Button>
                        )
                      )
                      }
                      <GamificationStatus />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sinais Tab */}
        <TabsContent value="sinais" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-start gap-3">
                <Eye className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <CardTitle className="text-2xl">Decifrando os Primeiros Sinais</CardTitle>
                  <CardDescription className="text-indigo-100">A linguagem não verbal do corpo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Como as Dores se Revelam na Postura ao Sentar</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-neutral-800 border-b-2 border-slate-300 dark:border-neutral-700">
                          <th className="text-left p-3 font-semibold text-slate-900 dark:text-white">Dor Existencial</th>
                          <th className="text-left p-3 font-semibold text-slate-900 dark:text-white">Como a Pessoa Tende a se Sentar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { dor: "Rejeição", postura: "Recolhe os pés para baixo da cadeira, buscando o mínimo contato com o solo." },
                          { dor: "Abandono", postura: "Senta de maneira relaxada, 'escarrapachada', buscando conforto e preenchendo o vazio." },
                          { dor: "Manipulação", postura: "Ocupa mais espaço, com braços esticados, demonstrando controle e domínio." },
                          { dor: "Humilhação", postura: "Senta de forma 'apertada', recolhida, com ombros curvados, transmitindo desconforto." },
                          { dor: "Troca, Traição e Exclusão", postura: "Senta de forma reta, equilibrada, comedida, demonstrando necessidade de perfeição." },
                        ].map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800/50">
                            <td className="p-3 font-medium text-slate-900 dark:text-white">{item.dor}</td>
                            <td className="p-3 text-slate-700 dark:text-slate-300">{item.postura}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Pontos-Chave de Observação no Dia a Dia</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: "Olhos", description: "A direção do olhar é um dos indicadores mais honestos. A fuga do olhar frequentemente sinaliza medo, vergonha ou insegurança." },
                      { title: "Mãos", description: "Mãos abertas e relaxadas comunicam abertura e confiança. Mãos fechadas podem indicar defesa e ansiedade." },
                      { title: "Postura", description: "Ombros caídos podem expressar tristeza ou sobrecarga. Um peito aberto comunica autoconfiança e coragem." },
                      { title: "Respiração", description: "Uma respiração curta e presa é um sinal clássico de ansiedade. Uma respiração profunda indica calma e equilíbrio." },
                    ].map((point, idx) => (
                      <Card key={idx} className="border-l-4 border-l-indigo-500 bg-white dark:bg-neutral-900">
                        <CardHeader>
                          <CardTitle className="text-base text-slate-900 dark:text-white">{point.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{point.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                ref={el => cardRefs.current["sinais"] = el}
                className={`w-full mt-6 transition-all duration-300 ${completedSections["sinais"] ? "bg-green-600 hover:bg-green-700 text-white" : "bg-slate-900 hover:bg-slate-800 text-white shadow-md"}`}
                size="lg"
                onClick={() => toggleSection("sinais")}
                disabled={completedSections["sinais"]}
              >
                {completedSections["sinais"] ? (<><CheckCircle2 className="w-4 h-4 mr-2" />Concluído ✅</>) : ("Marcar como completo")}
              </Button>
              {/* Última atividade da aba, não exibe o botão de próxima atividade */}
              <GamificationStatus />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Exercises Section */}
      <section>
        <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-start gap-3">
              <BookOpen className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <CardTitle className="text-2xl">Exercícios Práticos</CardTitle>
                <CardDescription className="text-cyan-100">Sentindo a conexão corpo-mente</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              O conhecimento só se torna sabedoria quando é vivenciado. Os exercícios a seguir foram desenhados para provar de forma inequívoca como suas emoções e pensamentos têm um impacto físico real e imediato no seu corpo.
            </p>
            <div className="space-y-4">
              {[
                { id: "exercicio1", title: "Exercício 1: O Peso das Emoções", duration: "1 minuto", steps: ["Fique em pé e estenda os dois braços à sua frente.", "Feche os olhos.", "Imagine que em um dos braços você segura uma mochila muito pesada, cheia de pedras.", "No outro braço, imagine que você segura um balão leve e colorido.", "Permaneça nesta posição por 1 minuto, sentindo o peso e a leveza.", "Abra os olhos e abaixe os braços lentamente."], message: "As emoções têm peso real no corpo. Responsabilidades e culpas pesam fisicamente sobre nós." },
                { id: "exercicio2", title: "Exercício 2: O Espelho das Expressões", duration: "1 minuto", steps: ["Fique em frente a um espelho.", "Coloque no rosto uma expressão de raiva intensa. Franza a testa, endureça a mandíbula.", "Mantenha essa expressão por 30 segundos e perceba o que acontece com o resto do seu corpo.", "Agora, relaxe o rosto e sorria genuinamente.", "Mantenha esse sorriso por 30 segundos e observe as mudanças em seu corpo."], message: "Emoções moldam não só o rosto, mas todo o corpo. Uma expressão facial ativa uma cadeia de reações físicas correspondentes." },
              ].map((exercise) => {
                const isEx1 = exercise.id === "exercicio1";
                const cardStyle = isEx1
                  ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                  : "bg-purple-50/50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800";

                return (
                  <Card key={exercise.id}
                    ref={el => cardRefs.current[exercise.id] = el}
                    className={`border-2 ${cardStyle}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-slate-900 dark:text-white">{exercise.title}</CardTitle>
                          <Badge variant="secondary" className="mt-2">⏱️ {exercise.duration}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}>
                          {expandedExercise === exercise.id ? "−" : "+"}
                        </Button>
                      </div>
                    </CardHeader>
                    {expandedExercise === exercise.id && (
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Instruções:</h4>
                          <ol className="space-y-2">
                            {exercise.steps.map((step, idx) => (
                              <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300">
                                <span className={`font-semibold flex-shrink-0 ${isEx1 ? "text-blue-600" : "text-purple-600"}`}>{idx + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div className={`border-l-4 p-4 rounded ${isEx1 ? "bg-blue-100/50 dark:bg-blue-950/30 border-blue-500" : "bg-purple-100/50 dark:bg-purple-950/30 border-purple-500"}`}>
                          <p className={`text-sm ${isEx1 ? "text-blue-900 dark:text-blue-200" : "text-purple-900 dark:text-purple-200"}`}>
                            <span className="font-semibold">Mensagem Central:</span> {exercise.message}
                          </p>
                        </div>
                        <div className={`border-l-4 p-4 rounded ${isEx1 ? "bg-blue-50 dark:bg-blue-950/50 border-blue-400" : "bg-purple-50 dark:bg-purple-950/50 border-purple-400"}`}>
                          <p className={`text-sm font-semibold mb-2 ${isEx1 ? "text-blue-900 dark:text-blue-200" : "text-purple-900 dark:text-purple-200"}`}>Diário de Bordo:</p>
                          <textarea
                            placeholder="Anote aqui suas observações e sensações durante o exercício..."
                            className={`w-full p-3 border rounded text-sm focus:outline-none focus:ring-2 dark:bg-neutral-800 dark:text-white ${isEx1
                                ? "border-blue-200 dark:border-blue-800 focus:ring-blue-500"
                                : "border-purple-200 dark:border-purple-800 focus:ring-purple-500"
                              }`}
                            rows={3}
                          />
                        </div>
                        <Button
                          className={`w-full transition-all duration-300 ${completedSections[exercise.id] ? "bg-green-600 hover:bg-green-700 text-white" : "bg-slate-900 hover:bg-slate-800 text-white shadow-md"}`}
                          onClick={() => toggleSection(exercise.id)}
                          disabled={completedSections[exercise.id]}
                        >
                          {completedSections[exercise.id] ? (<><CheckCircle2 className="w-4 h-4 mr-2" />Concluído ✅</>) : ("Marcar exercício como completo")}
                        </Button>
                        {completedSections[exercise.id] && (
                          // Check if it's the last activity in the 'exercicios' tab
                         activityMap.exercicios.indexOf(exercise.id) < activityMap.exercicios.length - 1 && (
                            <Button
                              size="sm"
                              className="w-full mt-2 bg-brand-red hover:bg-red-700 text-white shadow-md"
                              onClick={() => handleGoToNext(exercise.id, "exercicios")}
                            >
                              👉 Ir para a próxima atividade
                            </Button>
                          )
                        )}
                        <GamificationStatus />
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      {progressPercentage === 100 && (
        <div className="text-center py-8">
          <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-4 rounded-lg shadow-lg">
            <p className="text-lg font-bold mb-2">🎉 Parabéns!</p>
            <p className="text-sm">Você completou a Aula 1! Prepare-se para a próxima aula.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePageContent;

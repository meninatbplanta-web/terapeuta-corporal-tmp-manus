import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import * as Icons from "lucide-react";
import { LessonContent, Section, CardContent as CardContentType, MultimediaItem, PageStructure } from "../types";

interface DynamicLessonContentProps {
    data: LessonContent;
    pageStructure?: PageStructure;
}

const DynamicLessonContent: React.FC<DynamicLessonContentProps> = ({ data, pageStructure }) => {
    const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const tabsRef = useRef<HTMLDivElement>(null);

    // State initialization
    const [completedSections, setCompletedSections] = useState<Record<string, boolean>>(() => {
        const saved = localStorage.getItem('lms_dynamic_completedSections');
        return saved ? JSON.parse(saved) : {};
    });

    const [badges, setBadges] = useState<string[]>(() => {
        const saved = localStorage.getItem('lms_dynamic_badges');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeTab, setActiveTab] = useState<string>("");
    const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
    const [quizResult, setQuizResult] = useState<string | null>(null);

    // State for expandable sections (new schema)
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    // Initialize active tab from data
    useEffect(() => {
        const tabsSection = data.sections.find(s => s.type === 'tabs');
        if (tabsSection && tabsSection.tabs && tabsSection.tabs.length > 0 && !activeTab) {
            setActiveTab(tabsSection.tabs[0].id);
        }
    }, [data, activeTab]);

    // Gamification Logic
    const completedCount = Object.values(completedSections).filter(Boolean).length;

    // Handle missing metadata (fallback to 0 or calculate)
    const totalSections = data.metadata?.totalSections || data.sections.length; // Rough estimate if missing
    const pointsPerSection = data.metadata?.gamification?.pointsPerSection || 10;
    const userPoints = completedCount * pointsPerSection;
    const progressPercentage = totalSections > 0 ? (completedCount / totalSections) * 100 : 0;

    useEffect(() => {
        localStorage.setItem('lms_dynamic_completedSections', JSON.stringify(completedSections));
        localStorage.setItem('lms_dynamic_userPoints', userPoints.toString());
        localStorage.setItem('lms_dynamic_badges', JSON.stringify(badges));
    }, [completedSections, userPoints, badges]);

    useEffect(() => {
        const newBadges = [...badges];
        let hasChanges = false;
        const badgeConfig = data.metadata?.gamification?.badges;

        if (badgeConfig) {
            Object.entries(badgeConfig).forEach(([key, config]) => {
                if (completedCount >= config.threshold && !newBadges.includes(key)) {
                    newBadges.push(key);
                    hasChanges = true;
                }
            });
        }

        if (hasChanges) {
            setBadges(newBadges);
        }
    }, [completedCount, badges, data]);

    // Helper to get Icon component
    const getIconComponent = (iconName: string, props: any = {}) => {
        const IconComponent = (Icons as any)[iconName];
        return IconComponent ? <IconComponent {...props} /> : <Icons.HelpCircle {...props} />;
    };

    const toggleSection = (sectionId: string) => {
        if (completedSections[sectionId]) return;
        setCompletedSections((prev) => ({ ...prev, [sectionId]: true }));
    };

    const toggleExpandableSection = (sectionId: string) => {
        setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    const scrollToSection = (sectionId: string, tabId?: string) => {
        if (tabId && tabId !== activeTab) {
            setActiveTab(tabId);
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

    const handleGoToNext = (currentId: string, tabId?: string) => {
        // Simplified next logic
        // In a real app, we'd traverse the tree to find the next item
        console.log("Go to next from", currentId);
    };

    const GamificationStatus = () => (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-neutral-800/50 p-2 rounded border border-slate-100 dark:border-neutral-800">
            <div className="flex items-center gap-1.5">
                <Icons.Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{userPoints} pontos</span>
            </div>
            <span> | {completedCount} de {totalSections} lições</span>
        </div>
    );

    const handleQuizSubmit = () => {
        const quizSection = data.sections.find(s => s.type === 'quiz');
        if (!quizSection || !quizSection.questions) return;

        let score = 0;
        quizSection.questions.forEach((q) => {
            if (quizAnswers[q.id] === q.correctAnswer) {
                score++;
            }
        });
        setQuizResult(`Você acertou ${score} de ${quizSection.questions.length} questões!`);
    };

    // Helper to render a card content (reused for tabs and expandable sections)
    const renderCard = (card: any, tabId?: string) => {
        if (card.type === 'card' || card.type === 'highlight_card' || card.type === 'info_card' || card.type === 'highlight_box') {
            const isHighlight = card.type === 'highlight_card' || card.type === 'highlight_box';
            return (
                <Card key={card.id} ref={el => cardRefs.current[card.id] = el} className={`${isHighlight ? 'border-l-8 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10 rounded-r-2xl' : 'border-2 border-slate-200 dark:border-neutral-800 rounded-2xl'} overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 transition-colors mb-6`}>
                    <CardHeader className={isHighlight ? '' : 'bg-slate-50 dark:bg-neutral-900/50'}>
                        <CardTitle className={`text-xl md:text-2xl ${isHighlight ? 'text-blue-900 dark:text-blue-200 flex items-center gap-2' : 'text-slate-900 dark:text-white'}`}>
                            {isHighlight && <Icons.Brain className="w-6 h-6" />}
                            {card.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <p className={`${isHighlight ? 'text-blue-800 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'} mb-6 text-lg leading-relaxed`}>
                            {card.text}
                        </p>
                        <Button size="lg" className={`w-full py-6 text-base font-bold rounded-xl shadow-md transition-transform hover:scale-[1.01] ${completedSections[card.id] ? "bg-green-600 hover:bg-green-700" : (isHighlight ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-900 hover:bg-slate-800")} text-white`} onClick={() => toggleSection(card.id)}>
                            {completedSections[card.id] ? <><Icons.CheckCircle2 className="w-5 h-5 mr-2" />Concluído</> : (card.buttonText || "Marcar como lido")}
                        </Button>
                        <GamificationStatus />
                    </CardContent>
                </Card>
            );
        } else if (card.type === 'trait_card' || card.type === 'profile_card') {
            return (
                <Card key={card.id} ref={el => cardRefs.current[card.id] = el} className="border-2 border-slate-200 dark:border-neutral-800 hover:border-brand-red transition-all duration-300 rounded-2xl overflow-hidden group mb-6">
                    <CardHeader className="flex flex-row items-center gap-4 bg-slate-50 dark:bg-neutral-900/50 p-6">
                        <div className={`p-4 rounded-2xl bg-${card.color?.split('-')[1] || 'gray'}-100 dark:bg-${card.color?.split('-')[1] || 'gray'}-900/20 text-${card.color?.split('-')[1] || 'gray'}-500 shadow-sm group-hover:scale-110 transition-transform`}>
                            {getIconComponent(card.icon || 'Star', { size: 36 })}
                        </div>
                        <div>
                            <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-white mb-1">{card.name}</CardTitle>
                            <CardDescription className="font-bold text-brand-red text-base">{card.archetype}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6 md:p-8">
                        <div className="grid md:grid-cols-2 gap-4 text-sm md:text-base">
                            <div className="bg-slate-50 dark:bg-neutral-900 p-4 rounded-xl border border-slate-100 dark:border-neutral-800">
                                <span className="font-bold block mb-1 text-slate-700 dark:text-slate-300 uppercase text-xs tracking-wider">Corpo</span>
                                <span className="text-slate-600 dark:text-slate-400">{card.body}</span>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20">
                                <span className="font-bold block mb-1 text-red-700 dark:text-red-300 uppercase text-xs tracking-wider">Dor Principal</span>
                                <span className="text-red-600 dark:text-red-400 font-medium">{card.pain}</span>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/20 col-span-1 md:col-span-2">
                                <span className="font-bold block mb-1 text-green-800 dark:text-green-300 uppercase text-xs tracking-wider">Superpoder</span>
                                <span className="text-green-700 dark:text-green-400 font-medium">{card.power}</span>
                            </div>
                        </div>

                        <div className="relative pl-6 border-l-4 border-slate-300 dark:border-neutral-700 py-2">
                            <p className="text-base italic text-slate-600 dark:text-slate-400">"{card.story}"</p>
                        </div>

                        <Button size="lg" className={`w-full py-6 text-base font-bold rounded-xl shadow-md transition-all hover:scale-[1.01] ${completedSections[card.id] ? "bg-green-600 hover:bg-green-700" : "bg-slate-900 hover:bg-slate-800"} text-white`} onClick={() => toggleSection(card.id)}>
                            {completedSections[card.id] ? <><Icons.CheckCircle2 className="w-5 h-5 mr-2" />Estudado</> : "Marcar como estudado"}
                        </Button>
                        <GamificationStatus />
                    </CardContent>
                </Card>
            );
        } else if (card.type === 'alert_card') {
            return (
                <Card key={card.id} ref={el => cardRefs.current[card.id] = el} className="border-0 shadow-xl bg-red-50 dark:bg-red-950/20 border-l-8 border-l-red-600 rounded-r-2xl overflow-hidden mb-6">
                    <CardHeader className="bg-red-100/50 dark:bg-red-900/10 p-6 md:p-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full animate-pulse">
                                <Icons.AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl md:text-3xl text-red-700 dark:text-red-400">{card.title}</CardTitle>
                                <CardDescription className="text-red-600/80 text-lg">{card.subtitle}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6 md:p-8">
                        <p className="text-slate-800 dark:text-slate-200 font-medium text-lg leading-relaxed">
                            {card.text}
                        </p>
                        <div className="bg-white/60 dark:bg-black/40 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
                            <ul className="grid md:grid-cols-2 gap-3">
                                {card.list?.map((item: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {card.highlightBox && (
                            <div className="bg-white dark:bg-black p-6 rounded-xl border border-red-200 dark:border-red-900 shadow-sm">
                                <p className="font-bold text-center text-red-600 text-lg">
                                    {typeof card.highlightBox === 'string' ? card.highlightBox : card.highlightBox.text}
                                </p>
                            </div>
                        )}
                        <Button size="lg" className={`w-full mt-4 py-6 text-base font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] ${completedSections[card.id] ? "bg-green-600" : "bg-red-600 hover:bg-red-700"}`} onClick={() => toggleSection(card.id)}>
                            {completedSections[card.id] ? <><Icons.CheckCircle2 className="w-5 h-5 mr-2" />Lido e Entendido</> : card.buttonText}
                        </Button>
                        <GamificationStatus />
                    </CardContent>
                </Card>
            );
        } else if (card.type === 'exercise_card') {
            return (
                <Card key={card.id} className="border-2 border-cyan-200 dark:border-cyan-900 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md mb-6">
                    <CardHeader className="cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/10 transition-colors" onClick={() => setExpandedExercise(expandedExercise === card.id ? null : card.id)}>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg md:text-xl text-slate-900 dark:text-white">{card.title}</CardTitle>
                            <Button variant="ghost" size="sm" className="rounded-full">
                                {expandedExercise === card.id ? "−" : "👇 Abrir"}
                            </Button>
                        </div>
                    </CardHeader>
                    {expandedExercise === card.id && (
                        <CardContent className="space-y-6 p-6 animate-fade-in">
                            <div className="bg-cyan-50 dark:bg-cyan-900/10 p-6 rounded-xl">
                                <ol className="list-decimal pl-5 space-y-3 text-slate-700 dark:text-slate-300 text-base">
                                    {card.instructions?.map((inst: string, i: number) => (
                                        <li key={i}>{inst}</li>
                                    ))}
                                </ol>
                            </div>
                            <textarea
                                placeholder={card.placeholder}
                                className="w-full p-4 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 shadow-inner min-h-[150px]"
                            />
                            <Button size="lg" className={`w-full py-6 text-base font-bold rounded-xl shadow-md transition-transform hover:scale-[1.02] ${completedSections[card.id] ? "bg-green-600" : "bg-cyan-600 hover:bg-cyan-700"}`} onClick={() => toggleSection(card.id)}>
                                {completedSections[card.id] ? <><Icons.CheckCircle2 className="w-5 h-5 mr-2" />Exercício Concluído</> : card.buttonText}
                            </Button>
                            <GamificationStatus />
                        </CardContent>
                    )}
                </Card>
            );
        } else if (card.type === 'quiz_card') {
            return (
                <Card key={card.id} className="border-0 shadow-xl bg-slate-50 dark:bg-neutral-900 border-t-8 border-t-amber-500 rounded-2xl overflow-hidden mb-6">
                    <CardContent className="space-y-8 p-6 md:p-8 mt-6">
                        {card.questions?.map((q: any) => (
                            <div key={q.id} className="space-y-3 bg-white dark:bg-black p-6 rounded-xl border border-slate-100 dark:border-neutral-800 shadow-sm">
                                <p className="font-bold text-lg text-slate-800 dark:text-slate-200">{q.id}. {q.question}</p>
                                <div className="flex gap-3 flex-wrap">
                                    {q.options.map((opt: string) => (
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
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 md:space-y-12 mt-8 md:mt-12">
            {/* Dashboard Section - Only render if we have header data or pageStructure gamification */}
            {(data.header || pageStructure?.gamification_bar) && (
                <div className="bg-slate-50 dark:bg-neutral-900/50 rounded-2xl p-6 md:p-8 mb-8 border border-slate-100 dark:border-neutral-800 shadow-sm">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                        <div className="w-full md:w-1/2 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    {data.header?.progressLabel || pageStructure?.gamification_bar?.label || "Seu Progresso"}
                                </span>
                                <span className="text-slate-500 font-medium">{completedCount} de {totalSections} atividades</span>
                            </div>
                            <Progress value={progressPercentage} className="h-4 rounded-full bg-slate-200 dark:bg-neutral-800" />
                        </div>

                        <div className="w-full md:w-auto flex items-center gap-4 bg-white dark:bg-black px-5 py-3 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm transition-transform hover:scale-105 duration-300">
                            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                                <Icons.Trophy className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            </div>
                            <div>
                                <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Sua Pontuação</span>
                                <span className="block text-2xl font-bold text-slate-900 dark:text-white">{userPoints} <span className="text-sm font-normal text-slate-500">XP</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Render Sections */}
            {data.sections.map((section) => {
                switch (section.type) {
                    case 'intro':
                    case 'text_block':
                        return (
                            <section key={section.id}>
                                <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 md:p-8">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                                <Icons.Zap className="w-8 h-8 text-yellow-300" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl md:text-3xl mb-2">{section.title}</CardTitle>
                                                <CardDescription className="text-blue-100 text-base md:text-lg">
                                                    {section.subtitle}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 md:p-8">
                                        {Array.isArray(section.content) && section.content.map((paragraph, idx) => (
                                            <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 text-base md:text-lg" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                        ))}
                                    </CardContent>
                                </Card>
                            </section>
                        );

                    case 'navigation':
                    case 'navigation_grid':
                        return (
                            <section key={section.id} className="py-4">
                                {section.title && (
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            <Icons.Layers size={16} />
                                            {section.title}
                                        </h3>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                    {section.items && (section.items as any[]).map((item: any, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => scrollToSection(item.target, item.tab)}
                                            className="flex flex-col items-center justify-center p-4 rounded-xl border bg-white border-slate-200 dark:bg-neutral-900 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md transition-all duration-300 gap-3 text-center h-full group"
                                        >
                                            <div className="p-2 bg-slate-50 dark:bg-neutral-800 rounded-full group-hover:bg-white dark:group-hover:bg-neutral-700 transition-colors">
                                                {getIconComponent(item.icon, { className: "w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" })}
                                            </div>
                                            <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">
                                                {item.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        );

                    case 'multimedia':
                        return (
                            <div key={section.id} className="flex flex-col gap-6 mb-8">
                                {section.items && (section.items as MultimediaItem[]).map((item) => (
                                    <Card key={item.id} ref={el => cardRefs.current[item.id] = el} className="bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
                                        <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
                                            <div className={`p-4 ${item.mediaType === 'audio' || item.type === 'audio' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'} rounded-full mb-2`}>
                                                {item.mediaType === 'audio' || item.type === 'audio' ?
                                                    <Icons.Headphones className="w-10 h-10 text-blue-600 dark:text-blue-400" /> :
                                                    <Icons.Video className="w-10 h-10 text-green-600 dark:text-green-400" />
                                                }
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                                <p className="text-sm text-slate-500">{item.subtitle}</p>
                                            </div>

                                            <div className={`w-full ${item.mediaType === 'video' || item.type === 'video' ? 'bg-black' : 'bg-white dark:bg-black'} rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-inner overflow-hidden mb-4 p-4`}>
                                                {item.mediaType === 'audio' || item.type === 'audio' ? (
                                                    <audio controls className="w-full h-10">
                                                        <source src={item.url} type="audio/mp4" />
                                                        Seu navegador não suporta áudio.
                                                    </audio>
                                                ) : (
                                                    <div className="aspect-video w-full">
                                                        <video controls className="w-full h-full">
                                                            <source src={item.url} type="video/mp4" />
                                                            Seu navegador não suporta vídeo.
                                                        </video>
                                                    </div>
                                                )}
                                            </div>

                                            <Button size="lg" className={`w-full py-6 text-base font-bold shadow-lg transition-all hover:scale-[1.02] ${completedSections[item.id] ? "bg-green-600 hover:bg-green-700" : "bg-slate-900 hover:bg-slate-800"} text-white rounded-xl`} onClick={() => toggleSection(item.id)}>
                                                {completedSections[item.id] ? <><Icons.CheckCircle2 className="w-5 h-5 mr-2" />Concluído</> : item.buttonText}
                                            </Button>
                                            <GamificationStatus />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        );

                    case 'tabs':
                        return (
                            <Tabs key={section.id} ref={tabsRef} value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                                <div className="sticky top-0 z-20 bg-gray-50/95 dark:bg-brand-darker/95 backdrop-blur-sm py-4 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:backdrop-blur-none">
                                    <TabsList className="flex w-full justify-start gap-3 bg-transparent p-0 h-auto overflow-x-auto scrollbar-hide pb-2">
                                        {section.tabs?.map(tab => (
                                            <TabsTrigger key={tab.id} value={tab.id} className="rounded-full px-6 py-2.5 h-auto text-sm font-bold transition-all duration-300 data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800 flex-shrink-0">
                                                {tab.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>

                                {section.tabs?.map(tab => (
                                    <TabsContent key={tab.id} value={tab.id} className="space-y-8 animate-fade-in">
                                        <div className="space-y-8">
                                            {tab.content.map(card => renderCard(card, tab.id))}
                                        </div>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        );

                    case 'expandable_section':
                        return (
                            <section key={section.id} className="mb-6">
                                <div
                                    className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
                                    onClick={() => toggleExpandableSection(section.id)}
                                >
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{section.title}</h3>
                                    <Button variant="ghost" size="sm" className="rounded-full">
                                        {expandedSections[section.id] ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                                    </Button>
                                </div>

                                {expandedSections[section.id] && (
                                    <div className="mt-4 space-y-6 animate-fade-in">
                                        {Array.isArray(section.content) ? (
                                            section.content.map((card: any) => renderCard(card))
                                        ) : (
                                            // Single object content (like exercise or quiz in new schema)
                                            renderCard(section.content)
                                        )}
                                        {section.items && (section.items as any[]).map((item: any) => (
                                            // Handle items in expandable section (like multimedia)
                                            renderCard(item)
                                        ))}
                                    </div>
                                )}
                            </section>
                        );

                    case 'exercise':
                        const exContent = section.content as any;
                        return (
                            <section key={section.id} id="exercises-section">
                                <Card className="border-0 shadow-xl bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 md:p-8">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                                <Icons.BookOpen className="w-8 h-8 text-cyan-100" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl md:text-3xl">{section.title}</CardTitle>
                                                <CardDescription className="text-cyan-100 text-lg">{section.subtitle}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 md:p-8">
                                        {renderCard({
                                            ...exContent,
                                            type: 'exercise_card'
                                        })}
                                    </CardContent>
                                </Card>
                            </section>
                        );

                    case 'quiz':
                        return (
                            <section key={section.id} id="quiz-section">
                                <Card className="border-0 shadow-xl bg-slate-50 dark:bg-neutral-900 border-t-8 border-t-amber-500 rounded-2xl overflow-hidden">
                                    <CardHeader className="bg-amber-50 dark:bg-amber-900/10 p-6 md:p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                                                <Icons.Brain className="w-8 h-8 text-amber-600" />
                                            </div>
                                            <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-white">{section.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-8 p-6 md:p-8">
                                        {renderCard({
                                            id: 'quiz_card_internal',
                                            type: 'quiz_card',
                                            questions: section.questions
                                        })}
                                    </CardContent>
                                </Card>
                            </section>
                        );

                    case 'footer':
                    case 'simple_footer':
                        return (
                            <div key={section.id} className="border-t border-gray-200 dark:border-neutral-800 pt-8 pb-12">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 text-center md:text-left">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400">{section.subtitle}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-neutral-800 px-6 py-3 rounded-full">
                                        <Icons.Trophy className="w-6 h-6 text-amber-500" />
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

                                {section.links && (
                                    <div className="flex justify-center gap-4 mt-8 text-sm text-slate-500">
                                        {section.links.map((link: any, i: number) => (
                                            <a key={i} href={link.url} className="hover:underline">{link.label}</a>
                                        ))}
                                    </div>
                                )}
                                {section.copyright && (
                                    <div className="text-center mt-4 text-xs text-slate-400">
                                        {section.copyright}
                                    </div>
                                )}
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default DynamicLessonContent;

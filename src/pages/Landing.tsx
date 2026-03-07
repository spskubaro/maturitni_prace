import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mountain, Clock, TrendingUp, Users, Award, Target, Star, CheckCircle2, HelpCircle, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".scroll-animate").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Clock,
      title: "Sledování času",
      description: "Zaznamenávej aktivity a měř svůj pokrok v reálném čase",
    },
    {
      icon: Mountain,
      title: "20 světových hor",
      description: "Od Matterhornu po Mount Everest - každá hora je nová výzva",
    },
    {
      icon: Award,
      title: "Bodový systém",
      description: "Získávej body za produktivitu a odemykej nové vrcholy",
    },
    {
      icon: TrendingUp,
      title: "Statistiky",
      description: "Sleduj svůj pokrok a zlepšuj se každý den",
    },
    {
      icon: Users,
      title: "Žebříček",
      description: "Porovnej se s ostatními uživateli v real-time",
    },
    {
      icon: Target,
      title: "Cíle",
      description: "Vytvoř si vlastní návyky a dosahuj svých cílů",
    },
  ];


  const faqs = [

    {
      question: "Jak funguje bodový systém?",
      answer: "Každá aktivita ti přinese body podle délky a typu. Body používáš k postupu na horách a odemykání nových vrcholů.",
    },
    {
      question: "Kolik hor mohu zdolat?",
      answer: "Máme 20 nejslavnějších hor světa - od Matterhornu po Mount Everest. Každá hora má různou obtížnost a výšku.",
    },
    {
      question: "Můžu používat na mobilu?",
      answer: "Ano! ClimbFlow je responzivní webová aplikace, která funguje skvěle na všech zařízeních.",
    },
  ];

  return (
    <div className="min-h-screen">
      <section
        className="relative h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 text-center text-white">
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            Zdolej své cíle
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Jednu horu po druhé
            </span>
          </h1>
          <p className={`text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto ${isVisible ? 'animate-fade-in animation-delay-200' : 'opacity-0'}`}>
            Sleduj čas, získávej body a zdolávej světové hory
          </p>
          <div className={`flex gap-4 justify-center flex-wrap ${isVisible ? 'animate-fade-in animation-delay-400' : 'opacity-0'}`}>
            <Link to="/auth?tab=signup">
              <Button size="lg" className="text-lg px-8 shadow-lg hover:shadow-xl transition-shadow">
                Registrovat se
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 backdrop-blur hover:bg-white/20 transition-colors border-white/20 text-white hover:text-white">
                Už mám účet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background scroll-animate opacity-0">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Všechno co potřebuješ
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Jednoduché nástroje pro sledování produktivity
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16 scroll-animate opacity-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Jak to funguje?</h2>
            <p className="text-xl text-muted-foreground">
              Tři jednoduché kroky k tvým cílům
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20 scroll-animate opacity-0">
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">1. Měř čas</h3>
                <p className="text-muted-foreground">
                  Spusť časovač pro jakoukoli aktivitu - studium, cvičení, práci
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary/70 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">2. Získej body</h3>
                <p className="text-muted-foreground">
                  Každá aktivita ti přinese body podle délky a typu
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Mountain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">3. Zdolej horu</h3>
                <p className="text-muted-foreground">
                  Postupuj na vrchol a odemkni další výzvy
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-animate opacity-0">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
                  <CardContent className="pt-6">
                    <Icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>


      <section className="py-20 bg-muted/30">
        <div className="container max-w-3xl">
          <div className="text-center mb-16 scroll-animate opacity-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Často kladené otázky</h2>
            <p className="text-xl text-muted-foreground">
              Vše, co potřebuješ vědět
            </p>
          </div>

          <div className="space-y-4 scroll-animate opacity-0">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary via-primary to-secondary text-white relative overflow-hidden scroll-animate opacity-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="absolute inset-0 flex items-end justify-around opacity-10 pointer-events-none">
          <Mountain className="w-32 h-32 animate-pulse" style={{ animationDuration: '3s' }} />
          <Mountain className="w-40 h-40 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <Mountain className="w-36 h-36 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
        </div>

        <div className="container text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Začni svou cestu
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto animate-fade-in animation-delay-200">
            Vytvoř si účet a zdolej svou první horu
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-fade-in animation-delay-400">
            <Link to="/auth?tab=signup">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-6 shadow-2xl hover:shadow-xl transition-all hover:scale-105 group">
                Registrovat se
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 bg-white/10 backdrop-blur hover:bg-white/20 border-white/30 hover:border-white/50 transition-all">
                Přihlásit se
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

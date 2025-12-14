import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChevronDown } from "lucide-react";

const fallbackPlaceholder = "/placeholder.svg";

const teamMembers = [
  // Chief Team
  {
    name: "Alice Ho",
    role: "Chief Executive Officer",
    image: "/team/AliceHo.png",
    bio: "Leading Thrive's vision and strategic direction with a passion for wellness and innovation.",
    department: "Chief Team"
  },
  {
    name: "Lily Elsea",
    role: "Chief Financial Officer",
    image: "/team/LilyElsea.png",
    bio: "Overseeing financial strategy and ensuring sustainable growth for Thrive.",
    department: "Chief Team"
  },
  {
    name: "Hita Khandelwal",
    role: "Chief Design Officer",
    image: "/team/HitaKhandelwal.png",
    bio: "Shaping Thrive's visual identity and user experience with creative excellence.",
    department: "Chief Team"
  },
  {
    name: "Macy Evans",
    role: "Chief Administrative Officer",
    image: "/team/MacyEvans.png",
    bio: "Ensuring operational excellence and organizational effectiveness at Thrive.",
    department: "Chief Team"
  },
  {
    name: "Mary Howard",
    role: "Chief Marketing Officer",
    image: "/team/MaryHoward.png",
    bio: "Driving brand awareness and customer engagement through innovative marketing strategies.",
    department: "Chief Team"
  },
  {
    name: "Vinanya Penumadula",
    role: "Chief Sales Officer",
    image: "/team/VinanyaPenumadula.png",
    bio: "Leading sales initiatives and building strong customer relationships.",
    department: "Chief Team"
  },

  // Accounting Team
  {
    name: "Ansh Jain",
    role: "Financial Analyst",
    image: "/team/AnshJain.png",
    bio: "Analyzing financial data to support strategic decision-making.",
    department: "Accounting"
  },
  {
    name: "Siyansh Virmani",
    role: "Accountant",
    image: "/team/SiyanshVirmani.png",
    bio: "Managing financial records and ensuring compliance with regulations.",
    department: "Accounting"
  },
  {
    name: "Alex Wohlfahrt",
    role: "Financial Associate",
    image: "/team/AlexWohlfahrt.png",
    bio: "Supporting financial operations and reporting.",
    department: "Accounting"
  },

  // Creative Services
  {
    name: "Ronika Gajulapalli",
    role: "Graphic Designer",
    image: "/team/RonikaGajulapalli.png",
    bio: "Creating visually stunning designs that bring our brand to life.",
    department: "Creative Services"
  },
  {
    name: "Grace Helbing",
    role: "UX/UI Designer",
    image: "/team/GraceHelbing.png",
    bio: "Designing intuitive and engaging user experiences.",
    department: "Creative Services"
  },
  {
    name: "Eshan Khan",
    role: "Creative Director",
    image: "/team/EshanKhan.png",
    bio: "Leading creative direction and visual storytelling.",
    department: "Creative Services"
  },

  // Sales
  {
    name: "Dumitru Busuioc",
    role: "Sales Representative",
    image: "/team/DumitruBusuioc.png",
    bio: "Building relationships and driving sales growth.",
    department: "Sales"
  },
  {
    name: "Ishaan Manoor",
    role: "Sales Person",
    image: "/team/IshaanManoor.png",
    bio: "Managing client relationships and ensuring customer satisfaction.",
    department: "Sales"
  },

  // Marketing
  {
    name: "Reece Clavey",
    role: "Marketing Specialist",
    image: "/team/ReeceClavey.png",
    bio: "Developing and executing marketing campaigns.",
    department: "Marketing"
  },
  {
    name: "Eshanvi Sharma",
    role: "Digital Marketer",
    image: "/team/EshanviSharma.png",
    bio: "Optimizing our digital presence and online marketing efforts.",
    department: "Marketing"
  },
  {
    name: "Carter Shaw",
    role: "Content Strategist",
    image: "/team/CarterShaw.png",
    bio: "Crafting compelling content that resonates with our audience.",
    department: "Marketing"
  },

  // Human Resources
  {
    name: "Ethan Hsu",
    role: "HR Specialist",
    image: "/team/EthanHsu.png",
    bio: "Supporting employee development and organizational culture.",
    department: "Human Resources"
  },
  {
    name: "Munis Kodirova",
    role: "Talent Acquisition",
    image: "/team/MunisKodirova.png",
    bio: "Finding and nurturing top talent for Thrive.",
    department: "Human Resources"
  },
  {
    name: "Ryan Lucas",
    role: "HR Coordinator",
    image: "/team/RyanLucas.png",
    bio: "Ensuring smooth HR operations and employee support.",
    department: "Human Resources"
  }
];

const departmentOrder = [
  "Chief Team",
  "Accounting",
  "Creative Services",
  "Sales",
  "Marketing",
  "Human Resources",
];

const teamImages = teamMembers.map((member) => member.image);

const membersByDepartment = departmentOrder
  .map((department) => ({
    department,
    members: teamMembers.filter((member) => member.department === department),
  }))
  .filter((group) => group.members.length > 0);

export default function Team() {
  useEffect(() => {
    let gsapInstance: any = null;
    let tickerAdded = false;
    let onMove: ((e: MouseEvent) => void) | null = null;
    let isInHero = true;
    let onScroll: (() => void) | null = null;

    const ensureGsap = () =>
      new Promise<void>((resolve, reject) => {
        if ((window as any).gsap) return resolve();
        const existing = document.querySelector('script[data-gsap-inline="true"]');
        if (existing) {
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () => reject(new Error("Failed to load GSAP")));
          return;
        }
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
        s.async = true;
        s.setAttribute("data-gsap-inline", "true");
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load GSAP"));
        document.head.appendChild(s);
      });

    ensureGsap()
      .then(() => {
        gsapInstance = (window as any).gsap;
        if (!gsapInstance) return;

        const images = gsapInstance.utils.toArray(".hero-trail-image") as HTMLElement[];
        if (!images.length) return;

        const gap = 200;
        let index = 0;
        const wrapper = gsapInstance.utils.wrap(0, images.length);
        gsapInstance.defaults({ duration: 1 });

        let mousePos = { x: 0, y: 0 };
        let lastMousePos = { x: 0, y: 0 };
        let cachedMousePos = { x: 0, y: 0 };

        const heroSection = document.querySelector('[data-team-hero="true"]') as HTMLElement | null;
        const updateInHero = () => {
          if (!heroSection) return;
          const rect = heroSection.getBoundingClientRect();
          // Only spawn trails while hero section is visible (scrolling within it)
          isInHero = rect.top <= 0 && rect.bottom > 0;
          // Clear all trail images when leaving hero section
          if (!isInHero) {
            gsapInstance.set(images, { opacity: 0, clearProps: "all" });
          }
        };
        updateInHero();
        onScroll = () => updateInHero();
        window.addEventListener("scroll", onScroll, { passive: true });

        onMove = (e: MouseEvent) => {
          // Only track mouse position when in hero section
          if (isInHero) {
            mousePos = { x: e.clientX, y: e.clientY };
          }
        };
        window.addEventListener("mousemove", onMove);

        const animateImage = () => {
          const wrappedIndex = wrapper(index);
          const img = images[wrappedIndex] as HTMLElement;
          gsapInstance.killTweensOf(img);
          gsapInstance.set(img, { clearProps: "all" });
          gsapInstance.set(img, {
            opacity: 1,
            left: mousePos.x,
            top: mousePos.y,
            xPercent: -50,
            yPercent: -50,
          });
          const tl = gsapInstance.timeline();
          tl.from(img, { scale: 0.8, duration: 2 }, "<").to(
            img,
            {
              y: "120vh",
              rotation: gsapInstance.utils.random([360, -360]),
              ease: "back.in(.4)",
              duration: 1,
              filter: "blur(5px)",
            },
            0
          );
          index++;
        };

        const imageTrail = () => {
          if (!isInHero) {
            // Ensure all trail images are hidden when we scroll past the hero
            gsapInstance.set(images, { opacity: 0, clearProps: "filter,transform" });
            return;
          }
          const travelDistance = Math.hypot(lastMousePos.x - mousePos.x, lastMousePos.y - mousePos.y);
          cachedMousePos.x = gsapInstance.utils.interpolate(cachedMousePos.x || mousePos.x, mousePos.x, 0.1);
          cachedMousePos.y = gsapInstance.utils.interpolate(cachedMousePos.y || mousePos.y, mousePos.y, 0.1);

          if (travelDistance > gap) {
            animateImage();
            lastMousePos = { ...mousePos };
          }
        };

        gsapInstance.ticker.add(imageTrail);
        tickerAdded = true;
        // store for cleanup
        (window as any).__teamImageTrail = imageTrail;
      })
      .catch(() => {
        // silently ignore if GSAP fails to load
      });

    return () => {
      if (onMove) window.removeEventListener("mousemove", onMove);
      if (gsapInstance && tickerAdded && (window as any).__teamImageTrail) {
        gsapInstance.ticker.remove((window as any).__teamImageTrail);
      }
      if (onScroll) window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section with GSAP image trail */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#050b1e] to-background text-white"
        data-team-hero="true"
      >
        <style>{`
          .hero-trail {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            position: relative;
          }
          .hero-trail-title {
            font-size: clamp(2.25rem, 9vw, 6.5rem);
            font-weight: 700;
            line-height: 1.05;
            text-align: center;
            letter-spacing: -0.02em;
          }
          .hero-trail-image {
            position: fixed;
            opacity: 0;
            width: 140px;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            pointer-events: none;
            border-radius: 18px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.35);
          }
          @media (max-width: 640px) {
            .hero-trail-image { width: 100px; }
          }
        `}</style>

        {/* Gradient and dots background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 matrix-dots opacity-5" aria-hidden="true"></div>
        </div>

        {/* Content */}
        <div className="hero-trail relative z-10 px-4">
          <h1 className="hero-trail-title">Our Team</h1>
          <div className="hero-trail-images" aria-hidden="true">
            {teamImages.map((src, idx) => (
              <img
                key={idx}
                className="hero-trail-image"
                src={src}
                loading="lazy"
                alt=""
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== window.location.origin + fallbackPlaceholder) {
                    target.src = fallbackPlaceholder;
                  }
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Scroll Indicator */}
      <button
        type="button"
        aria-label="Scroll down"
        onClick={() => window.scrollTo({ behavior: 'smooth', top: window.innerHeight })}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce z-20 hover:opacity-90 focus:outline-none"
      >
        <ChevronDown className="w-8 h-8 text-white/80" />
      </button>

      <main className="flex-1 py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {membersByDepartment.map((group, groupIndex) => (
            <section key={group.department} className="mb-32">
              {/* Department Header */}
              <div className="mb-16 text-center">
                <h2 className="font-display text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                  {group.department}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-glacier to-primary mx-auto" />
              </div>

              {/* Team Grid - Modern Humaan-style layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {group.members.map((member, idx) => (
                  <div
                    key={member.name}
                    className="group relative animate-fade-in-up"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-navy-medium border border-white/10 transition-all duration-300 hover:border-glacier/50 hover:shadow-2xl hover:shadow-glacier/20 hover:-translate-y-2">
                      {/* Image Container */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-navy-deep to-navy-medium">
                        <img
                          src={member.image}
                          alt={member.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (target.src !== window.location.origin + fallbackPlaceholder) {
                              target.src = fallbackPlaceholder;
                            }
                          }}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      </div>

                      {/* Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                        <h3 className="font-display text-2xl font-bold text-white mb-1 tracking-tight">
                          {member.name}
                        </h3>
                        <p className="text-glacier font-semibold text-sm mb-2 tracking-wide">
                          {member.role}
                        </p>
                        <p className="text-white/70 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-32 overflow-hidden">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { FaDiscord, FaTwitter, FaYoutube, FaMedium } from "react-icons/fa";
import clsx from "clsx";

// Placeholder for GSAP - we'll use CSS animations instead for now
const gsap = {
  to: () => {},
  set: () => {},
  from: () => {},
  timeline: () => ({ to: () => {}, from: () => {} }),
  context: () => ({ revert: () => {} }),
  registerPlugin: () => {}
};

const ScrollTrigger = {};

// Mock useGSAP hook
const useGSAP = () => {};

// Mock useWindowScroll hook
const useWindowScroll = () => ({ y: 0 });

// Button Component
const Button = ({ id, title, rightIcon, leftIcon, containerClass, onClick }) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={clsx(
        "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black",
        containerClass
      )}
    >
      {leftIcon}

      <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
        <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </div>
        <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </div>
      </span>

      {rightIcon}
    </button>
  );
};

// AnimatedTitle Component
const AnimatedTitle = ({ title, containerClass, className }) => {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className={clsx("animated-title", containerClass, className)}>
      {title.split("<br />").map((line, index) => (
        <div
          key={index}
          className="flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3"
        >
          {line.split(" ").map((word, idx) => (
            <span
              key={idx}
              className="animated-word opacity-100"
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// VideoPreview Component
const VideoPreview = ({ children }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="absolute z-50 size-full overflow-hidden rounded-lg"
      style={{ perspective: "500px" }}
    >
      <div
        ref={contentRef}
        className="origin-center rounded-lg"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </section>
  );
};

// BentoTilt Component
const BentoTilt = ({ children, className = "" }) => {
  const itemRef = useRef(null);

  return (
    <div
      ref={itemRef}
      className={className}
    >
      {children}
    </div>
  );
};

// BentoCard Component
const BentoCard = ({ src, title, description, isComingSoon }) => {
  const hoverButtonRef = useRef(null);

  return (
      {/* Placeholder for video - using gradient background instead */}
      <div className="absolute left-0 top-0 size-full bg-gradient-to-br from-purple-600 to-blue-600" />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
          >
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ImageClipBox Component
const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    {/* Placeholder for images - using colored divs */}
    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600" />
  </div>
);

// Main Landing Page Component
interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  // NavBar state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const currentScrollY = 0; // Mock scroll position
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hero state
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(4); // Mock all videos loaded
  const totalVideos = 4;
  const nextVdRef = useRef(null);

  // Story state
  const frameRef = useRef(null);

  const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];
  const socialLinks = [
    { href: "https://discord.com", icon: <FaDiscord /> },
    { href: "https://twitter.com", icon: <FaTwitter /> },
    { href: "https://youtube.com", icon: <FaYoutube /> },
    { href: "https://medium.com", icon: <FaMedium /> },
  ];

  // NavBar functions
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  // Mock video source
  const getVideoSrc = (index) => `#video-${index}`;

  // Story functions
  const handleMouseMove = (e) => {
    // Simplified mouse interaction
  };

  const handleMouseLeave = () => {
    // Simplified mouse interaction
  };

  // Effects
  // Simplified effects without GSAP

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      {/* NavBar */}
      <div
        ref={navContainerRef}
        className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
      >
        <header className="absolute top-1/2 w-full -translate-y-1/2">
          <nav className="flex size-full items-center justify-between p-4">
            <div className="flex items-center gap-7">
              {/* Placeholder logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg" />
              <Button
                id="product-button"
                title="Products"
                rightIcon={<TiLocationArrow />}
                containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
              />
            </div>

            <div className="flex h-full items-center">
              <div className="hidden md:block">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.toLowerCase()}`}
                    className="nav-hover-btn"
                  >
                    {item}
                  </a>
                ))}
              </div>

              <button
                onClick={toggleAudioIndicator}
                className="ml-10 flex items-center space-x-0.5"
              >
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={clsx("indicator-line", {
                      active: isIndicatorActive,
                    })}
                    style={{
                      animationDelay: `${bar * 0.1}s`,
                    }}
                  />
                ))}
              </button>
            </div>
          </nav>
        </header>
      </div>

      {/* Hero */}
      <div className="relative h-dvh w-screen overflow-x-hidden">
        {loading && (
          <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        )}

        <div
          id="video-frame"
          className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
        >
          <div>
            <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
              <VideoPreview>
                <div
                  onClick={handleMiniVdClick}
                  className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
                >
                  {/* Placeholder for video */}
                  <div className="size-64 origin-center scale-150 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg" />
                </div>
              </VideoPreview>
            </div>

            {/* Placeholder for background video */}
            <div className="absolute left-0 top-0 size-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
          </div>

          <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
            G<b>A</b>MING
          </h1>

          <div className="absolute left-0 top-0 z-40 size-full">
            <div className="mt-24 px-5 sm:px-10">
              <h1 className="special-font hero-heading text-blue-100">
                redefi<b>n</b>e
              </h1>

              <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
                Enter the Metagame Layer <br /> Unleash the Play Economy
              </p>

              <Button
                id="watch-trailer"
                title="Watch trailer"
                leftIcon={<TiLocationArrow />}
                containerClass="bg-yellow-300 flex-center gap-1"
                onClick={onEnterApp}
              />
            </div>
          </div>
        </div>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
          G<b>A</b>MING
        </h1>
      </div>

      {/* About */}
      <div id="about" className="min-h-screen w-screen">
        <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
          <p className="font-general text-sm uppercase md:text-[10px]">
            Welcome to Zentry
          </p>

          <AnimatedTitle
            title="Disc<b>o</b>ver the world's <br /> largest shared <b>a</b>dventure"
            containerClass="mt-5 !text-black text-center"
          />

          <div className="about-subtext">
            <p>The Game of Games begins—your life, now an epic MMORPG</p>
            <p className="text-gray-500">
              Zentry unites every player from countless games and platforms, both
              digital and physical, into a unified Play Economy
            </p>
          </div>
        </div>

        <div className="h-dvh w-screen" id="clip">
          <div className="mask-clip-path about-image">
            {/* Placeholder for about image */}
            <div className="absolute left-0 top-0 size-full bg-gradient-to-br from-green-400 to-blue-500" />
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="bg-black pb-52">
        <div className="container mx-auto px-3 md:px-10">
          <div className="px-5 py-32">
            <p className="font-circular-web text-lg text-blue-50">
              Into the Metagame Layer
            </p>
            <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
              Immerse yourself in a rich and ever-expanding universe where a vibrant
              array of products converge into an interconnected overlay experience
              on your world.
            </p>
          </div>

          <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
            <BentoCard
              src="videos/feature-1.mp4"
              title={
                <>
                  radia<b>n</b>t
                </>
              }
              description="A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adventure."
              isComingSoon
            />
          </BentoTilt>

          <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
            <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
              <BentoCard
                src="videos/feature-2.mp4"
                title={
                  <>
                    zig<b>m</b>a
                  </>
                }
                description="An anime and gaming-inspired NFT collection - the IP primed for expansion."
                isComingSoon
              />
            </BentoTilt>

            <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
              <BentoCard
                src="videos/feature-3.mp4"
                title={
                  <>
                    n<b>e</b>xus
                  </>
                }
                description="A gamified social hub, adding a new dimension of play to social interaction for Web3 communities."
                isComingSoon
              />
            </BentoTilt>

            <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
              <BentoCard
                src="videos/feature-4.mp4"
                title={
                  <>
                    az<b>u</b>l
                  </>
                }
                description="A cross-world AI Agent - elevating your gameplay to be more fun and productive."
                isComingSoon
              />
            </BentoTilt>

            <BentoTilt className="bento-tilt_2">
              <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
                <h1 className="bento-title special-font max-w-64 text-black">
                  M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
                </h1>

                <TiLocationArrow className="m-5 scale-[5] self-end" />
              </div>
            </BentoTilt>

            <BentoTilt className="bento-tilt_2">
              {/* Placeholder for feature video */}
              <div className="size-full bg-gradient-to-br from-red-500 to-pink-600" />
            </BentoTilt>
          </div>
        </div>
      </section>

      {/* Story */}
      <div id="story" className="min-h-dvh w-screen bg-black text-blue-50">
        <div className="flex size-full flex-col items-center py-10 pb-24">
          <p className="font-general text-sm uppercase md:text-[10px]">
            the multiversal ip world
          </p>

          <div className="relative size-full">
            <AnimatedTitle
              title="the st<b>o</b>ry of <br /> a hidden real<b>m</b>"
              containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10"
            />

            <div className="story-img-container">
              <div className="story-img-mask">
                <div className="story-img-content">
                  <img
                    ref={frameRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseLeave}
                    onMouseEnter={handleMouseLeave}
                    alt="entrance.webp"
                    className="object-contain"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23667eea'/%3E%3C/svg%3E"
                  />
                </div>
              </div>

              <svg
                className="invisible absolute size-0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id="flt_tag">
                    <feGaussianBlur
                      in="SourceGraphic"
                      stdDeviation="8"
                      result="blur"
                    />
                    <feColorMatrix
                      in="blur"
                      mode="matrix"
                      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                      result="flt_tag"
                    />
                    <feComposite
                      in="SourceGraphic"
                      in2="flt_tag"
                      operator="atop"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>

          <div className="-mt-80 flex w-full justify-center md:-mt-64 md:me-44 md:justify-end">
            <div className="flex h-full w-fit flex-col items-center md:items-start">
              <p className="mt-3 max-w-sm text-center font-circular-web text-violet-50 md:text-start">
                Where realms converge, lies Zentry and the boundless pillar.
                Discover its secrets and shape your fate amidst infinite
                opportunities.
              </p>

              <Button
                id="realm-btn"
                title="discover prologue"
                containerClass="mt-5"
                onClick={onEnterApp}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div id="contact" className="my-20 min-h-96 w-screen px-10">
        <div className="relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden">
          <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
            <ImageClipBox
              src="placeholder"
              clipClass="contact-clip-path-1"
            />
            <ImageClipBox
              src="placeholder"
              clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
            />
          </div>

          <div className="absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80">
            <ImageClipBox
              src="placeholder"
              clipClass="absolute md:scale-125"
            />
            <ImageClipBox
              src="placeholder"
              clipClass="sword-man-clip-path md:scale-125"
            />
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="mb-10 font-general text-[10px] uppercase">
              Join Zentry
            </p>

            <AnimatedTitle
              title="let&#39;s b<b>u</b>ild the <br /> new era of <br /> g<b>a</b>ming t<b>o</b>gether."
              className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
            />

            <Button 
              title="contact us" 
              containerClass="mt-10 cursor-pointer"
              onClick={onEnterApp}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-screen bg-[#5542ff] py-4 text-black">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p className="text-center text-sm font-light md:text-left">
            ©Nova 2024. All rights reserved
          </p>

          <div className="flex justify-center gap-4 md:justify-start">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black transition-colors duration-500 ease-in-out hover:text-white"
              >
                {link.icon}
              </a>
            ))}
          </div>

          <a
            href="#privacy-policy"
            className="text-center text-sm font-light hover:underline md:text-right"
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
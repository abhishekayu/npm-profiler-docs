import React, { useState, useEffect, useRef } from "react";
import {
  Moon,
  Sun,
  Copy,
  Shield,
  Menu,
  X,
  Check,
  Package,
  Database,
  Lock,
  Github,
  Heart,
  Scale,
  User,
  Activity,
  AlertCircle,
  Terminal,
  Cpu,
  Settings,
  FileKey,
  BarChart2,
  Trash2,
  HardDrive,
  Monitor,
} from "lucide-react";

// --- 1. Canvas Background Component (Green/Black Theme) ---
const ParticleNetworkCanvas = ({ isDark }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 45;
    const connectionDistance = 160;
    const speed = 0.25;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Green tinted particles
      const particleColor = isDark
        ? "rgba(52, 211, 153, 0.15)"
        : "rgba(16, 185, 129, 0.15)"; // Emerald
      const lineColor = isDark
        ? "rgba(52, 211, 153, 0.05)"
        : "rgba(16, 185, 129, 0.05)";

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
    />
  );
};

// --- 2. Code Block Component ---
const CodeBlock = ({ title, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all duration-300 hover:border-emerald-500/30 dark:hover:border-emerald-500/30">
      {title && (
        <div className="flex justify-between items-center px-4 py-2 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <Terminal size={12} /> {title}
          </span>
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-200 dark:bg-emerald-800"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-200 dark:bg-emerald-800"></div>
          </div>
        </div>
      )}
      <div className="relative group">
        <pre className="p-5 overflow-x-auto text-sm font-mono text-neutral-800 dark:text-neutral-300 leading-relaxed scrollbar-thin scrollbar-thumb-emerald-200 dark:scrollbar-thumb-emerald-900">
          {code}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800"
          title="Copy code"
        >
          {copied ? (
            <Check
              size={14}
              className="text-emerald-600 dark:text-emerald-400"
            />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>
    </div>
  );
};

// --- 3. Section Component ---
const Section = ({ id, title, icon: Icon, children }) => (
  <section id={id} className="mb-24 scroll-mt-32">
    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
      <div className="p-2.5 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
        <Icon size={26} strokeWidth={2} />
      </div>
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
        {title}
      </h2>
    </div>
    <div className="text-neutral-600 dark:text-neutral-400 leading-8 text-lg font-normal">
      {children}
    </div>
  </section>
);

// --- 4. Main Application ---
export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "intro",
        "install",
        "count",
        "api",
        "unused",
        "console",
        "size",
        "community",
      ];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 400) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "intro", label: "Introduction" },
    { id: "install", label: "Installation" },
    { id: "count", label: "Count Analysis" },
    { id: "api", label: "API Analysis" },
    { id: "unused", label: "Unused Analysis" },
    { id: "console", label: "Console Analysis" },
    { id: "size", label: "Size Analysis" },
    { id: "community", label: "Community" },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 ${
        darkMode
          ? "dark bg-black text-neutral-100"
          : "bg-white text-neutral-900"
      }`}
    >
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-[-5] bg-white dark:bg-black transition-colors duration-300"></div>

      <ParticleNetworkCanvas isDark={darkMode} />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-black/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="bg-black dark:bg-emerald-500 p-1.5 rounded-lg shadow-sm transition-colors">
                  <Activity size={18} strokeWidth={3} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  npm-profiler
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/abhishekayu/npm-profiler"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-50 dark:bg-neutral-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                <Github size={14} />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.npmjs.com/package/npm-profiler"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-50 dark:bg-neutral-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                <Package size={14} />
                <span>NPM</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800 pt-24 pb-10 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${
            sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
          }`}
        >
          <div className="px-6 mb-8 lg:hidden">
            <div className="flex items-center gap-2 font-bold text-xl text-neutral-900 dark:text-neutral-100">
              <Menu /> Navigation
            </div>
          </div>
          <nav className="px-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-emerald-600 dark:hover:text-emerald-400"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-neutral-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-12 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Intro */}
            <Section id="intro" title="Introduction" icon={Terminal}>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-xl mb-6 font-light leading-relaxed text-neutral-700 dark:text-neutral-300">
                  <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                    npm Profiler
                  </strong>{" "}
                  is a Comprehensive Analysis Command-Line Analysis Tool for
                  Projects.
                </p>
                <div className="p-8 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <p className="mb-0 text-lg">
                    It is designed to give you deep insights into your codebase,
                    including file counts, line counts, API usage, unused
                    variables, console logs, and folder sizes.
                  </p>
                </div>
              </div>
            </Section>

            {/* Installation */}
            <Section id="install" title="Installation" icon={Package}>
              <p className="mb-4">
                Get started by installing the package via npm.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-3 text-neutral-900 dark:text-white flex items-center gap-2">
                    <Monitor size={18} /> Windows
                  </h3>
                  <CodeBlock title="Terminal" code="npm install npm-profiler" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-3 text-neutral-900 dark:text-white flex items-center gap-2">
                    <Cpu size={18} /> Mac / Linux
                  </h3>
                  <CodeBlock
                    title="Terminal"
                    code="npm install -g npm-profiler"
                  />
                </div>
              </div>
            </Section>

            {/* Count Analysis */}
            <Section id="count" title="1. Count Analysis" icon={FileKey}>
              <p className="mb-6">
                Designed to analyze files within a directory and provide
                insights such as the total number of files, lines of code, React
                components, React routers, and configuration files.
              </p>

              <CodeBlock title="Command" code="ayu-count -g" />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Output Preview
              </h3>
              <CodeBlock
                title="Terminal Output"
                code={`┌───────────┬────────────┬────────────┐
│ Extension │ TotalFiles │ TotalLines │
├───────────┼────────────┼────────────┤
│ .js       │ 2          │ 11         │
├───────────┼────────────┼────────────┤
│ .jsx      │ 3          │ 152        │
└───────────┴────────────┴────────────┘

Total Lines of Code: 5087
Total React Components: 14
Total React Routers: 3
Total Configuration Files: 1
Total Commented Lines: 11`}
              />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Options
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>
                  <code>-g</code>: Indicates that the analysis should include
                  all files within the directory. (Mandatory)
                </li>
                <li>
                  <code>-n</code>: Include the node_modules, Dist etc directory
                  to the analysis.
                </li>
                <li>
                  <code>-w</code>: Include whitespace lines in the line count.
                </li>
                <li>
                  <code>-d</code>: Download the analysis results as a CSV file
                  named <em>Project-count.csv</em>.
                </li>
                <li>
                  <code>-c</code>: Count the total number of commented lines.
                </li>
              </ul>
            </Section>

            {/* API Analysis */}
            <Section id="api" title="2. API Analysis" icon={Activity}>
              <p className="mb-6">
                Designed to analyze API calls within files in a directory. It
                provides insights such as the total number of API calls, the
                number of GET and POST calls for both Fetch and Axios.
              </p>

              <CodeBlock title="Command" code="ayu-api -g" />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Output Preview
              </h3>
              <CodeBlock
                title="Terminal Output"
                code={`┌───────┬─────────────┬───────────┬────────────┐
│ API   │ Total Calls │ GET Calls │ POST Calls │
├───────┼─────────────┼───────────┼────────────┤
│ Fetch │ 5           │ 4         │ 1          │
├───────┼─────────────┼───────────┼────────────┤
│ Axios │ 4           │ 2         │ 2          │
└───────┴─────────────┴───────────┴────────────┘`}
              />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Options
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>
                  <code>-g</code>: Indicates that the analysis should include
                  all files within the directory. (Mandatory)
                </li>
                <li>
                  <code>-d</code>: Download the analysis results as a CSV file
                  named <em>Api-calls.csv</em>.
                </li>
              </ul>
            </Section>

            {/* Unused Analysis */}
            <Section id="unused" title="3. Unused Analysis" icon={Trash2}>
              <p className="mb-6">
                Designed to analyze JavaScript files in a directory and provide
                insights such as the number of active <code>console.log</code>{" "}
                statements, commented console.log statements, total console.log
                statements, uncalled functions, and unused packages.
              </p>

              <CodeBlock title="Command" code="ayu-free -g" />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Output Preview
              </h3>
              <CodeBlock
                title="Terminal Output"
                code={`┌──────────────────────────────┬────────────────────┐
│ Package                      │ Version            │
├──────────────────────────────┼────────────────────┤
│ framer-motion                │ ^11.0.24           │
├──────────────────────────────┼────────────────────┤
│ ora                          │ ^8.0.1             │
├──────────────────────────────┼────────────────────┤
│ react-beautiful-dnd          │ ^13.1.1            │
└──────────────────────────────┴────────────────────┘

Total Active console.log Statements: 15
Total Commented console.log Statements: 2
Total Console.log Statements: 17
Total Uncalled Functions: 3
Total Commented Lines: 11
Total Unused Packages: 3`}
              />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Options
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>
                  <code>-g</code>: Indicates that the analysis should include
                  all JavaScript files within the directory. (Mandatory)
                </li>
                <li>
                  <code>-d</code>: Download the analysis results as a CSV file
                  named <em>Unused.csv</em>.
                </li>
              </ul>
            </Section>

            {/* Console Analysis */}
            <Section id="console" title="4. Console Analysis" icon={Terminal}>
              <p className="mb-6">
                Designed to manipulations on JavaScript, TypeScript, JSX, and
                TSX files within a specified directory. It offers options to
                comment out, remove, or uncomment console.log statements in
                these files.
              </p>

              <CodeBlock title="Command" code="ayu-console [option]" />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Options
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    cmd: "gc",
                    desc: "Comment out all console.log statements.",
                  },
                  { cmd: "gr", desc: "Remove all console.log statements." },
                  {
                    cmd: "gar",
                    desc: "Remove all active console.log statements.",
                  },
                  {
                    cmd: "gcr",
                    desc: "Remove all inactive/commented console.log statements.",
                  },
                  { cmd: "guc", desc: "Uncomment all console.log statements." },
                  { cmd: "help", desc: "Display this help message." },
                ].map((opt, i) => (
                  <div
                    key={i}
                    className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
                  >
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {opt.cmd}
                    </span>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-neutral-500 italic">
                Note: Uncommented console.log statements will only work if they
                were commented out by this tool.
              </p>
            </Section>

            {/* Size Analysis */}
            <Section id="size" title="5. Size Analysis" icon={HardDrive}>
              <p className="mb-6">
                Designed to calculate and display the sizes of directories and
                subdirectories within a specified root directory. It provides
                insights into the disk space consumption of various folders.
              </p>

              <CodeBlock title="Command" code="ayu-size -g" />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Output Preview
              </h3>
              <CodeBlock
                title="Terminal Output"
                code={`┌────────────┬──────────┐
│ Folder     │ Size     │
├────────────┼──────────┤
│ public     │ 1.88 KB  │
├────────────┼──────────┤
│ src        │ 10.17 KB │
├────────────┼──────────┤
│ src\\assets │ 4.03 KB  │
└────────────┴──────────┘

Total size of the (/) without folders: 329.31 KB
Size of 'dist': 147.38 KB
Size of 'node_modules': 64.14 MB`}
              />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Options
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>
                  <code>-g</code>: Indicates that the analysis should include
                  all directories and subdirectories within the root directory.
                  (Mandatory)
                </li>
                <li>
                  <code>-d</code>: Download the analysis results as a CSV file
                  named <em>Folder-sizes.csv</em>.
                </li>
              </ul>
            </Section>

            {/* Community & License */}
            <Section id="community" title="Community & License" icon={Heart}>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contributor Card */}
                <div className="relative group bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-500/30">
                  <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-6 flex items-center justify-center">
                    <User
                      size={40}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    Abhishek Verma
                  </h3>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-6 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
                    Contributor
                  </span>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8 max-w-xs leading-relaxed italic">
                    "Important: For any Queries, Suggestions, or Improvements,
                    please don't hesitate to raise an issue."
                  </p>

                  <a
                    href="https://github.com/abhishekayu"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md shadow-emerald-500/20"
                  >
                    View Profile
                  </a>
                </div>

                {/* Contribute & License */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4 text-neutral-900 dark:text-white font-bold text-lg">
                      <Activity size={24} className="text-emerald-500" />{" "}
                      Contribute
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                      Contributions are always welcome! Please read the{" "}
                      <strong>contribution guidelines</strong> first. If you
                      have any questions, feedback, or ideas for improvement,
                      please don't hesitate to raise an issue or submit a pull
                      request on GitHub.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4 text-neutral-900 dark:text-white font-bold text-lg">
                      <Scale size={24} className="text-emerald-500" /> License
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      This project is licensed under the{" "}
                      <strong>MIT License</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            <footer className="mt-24 pt-10 border-t border-neutral-200 dark:border-neutral-800 text-center pb-10">
              <div className="flex justify-center items-center gap-2 mb-4">
                <Activity
                  className="text-emerald-600 dark:text-emerald-400"
                  size={20}
                />
                <span className="font-bold text-neutral-700 dark:text-neutral-300">
                  npm-profiler
                </span>
              </div>
              <p className="text-neutral-500 text-sm">
                &copy; {new Date().getFullYear()} Abhishek Verma. All rights
                reserved. Licensed under MIT.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

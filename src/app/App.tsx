import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Calculator,
  CalendarCheck,
  ChevronDown,
  FileText,
  Globe,
  Mail,
  Phone,
  ReceiptText,
  X,
} from "lucide-react";
import profilePhoto from "../imports/wangyanmei-profile.png";

const shimmerStyles = `
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .text-shimmer {
    background: linear-gradient(to right, #71717a 20%, #ffffff 40%, #ffffff 60%, #71717a 80%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const SectionWrapper = ({
  children,
  id,
  className = "",
}: {
  children: React.ReactNode;
  id: string;
  className?: string;
}) => (
  <section
    id={id}
    className={`w-full h-screen min-h-[700px] md:min-h-[800px] snap-start shrink-0 pt-[110px] md:pt-[130px] pb-12 md:pb-16 relative flex flex-col px-6 md:px-16 lg:px-24 ${className}`}
  >
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full h-full flex flex-col max-w-[1400px] mx-auto relative"
    >
      {children}
    </motion.div>
  </section>
);

const SectionHeader = ({
  subtitle,
  title,
  desc,
  rightElement = null,
}: {
  subtitle: string;
  title: string;
  desc?: string;
  rightElement?: React.ReactNode;
}) => (
  <div className="w-full mb-[28px] md:mb-10 flex flex-col items-start md:items-center md:text-center shrink-0">
    <div className="flex items-center gap-3 md:gap-4 mb-[4px] md:mb-4 w-full md:w-auto">
      <div className="hidden md:block h-[1px] w-8 lg:w-12 bg-zinc-700" />
      <span className="text-sm font-mono text-zinc-400 tracking-widest uppercase">{subtitle}</span>
      <div className="h-[1px] w-8 lg:w-12 bg-zinc-700" />
    </div>
    <div className="relative flex items-center justify-start w-full md:w-auto md:justify-center gap-4 mb-[12px] md:mb-4">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white text-left md:text-center leading-none py-1">
        {title}
      </h2>
      {rightElement && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 md:static md:translate-y-0">
          {rightElement}
        </div>
      )}
    </div>
    {desc && (
      <p className="text-zinc-400 text-sm md:text-base lg:text-lg font-light leading-relaxed text-left md:text-center w-full md:whitespace-nowrap md:truncate">
        {desc}
      </p>
    )}
  </div>
);

const useAutoScrollOverflow = (activeKey: unknown, pixelsPerSecond = 8) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeKey === null || activeKey === undefined) return;
    const target = ref.current;
    if (!target) return;
    let frameId: number | null = null;
    let resetTimer: number | null = null;
    let lastFrameTime: number | null = null;
    let scrollPosition = 0;
    let cancelled = false;

    target.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    const tick = (timestamp: number) => {
      if (cancelled) return;

      const maxScroll = target.scrollHeight - target.clientHeight;
      if (maxScroll <= 0) return;

      if (lastFrameTime === null) lastFrameTime = timestamp;
      const elapsed = timestamp - lastFrameTime;
      lastFrameTime = timestamp;

      if (target.scrollTop >= maxScroll - 1) {
        resetTimer = window.setTimeout(() => {
          scrollPosition = 0;
          target.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
          lastFrameTime = null;
          frameId = window.requestAnimationFrame(tick);
        }, 1200);
        return;
      }

      scrollPosition = Math.min(maxScroll, scrollPosition + (elapsed / 1000) * pixelsPerSecond);
      target.scrollTop = scrollPosition;
      frameId = window.requestAnimationFrame(tick);
    };

    const startTimer = window.setTimeout(() => {
      frameId = window.requestAnimationFrame(tick);
    }, 650);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      if (resetTimer !== null) window.clearTimeout(resetTimer);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [activeKey, pixelsPerSecond]);

  return ref;
};

const AnimatedTitle = ({ text, className, delay = 0 }: { text: string; className: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={`text-shimmer text-center inline-block ${className}`}
  >
    {text}
  </motion.div>
);

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "about", "experience", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: "-20% 0px -20% 0px", threshold: 0.2 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setActiveSection(targetId);
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { id: "about", label: "关于" },
    { id: "experience", label: "经历" },
    { id: "contact", label: "联系" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-full px-4 md:px-6 h-14 md:h-auto md:py-2 flex items-center justify-between sm:justify-center gap-1 sm:gap-0 shadow-2xl w-[92%] sm:w-auto max-w-[420px]"
    >
      <a
        href="#hero"
        onClick={(e) => handleNavClick(e, "hero")}
        className={`inline-flex h-8 flex-1 basis-0 min-w-0 sm:flex-none items-center justify-center font-black tracking-widest text-base leading-none cursor-pointer transition-all px-2 sm:pr-4 ${
          activeSection === "hero"
            ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        WYM.
      </a>

      <div className="h-4 w-px bg-zinc-700/80 hidden sm:block mx-2" />

      <div className="contents sm:flex sm:flex-none sm:items-center sm:gap-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleNavClick(e, item.id)}
            className={`relative inline-flex h-8 flex-1 basis-0 min-w-0 sm:flex-none items-center justify-center px-2 sm:px-4 text-sm leading-none transition-all duration-300 rounded-full ${
              activeSection === item.id
                ? "text-white font-bold bg-white/10 ring-1 ring-white/20 shadow-sm"
                : "text-zinc-400 font-medium hover:text-zinc-200 hover:bg-zinc-800/50"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
};

const HeroSection = () => (
  <SectionWrapper id="hero" className="bg-zinc-950 text-white">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
    </div>

    <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center">
      <div className="max-w-5xl w-full flex flex-col items-center space-y-8">
        <div className="hidden md:block w-full">
          <AnimatedTitle
            text="WANGYANMEI"
            className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter uppercase inline-block"
          />
        </div>
        <div className="md:hidden flex flex-col items-center space-y-0 w-full">
          <span className="text-shimmer inline-block text-[16vw] leading-[0.95] font-black tracking-normal uppercase">WANG</span>
          <span className="text-shimmer inline-block text-[16vw] leading-[0.95] font-black tracking-normal uppercase">YAN</span>
          <span className="text-shimmer inline-block text-[16vw] leading-[0.95] font-black tracking-normal uppercase">MEI</span>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.8 } } }}
          className="flex flex-col items-center space-y-4 w-full mt-4 sm:mt-0"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-2xl md:text-4xl font-semibold tracking-[0.35em] text-zinc-100 pl-[0.35em]"
          >
            王艳梅
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="hidden md:flex text-lg md:text-2xl lg:text-3xl font-medium tracking-wide w-full justify-center"
          >
            <span className="text-shimmer inline-block">财务主管 · 财务统筹 · 多主体管理</span>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="md:hidden flex flex-col items-center space-y-3 w-full mt-2"
          >
            <span className="inline-block text-base font-medium tracking-wide text-zinc-300">• 财务主管</span>
            <span className="inline-block text-base font-medium tracking-wide text-zinc-300">• 财务统筹</span>
            <span className="inline-block text-base font-medium tracking-wide text-zinc-300">• 多主体管理</span>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="hidden md:block text-xs md:text-sm lg:text-lg font-mono tracking-widest uppercase w-full text-zinc-400 mt-4"
          >
            17家公司财务闭环 / 合同付款审核 / AI汇报工作流
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="md:hidden flex flex-col items-center space-y-3 mt-6 text-xs font-mono tracking-widest uppercase text-zinc-400"
          >
            <span className="px-4 py-1.5 bg-zinc-900 rounded-full border border-zinc-800">17家公司财务闭环</span>
            <span className="px-4 py-1.5 bg-zinc-900 rounded-full border border-zinc-800">合同付款审核</span>
            <span className="px-4 py-1.5 bg-zinc-900 rounded-full border border-zinc-800">AI汇报工作流</span>
          </motion.div>
        </motion.div>
      </div>
    </main>

    <div className="absolute bottom-8 left-0 w-full flex justify-center z-10 pointer-events-none">
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <ChevronDown className="w-8 h-8 text-zinc-500" />
      </motion.div>
    </div>
  </SectionWrapper>
);

const AboutSection = () => {
  const [isAboutTextScrolled, setIsAboutTextScrolled] = useState(false);

  const mobilePhoto = (
    <div className="md:hidden w-16 h-16 bg-zinc-900 rounded-2xl ring-1 ring-inset ring-zinc-800 shrink-0 shadow-lg relative overflow-hidden">
      <img src={profilePhoto} alt="王艳梅头像" className="h-full w-full object-cover object-[50%_16%]" />
    </div>
  );

  const highlights = [
    {
      label: "统筹主体",
      value: "17家",
      icon: BriefcaseBusiness,
    },
    {
      label: "代账客户",
      value: "40+",
      icon: Calculator,
    },
    {
      label: "门店内账",
      value: "8家",
      icon: ReceiptText,
    },
    {
      label: "财务经验",
      value: "6年+",
      icon: CalendarCheck,
    },
  ];

  return (
    <SectionWrapper id="about" className="bg-zinc-950 text-zinc-200">
      <div className="flex flex-col h-full w-full">
        <SectionHeader subtitle="About Me" title="关于我" desc="个人概况简介" rightElement={mobilePhoto} />

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex lg:col-span-5 w-full bg-zinc-900 rounded-3xl flex-col relative overflow-hidden group shadow-2xl ring-1 ring-inset ring-zinc-800 will-change-transform"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/40 to-zinc-950 opacity-80" />
            <div className="relative z-10 flex-1 min-h-0 overflow-hidden bg-zinc-950">
              <img
                src={profilePhoto}
                alt="王艳梅头像"
                className="h-full w-full object-cover object-[50%_16%] grayscale-[15%] transition duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
              />
            </div>
          </motion.div>

          <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-0">
            <div
              className={`relative flex-1 min-h-0 shrink md:[mask-image:none] md:[WebkitMaskImage:none] ${
                isAboutTextScrolled
                  ? "[mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_65%,transparent_100%)] [WebkitMaskImage:linear-gradient(to_bottom,transparent_0%,black_12%,black_65%,transparent_100%)]"
                  : "[mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_100%)] [WebkitMaskImage:linear-gradient(to_bottom,black_0%,black_65%,transparent_100%)]"
              }`}
            >
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
                onScroll={(e) => {
                  const scrolled = e.currentTarget.scrollTop > 6;
                  setIsAboutTextScrolled((current) => (current === scrolled ? current : scrolled));
                }}
                className="space-y-4 h-full overflow-y-auto hide-scrollbar pb-10 md:pb-0"
              >
                {[
                  "小型财务部统筹能力：具备两人财务部协同场景下的财务统筹经验，能围绕会计核算、出纳收付款、税务申报、费用预算、合同付款审核及档案管理建立分工复核和节点跟进机制。",
                  "税务合规与风险处理能力：熟悉小规模、一般纳税人、合伙企业等不同主体申报口径，覆盖个税、增值税及附加、企业所得税、工商年报、税务年报，并能跟进经营异常、地址异常、税务变更等合规事项。",
                  "工具与汇报提效能力：熟悉金蝶 KIS、金蝶系统、用友 ERP，熟练使用 Excel / WPS 及 SUM、SUMIF、SUBTOTAL、VLOOKUP、XLOOKUP 等函数，能结合轻量 AI 工作流优化合同审核和月度财务汇报。",
                ].map((text, i) => (
                  <motion.p
                    key={text}
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    className="text-base lg:text-lg leading-relaxed font-light block text-zinc-300"
                  >
                    {text}
                  </motion.p>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 lg:mt-auto pt-4 lg:pt-8 lg:h-[180px] shrink-0"
            >
              {highlights.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-4 lg:p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-800 transition-colors duration-300 ring-1 ring-inset ring-zinc-800 h-full min-h-[120px] lg:min-h-0"
                >
                  <stat.icon className="w-5 h-5 lg:w-8 lg:h-8 text-zinc-500 mb-2 lg:mb-5" />
                  <span className="text-xl lg:text-3xl font-bold text-zinc-200 mb-1 lg:mb-2">{stat.value}</span>
                  <span className="text-xs lg:text-sm text-zinc-500 font-medium">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

const ExperienceSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; scrollLeft: number } | null>(null);
  const experienceAutoPreviewRef = useRef(false);
  const mobileExperienceTouchStartRef = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeExperience, setActiveExperience] = useState<number | null>(null);
  const mobileExperienceDetailRef = useAutoScrollOverflow(activeExperience, 16);
  const [isMobileExperienceScrolled, setIsMobileExperienceScrolled] = useState(false);
  const [isExperienceInView, setIsExperienceInView] = useState(false);

  const experiences = [
    {
      period: "2023.06 - 2026.06",
      company: "均富联合上市服务（深圳）有限公司",
      role: "财务主管",
      tags: ["17家公司", "财务统筹", "合同付款审核", "AI汇报工作流"],
      details: [
        "负责产业园多主体财务统筹工作，作为财务部核心会计人员，协同出纳完成日常收付款、费用审核、账务核算、税务申报、资金计划、预算跟进、合同付款审核及月度财务汇报。",
        "统筹两人财务部日常事项，明确会计核算、出纳付款、银行流水、扣款跟进、资料归档及付款复核边界，建立月度财务节点表和事项跟进台账。",
        "负责17家公司费用审核、工资核算、社保公积金扣款跟进、金蝶凭证录入及财务报表编制，并完成个税、经营所得、增值税及附加、企业所得税、工商年报、税务年报等申报事项。",
        "每日核对各公司收支明细并汇报资金情况，结合紧急付款协助规划资金；每月对接各部门费用数据，编制下月预算表，同步登记借款、押金、备用金及项目数据。",
        "参与财务付款流程与业务合同审核流程优化，梳理付款申请、审批材料、费用归集、预算匹配、出纳付款执行、合同金额、付款条件、发票税点、押金及违约条款等审核要点。",
        "基于 AI 工作流搭建轻量合同审核辅助流程，将合同关键条款整理为标准检查清单，用于付款前要点核查与风险提示；审核结论结合合同原件、付款申请单及业务审批记录复核确认。",
        "通过 AI汇报工作流，将每月收入、支出、往来款汇总表按层级归类、合并与汇总金额，生成 Markdown 结构化文档与思维导图框架，并设置各层级金额合计校验提示。",
        "整理入账原始凭证，装订凭证、科目余额表、总账、明细账、纳税申报表等资料；跟进经营异常、地址异常问题，并完成第五次全国经济普查中15家公司信息及财务数据填报。",
      ],
    },
    {
      period: "2022.10 - 2023.05",
      company: "江西典炜服饰有限公司",
      role: "全盘会计",
      tags: ["全盘账务", "费用审核", "合同审核", "往来对账"],
      details: [
        "负责服饰企业全盘账务处理与税务申报，覆盖费用报销、付款申请、业务合同、工资提成、预算数据、往来对账及凭证档案管理。",
        "审核日常费用报销单、付款申请单及业务合同，关注金额、付款时间、付款方式、毛利返利、发票税点、特殊押金及违约金条款，降低业务结算风险。",
        "运用金蝶系统完成3个小规模公司、1个一般纳税人公司凭证录入与财务报表出具，完成个税、社保、增值税、企业所得税、工商年报、税务年报及统计网数据报送。",
        "核对客户及供应商往来账目并发送对账单，整理原始单据、装订凭证并归档会计账簿及其他财务资料。",
        "独立完成3个小规模公司、1个一般纳税人公司账务处理、财务报表出具及纳税申报，配合完成费用审核、合同审核、往来对账和财务流程调整。",
      ],
    },
    {
      period: "2020.11 - 2022.09",
      company: "赣州双诚企业服务有限公司",
      role: "主办会计",
      tags: ["代账客户", "多主体", "强时效", "风险跟进"],
      details: [
        "负责代账客户多主体账务处理、财务报表编制、税务申报、税务异常事项跟进及客户沟通，形成高频、多主体、强时效的账税处理经验。",
        "每月独立完成40多家公司原始单据整理、凭证录入与财务报表编制，按月度节点推进客户账务闭环。",
        "按时完成个税、社保、增值税、企业所得税、工商年报、税务年报等申报事项，确保税务数据准确性与及时性。",
        "及时向客户反馈税务不合规现象及处理建议，协助纠正不规范行为，同步处理社保医保、税务变更、税务异常与发票开具等事项。",
        "每月完成40多家公司原始单据整理、凭证录入、财务报表编制和纳税申报，并针对税务不合规事项向客户反馈处理建议，降低客户税务异常风险。",
      ],
    },
    {
      period: "2019.09 - 2020.10",
      company: "赣州豆豆母婴有限公司",
      role: "内账会计",
      tags: ["内账核算", "8家门店", "库存盘点", "报表支持"],
      details: [
        "协助负责母婴零售批发场景下8家门店内账核算、营业款核对、费用审核、进销存数据汇总、库存盘点及经营报表输出。",
        "每日核对门店营业款收入，跟进门店缴款与资金到账情况，保障门店资金回笼及时、账款记录清晰。",
        "汇总进销存数据，参与门店库存盘点与差异核对，为库存管理、成本核算和费用分摊提供基础数据。",
        "完成门店收入、费用、成本、返利等数据入账与报表编制，向股东说明报表数据来源并跟进签字确认。",
        "协助完成8家门店营业款核对、费用审核、进销存数据汇总、库存盘点及经营报表输出，支撑门店经营数据核对与股东报表确认。",
      ],
    },
  ];

  useEffect(() => {
    const sectionEl = document.getElementById("experience");
    if (!sectionEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        setIsExperienceInView(isIntersecting);
        if (!isIntersecting) {
          experienceAutoPreviewRef.current = false;
          setCurrentIndex(0);
          scrollRef.current?.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
        }
      },
      { threshold: 0 }
    );
    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isExperienceInView || activeExperience !== null || experienceAutoPreviewRef.current) return;
    experienceAutoPreviewRef.current = true;
    const timers: number[] = [];
    experiences.forEach((_, index) => {
      if (index === 0) return;
      timers.push(window.setTimeout(() => scrollTo(index), index * 620));
    });
    timers.push(window.setTimeout(() => scrollTo(0), experiences.length * 620 + 620));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [activeExperience, experiences.length, isExperienceInView]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const child = target.children[0] as HTMLElement;
    const gap = window.innerWidth >= 1024 ? 32 : window.innerWidth >= 768 ? 24 : 16;
    const cardWidthWithGap = child.offsetWidth + gap;
    const index = Math.round(target.scrollLeft / cardWidthWithGap);
    setCurrentIndex((current) => (current === index ? current : index));
  };

  const handleMobileExperienceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrolled = e.currentTarget.scrollTop > 6;
    setIsMobileExperienceScrolled((current) => (current === scrolled ? current : scrolled));
  };

  const handleMobileExperienceTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    mobileExperienceTouchStartRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleMobileExperienceTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const startY = mobileExperienceTouchStartRef.current;
    mobileExperienceTouchStartRef.current = null;
    if (startY === null) return;

    const target = e.currentTarget;
    const deltaY = e.changedTouches[0].clientY - startY;
    const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 8;

    if (deltaY < -50 && isAtBottom) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const target = scrollRef.current;
    const child = target.children[0] as HTMLElement;
    const gap = window.innerWidth >= 1024 ? 32 : window.innerWidth >= 768 ? 24 : 16;
    const cardWidthWithGap = child.offsetWidth + gap;
    target.scrollTo({ left: index * cardWidthWithGap, behavior: "smooth" });
    setCurrentIndex(index);
  };

  const handleDesktopDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    dragStartRef.current = { x: e.clientX, scrollLeft: scrollRef.current.scrollLeft };
  };

  const handleDesktopDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current || !dragStartRef.current) return;
    const delta = e.clientX - dragStartRef.current.x;
    scrollRef.current.scrollLeft = dragStartRef.current.scrollLeft - delta;
  };

  const handleDesktopDragEnd = () => {
    if (!scrollRef.current || !dragStartRef.current) return;
    const target = scrollRef.current;
    const child = target.children[0] as HTMLElement;
    const gap = window.innerWidth >= 1024 ? 32 : window.innerWidth >= 768 ? 24 : 16;
    const cardWidthWithGap = child.offsetWidth + gap;
    const index = Math.round(target.scrollLeft / cardWidthWithGap);
    dragStartRef.current = null;
    scrollTo(index);
  };

  return (
    <SectionWrapper id="experience" className="bg-zinc-950 text-zinc-200">
      <div className="flex flex-col h-full w-full">
        <SectionHeader
          subtitle="Experience"
          title="工作经历"
          desc="从内账核算、代账多主体处理到财务主管，围绕账税核算、流程合同审核、预算资金跟进和内部汇报持续沉淀。"
        />

        <div
          onScroll={handleMobileExperienceScroll}
          onTouchStart={handleMobileExperienceTouchStart}
          onTouchEnd={handleMobileExperienceTouchEnd}
          className={`md:hidden flex-1 min-h-0 w-full relative mb-1 overflow-y-auto hide-scrollbar ${
            isMobileExperienceScrolled
              ? "[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_78%,transparent_100%)] [WebkitMaskImage:linear-gradient(to_bottom,transparent_0%,black_10%,black_78%,transparent_100%)]"
              : "[mask-image:linear-gradient(to_bottom,black_0%,black_78%,transparent_100%)] [WebkitMaskImage:linear-gradient(to_bottom,black_0%,black_78%,transparent_100%)]"
          }`}
        >
          <div
            className={`absolute left-[11px] top-0 bottom-0 w-1 rounded-full shadow-[0_0_14px_rgba(255,255,255,0.28)] ${
              isMobileExperienceScrolled ? "bg-gradient-to-b from-transparent via-white/70 to-transparent" : "bg-gradient-to-b from-white via-white/70 to-transparent"
            }`}
          />
          <div className="flex flex-col gap-3 pl-8 pb-24">
            {experiences.map((exp, i) => (
              <div key={exp.company} className="relative">
                <span className="absolute -left-[27px] top-7 h-4 w-4 rounded-full bg-zinc-950 ring-2 ring-white shadow-[0_0_14px_rgba(255,255,255,0.55)] z-10">
                  <span className="absolute inset-1 rounded-full bg-white" />
                </span>
                <motion.button
                  type="button"
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
                  onClick={() => setActiveExperience(i)}
                  className="relative w-full rounded-3xl bg-zinc-900 p-4 text-left ring-1 ring-inset ring-zinc-800 shadow-xl overflow-hidden flex flex-col active:scale-[0.99] transition-transform"
                >
                  <div className="relative z-10">
                    <span className="inline-flex px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs font-mono mb-2.5">
                      {exp.period}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight tracking-tight mb-2.5">{exp.role}</h3>
                  </div>
                  <div className="relative z-10 mt-auto flex items-end justify-between gap-4">
                    <div className="text-zinc-400 font-medium text-xs leading-snug">{exp.company}</div>
                    <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-zinc-300" />
                    </span>
                  </div>
                  <div className="absolute right-[-18%] top-[-30%] w-[60%] h-[140%] bg-gradient-to-l from-zinc-800/30 to-transparent pointer-events-none rounded-full blur-3xl opacity-70" />
                </motion.button>
              </div>
            ))}
          </div>
        </div>

        <div
          className="hidden md:block flex-1 min-h-0 w-full relative mb-1 md:mb-0 transition-all duration-300 md:[mask-image:none_!important] md:[WebkitMaskImage:none_!important]"
          style={{
            maskImage: currentIndex === experiences.length - 1 ? "linear-gradient(to left, black 85%, transparent 100%)" : "linear-gradient(to right, black 85%, transparent 100%)",
            WebkitMaskImage: currentIndex === experiences.length - 1 ? "linear-gradient(to left, black 85%, transparent 100%)" : "linear-gradient(to right, black 85%, transparent 100%)",
          }}
        >
          <div className="hidden md:block absolute top-0 bottom-0 left-0 w-16 lg:w-24 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none z-20 transition-opacity duration-300" style={{ opacity: currentIndex > 0 ? 1 : 0 }} />
          <div className="hidden md:block absolute top-0 bottom-0 right-0 w-16 lg:w-24 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none z-20 transition-opacity duration-300" style={{ opacity: currentIndex < experiences.length - 1 ? 1 : 0 }} />

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseDown={handleDesktopDragStart}
            onMouseMove={handleDesktopDragMove}
            onMouseUp={handleDesktopDragEnd}
            onMouseLeave={handleDesktopDragEnd}
            className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar items-center gap-4 md:gap-6 lg:gap-8 w-full md:px-0 left-0 select-none"
          >
            {experiences.map((exp, i) => (
              <div
                key={exp.company}
                onClick={() => scrollTo(i)}
                className={`snap-start shrink-0 w-[85%] md:w-[85%] h-full md:h-[calc(100%-2rem)] max-h-[600px] bg-zinc-900 rounded-3xl p-6 pt-8 pb-4 md:p-10 lg:p-14 flex flex-col md:flex-row ring-1 ring-inset ring-zinc-800 relative overflow-hidden shadow-xl transition-colors duration-300 ${
                  i === currentIndex ? "cursor-default" : "cursor-pointer hover:bg-zinc-800/80"
                }`}
              >
                <div className="md:w-[35%] lg:w-[30%] flex flex-col justify-between shrink-0 relative z-10 mb-4 md:mb-0 md:pr-6 lg:pr-8">
                  <div>
                    <span className="inline-block px-4 py-1.5 bg-zinc-950 border border-zinc-800 rounded-full text-zinc-400 text-sm font-mono mb-4 lg:mb-8">
                      {exp.period}
                    </span>
                    <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-2 md:mb-4 tracking-tight">
                      {exp.role}
                    </h3>
                    <div className="text-zinc-400 font-medium text-base md:text-lg lg:text-2xl">{exp.company}</div>
                  </div>
                  <div className="hidden md:flex flex-wrap gap-x-2 gap-y-2 mt-6 max-w-[92%]">
                    {exp.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 border border-zinc-700 text-zinc-300 rounded-xl text-xs bg-zinc-950/70 whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 md:w-[65%] lg:w-[70%] overflow-hidden md:border-l md:border-zinc-800 md:pl-8 lg:pl-16 relative z-10 pr-2 [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)] [WebkitMaskImage:linear-gradient(to_bottom,black_75%,transparent_100%)] md:[mask-image:none] md:[WebkitMaskImage:none]">
                  <div className="h-full overflow-y-auto hide-scrollbar pb-16 md:pb-0">
                    <ul className="space-y-4 md:space-y-6 lg:space-y-8 text-zinc-300">
                      {exp.details.map((detail) => (
                        <li key={detail} className="flex items-start">
                          <span className="mr-3 mt-2 h-2 w-2 rounded-full bg-zinc-500 shrink-0 shadow-[0_0_8px_rgba(161,161,170,0.35)]" />
                          <span className="leading-relaxed font-light text-sm md:text-base lg:text-lg tracking-wide">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[150%] bg-gradient-to-l from-zinc-800/20 to-transparent pointer-events-none rounded-full blur-3xl opacity-50" />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:flex w-24 md:w-32 h-1.5 mx-auto gap-2 overflow-hidden mt-4 shrink-0">
          {experiences.map((exp, i) => (
            <div
              key={exp.company}
              onClick={() => scrollTo(i)}
              className={`flex-1 h-full rounded-full cursor-pointer transition-colors duration-300 ${i === currentIndex ? "bg-zinc-500" : "bg-zinc-800 hover:bg-zinc-700"}`}
            />
          ))}
        </div>
      </div>

      {activeExperience !== null && (
        <div className="md:hidden fixed inset-0 z-[100] flex items-end justify-center bg-zinc-950/80 backdrop-blur-sm px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]" onClick={() => setActiveExperience(null)}>
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-[50dvh] max-h-[50dvh] rounded-[2rem] bg-zinc-900 ring-1 ring-inset ring-zinc-800 shadow-2xl p-6 pb-8 overflow-hidden flex flex-col"
          >
            <div className="flex items-start justify-between gap-4 mb-5 shrink-0">
              <div>
                <span className="inline-flex px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs font-mono mb-3">
                  {experiences[activeExperience].period}
                </span>
                <h3 className="text-2xl font-bold text-white leading-tight mb-1">{experiences[activeExperience].role}</h3>
                <div className="text-zinc-400 font-medium text-sm">{experiences[activeExperience].company}</div>
              </div>
              <button type="button" onClick={() => setActiveExperience(null)} className="w-9 h-9 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0" aria-label="关闭经历详情">
                <X className="w-4 h-4 text-zinc-300" />
              </button>
            </div>
            <div
              ref={mobileExperienceDetailRef}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain hide-scrollbar pr-1 [mask-image:linear-gradient(to_bottom,black_94%,transparent_100%)] [WebkitMaskImage:linear-gradient(to_bottom,black_94%,transparent_100%)]"
            >
              <ul className="space-y-4 text-zinc-300">
                {experiences[activeExperience].details.map((detail) => (
                  <li key={detail} className="flex items-start">
                    <span className="mr-3 mt-2 h-2 w-2 rounded-full bg-zinc-500 shrink-0 shadow-[0_0_8px_rgba(161,161,170,0.35)]" />
                    <span className="leading-relaxed font-light text-sm tracking-wide">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </SectionWrapper>
  );
};

const ContactSection = () => {
  const [contactFeedback, setContactFeedback] = useState<{ label: string; message: string } | null>(null);
  const contacts = [
    { label: "邮箱", value: "2541955489@qq.com", icon: Mail, action: "copy", copyValue: "2541955489@qq.com" },
    { label: "电话", value: "151-8043-4859", icon: Phone, action: "phone", copyValue: "151-8043-4859" },
    { label: "方向", value: "财务主管 / 全盘会计", icon: Globe, action: "copy", copyValue: "财务主管 / 全盘会计" },
    { label: "简历", value: "下载完整PDF", icon: FileText, action: "download", href: "./resume.pdf" },
  ];

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
  };

  const showFeedback = (label: string, message: string) => {
    setContactFeedback({ label, message });
    window.setTimeout(() => setContactFeedback(null), 1500);
  };

  const handleContactClick = async (contact: typeof contacts[number]) => {
    if ((contact.action === "copy" || contact.action === "phone") && contact.copyValue) {
      await copyText(contact.copyValue);
      showFeedback(contact.label, "已复制");

      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (contact.action === "phone" && isMobile) {
        window.setTimeout(() => {
          window.location.href = `tel:${contact.copyValue.replace(/\D/g, "")}`;
        }, 450);
      }
      return;
    }

    if (contact.action === "download" && contact.href) {
      showFeedback(contact.label, "下载中");
      const link = document.createElement("a");
      link.href = contact.href;
      link.download = "王艳梅-财务主管-15180434859.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <SectionWrapper id="contact" className="bg-zinc-950 text-zinc-200">
      <div className="flex flex-col h-full w-full">
        <SectionHeader
          subtitle="Contact"
          title="联系我"
          desc="可承接财务主管、全盘会计、多主体账税管理、合同付款审核、预算资金跟进与月度财务汇报相关工作"
        />

        <div className="flex-1 min-h-0 w-full relative flex flex-col justify-start pb-0 md:pb-16">
          <div className="w-full mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8 items-center">
            {contacts.map((contact, i) => (
              <motion.div
                key={contact.label}
                role="button"
                tabIndex={0}
                whileHover={{ y: -5 }}
                onClick={() => handleContactClick(contact)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleContactClick(contact);
                  }
                }}
                className="relative overflow-hidden bg-zinc-900 rounded-2xl md:rounded-3xl p-6 lg:p-8 flex flex-col items-center justify-center hover:bg-zinc-800 transition-all duration-300 cursor-pointer shadow-xl ring-1 ring-inset ring-transparent hover:ring-zinc-700 w-full group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 mb-4 md:mb-5 transition-all duration-500 group-hover:scale-110 group-hover:border-zinc-600">
                  <contact.icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-zinc-500 transition-colors duration-300 group-hover:text-white" />
                </div>
                <div className="text-center flex flex-col justify-center min-w-0">
                  <h4 className="text-white text-base md:text-lg lg:text-xl font-medium mb-1.5">{contact.label}</h4>
                  <p className="text-zinc-400 text-xs md:text-sm lg:text-base transition-colors group-hover:text-zinc-300 truncate">{contact.value}</p>
                </div>
                {contactFeedback?.label === contact.label && (
                  <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/86 backdrop-blur-sm">
                    <span className="rounded-full border border-zinc-700 bg-zinc-900/95 px-5 py-2 text-sm md:text-base font-medium text-white shadow-xl">
                      {contactFeedback.message}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 w-full text-center text-zinc-600 text-sm font-mono tracking-wider pointer-events-none hidden md:block z-10">
        © 2026 WANGYANMEI
      </div>
    </SectionWrapper>
  );
};

export default function App() {
  return (
    <div className="bg-zinc-950 text-white font-sans selection:bg-zinc-800 selection:text-white h-[100dvh] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth relative overflow-x-hidden hide-scrollbar">
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      <Navbar />
      <div className="w-full relative">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ContactSection />
      </div>

      <div className="md:hidden fixed bottom-4 left-0 w-full text-center text-zinc-600 text-[10px] font-mono tracking-widest pointer-events-none z-50 mix-blend-difference">
        © 2026 WANGYANMEI
      </div>
    </div>
  );
}

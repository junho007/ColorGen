import React, { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { Check, Shuffle, Moon, Sun, CreditCard, ArrowUpRight, ArrowDownRight, Activity, Bell, Settings, PieChart, Palette, Send, CheckCircle2, Search, ChevronLeft, ChevronRight, UploadCloud, MoreHorizontal, Star, Info, Copy, ChevronDown, ChevronUp, Sparkles, AlertTriangle, Coffee, MessageSquare } from 'lucide-react';

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const tailwindColors = [
  { name: 'Red', hex: 'ef4444' }, { name: 'Orange', hex: 'f97316' }, { name: 'Amber', hex: 'f59e0b' },
  { name: 'Yellow', hex: 'eab308' }, { name: 'Lime', hex: '84cc16' }, { name: 'Green', hex: '22c55e' },
  { name: 'Emerald', hex: '10b981' }, { name: 'Teal', hex: '14b8a6' }, { name: 'Cyan', hex: '06b6d4' },
  { name: 'Sky', hex: '0ea5e9' }, { name: 'Blue', hex: '3b82f6' }, { name: 'Indigo', hex: '6366f1' },
  { name: 'Violet', hex: '8b5cf6' }, { name: 'Purple', hex: 'a855f7' }, { name: 'Fuchsia', hex: 'd946ef' },
  { name: 'Pink', hex: 'ec4899' }, { name: 'Rose', hex: 'f43f5e' }, { name: 'Slate', hex: '64748b' },
  { name: 'Gray', hex: '6b7280' }, { name: 'Zinc', hex: '71717a' }, { name: 'Neutral', hex: '737373' },
  { name: 'Stone', hex: '78716c' }
];

const trendingColors = [
  { name: 'Very Peri', hex: '6667AB' }, { name: 'Classic Blue', hex: '0F4C81' },
  { name: 'Living Coral', hex: 'FF6F61' }, { name: 'Ultra Violet', hex: '5F4B8B' },
  { name: 'Greenery', hex: '88B04B' }, { name: 'Rose Quartz', hex: 'F7CAC9' }
];

const recommendedGradients = [
  { name: 'Sunset', c1: '#f59e0b', c2: '#ef4444' },
  { name: 'Ocean', c1: '#0ea5e9', c2: '#3b82f6' },
  { name: 'Forest', c1: '#10b981', c2: '#047857' },
  { name: 'Berry', c1: '#d946ef', c2: '#9333ea' },
  { name: 'Mango', c1: '#facc15', c2: '#f97316' },
  { name: 'Skyline', c1: '#38bdf8', c2: '#818cf8' },
  { name: 'Fire', c1: '#f97316', c2: '#dc2626' },
  { name: 'Night', c1: '#334155', c2: '#0f172a' },
  { name: 'Neon', c1: '#22d3ee', c2: '#a855f7' },
  { name: 'Matcha', c1: '#bef264', c2: '#22c55e' },
  { name: 'Lava', c1: '#f43f5e', c2: '#9f1239' },
  { name: 'Grape', c1: '#c084fc', c2: '#6b21a8' }
];

function generatePalette(hex: string) {
  if (!chroma.valid(hex)) return null;

  const lightnessMap: Record<number, number> = {
    50: 98, 100: 95, 200: 90, 300: 80, 400: 70, 500: 60,
    600: 50, 700: 40, 800: 30, 900: 20, 950: 10
  };

  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const l = chroma(hex).get('lab.l');

  let closestShade = 500;
  let minDiff = Infinity;

  for (const shade of shades) {
    const diff = Math.abs(lightnessMap[shade] - l);
    if (diff < minDiff) {
      minDiff = diff;
      closestShade = shade;
    }
  }

  const matchDecimal = closestShade / 1000;
  const scale = chroma.scale(['#ffffff', hex, '#000000']).domain([0, matchDecimal, 1]);

  const palette: Record<number, string> = {};
  for (const shade of shades) {
    palette[shade] = scale(shade / 1000).hex();
  }

  palette[closestShade] = chroma(hex).hex();

  return palette as any;
}

function getContrastColor(hex: string) {
  return chroma(hex).luminance() > 0.4 ? '#0f172a' : '#ffffff';
}

function getWCAG(hex: string, bg: string) {
  const ratio = chroma.contrast(hex, bg);
  let rating = 'Fail';
  if (ratio >= 7) rating = 'AAA';
  else if (ratio >= 4.5) rating = 'AA';
  return { ratio: ratio.toFixed(2), rating };
}

function WCAGPaletteRow({ title, palette, baseHex }: { title: string, palette: Record<number, string>, baseHex?: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {shades.map((shade) => {
          const hex = palette[shade];
          const textColor = getContrastColor(hex);
          const wcagW = getWCAG(hex, '#ffffff');
          const wcagB = getWCAG(hex, '#000000');
          const isBase = baseHex && chroma(hex).hex() === chroma(baseHex).hex();
          
          const getBadgeClass = (rating: string) => {
            if (rating === 'Fail') return 'bg-red-500 text-white';
            if (textColor === '#ffffff') return 'bg-white/20 text-white';
            return 'bg-black/10 text-black';
          };

          return (
            <div
              key={shade}
              className="relative flex flex-col h-40 rounded-xl p-4 overflow-hidden shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              style={{ backgroundColor: hex, color: textColor }}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-bold text-xl opacity-90">{shade}</span>
                  <span className="font-mono text-xs opacity-75 uppercase mt-1">{hex}</span>
                </div>
                {isBase && <Star size={16} className="fill-current opacity-75" />}
              </div>
              
              <div className="mt-auto pt-3 border-t flex flex-col gap-2" style={{ borderColor: textColor === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}>
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-80 font-medium">vs White Text</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono opacity-60">{wcagW.ratio}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-bold leading-none ${getBadgeClass(wcagW.rating)}`}>{wcagW.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-80 font-medium">vs Black Text</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono opacity-60">{wcagB.ratio}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-bold leading-none ${getBadgeClass(wcagB.rating)}`}>{wcagB.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SimplePaletteRow({ title, palette, onCopy, copiedSwatch, paletteId, baseHex }: { title: string, palette: Record<number, string>, onCopy: (hex: string, shade: number, pid: string) => void, copiedSwatch: { shade: number, pid: string } | null, paletteId: string, baseHex?: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-11 gap-2">
        {shades.map((shade) => {
          const hex = palette[shade];
          const textColor = getContrastColor(hex);
          const isCopied = copiedSwatch?.shade === shade && copiedSwatch?.pid === paletteId;
          const isBase = baseHex && chroma(hex).hex() === chroma(baseHex).hex();

          return (
            <div
              key={shade}
              onClick={() => onCopy(hex, shade, paletteId)}
              className="group relative flex flex-col justify-between h-24 sm:h-28 rounded-md p-2.5 cursor-pointer select-none overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
              style={{ backgroundColor: hex, color: textColor }}
            >
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base opacity-90">{shade}</span>
                {isBase && <Star size={12} className="fill-current mt-1 opacity-75" />}
              </div>
              <span className="font-mono text-[10px] sm:text-xs opacity-75 uppercase">{hex}</span>

              <div className={`absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px] transition-opacity duration-200 ${isCopied ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-slate-900 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                  <Check size={12} className="text-emerald-400" /> Copied
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TwoColorUIPreviews({ p1, p2 }: { p1: Record<number, string>, p2: Record<number, string> }) {
  const cssVars = {
    '--p1-50': p1[50], '--p1-100': p1[100], '--p1-500': p1[500], '--p1-600': p1[600], '--p1-900': p1[900],
    '--p2-50': p2[50], '--p2-100': p2[100], '--p2-200': p2[200], '--p2-500': p2[500], '--p2-600': p2[600], '--p2-700': p2[700], '--p2-900': p2[900],
  } as React.CSSProperties;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={cssVars}>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Overview</h3>
          <span className="bg-[var(--p2-500)] text-white px-2 py-1 rounded text-xs font-bold">New</span>
        </div>
        <div className="space-y-4">
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--p1-500)] w-3/4"></div>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--p2-500)] w-1/2"></div>
          </div>
        </div>
        <button className="w-full mt-6 bg-[var(--p1-500)] text-white py-2 rounded-md text-sm font-semibold">Action</button>
      </div>

      <div className="bg-[var(--p1-900)] p-6 rounded-md shadow-sm text-white flex flex-col justify-between">
        <p className="text-[var(--p1-100)] text-sm font-medium">Total Revenue</p>
        <h3 className="text-3xl font-bold mt-2 mb-6">$124,500</h3>
        <div className="flex items-center gap-2 text-[var(--p2-500)] bg-[var(--p2-900)]/30 w-fit px-2 py-1 rounded text-xs font-bold">
          <ArrowUpRight size={14} /> +14.5%
        </div>
      </div>

      <div className="bg-[var(--p2-50)] dark:bg-[var(--p2-900)]/20 border border-[var(--p2-200)] dark:border-[var(--p2-800)] p-6 rounded-md shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-[var(--p2-600)] dark:text-[var(--p2-400)] shrink-0" size={20} />
          <div>
            <h4 className="text-sm font-bold text-[var(--p2-900)] dark:text-[var(--p2-100)]">Action Required</h4>
            <p className="text-xs text-[var(--p2-700)] dark:text-[var(--p2-300)] mt-1 mb-3">Please update your billing information to continue using premium features.</p>
            <button className="bg-[var(--p2-500)] text-white px-3 py-1.5 rounded text-xs font-bold shadow-sm">Update Billing</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UIPreviews({ p1, p2 }: { p1: Record<number, string>, p2?: Record<number, string> }) {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, shade: '', hex: '' });

  if (!p1) return null;
  
  const cssVars = {
    '--p-50': p1[50], '--p-100': p1[100], '--p-200': p1[200], '--p-300': p1[300],
    '--p-400': p1[400], '--p-500': p1[500], '--p-600': p1[600], '--p-700': p1[700],
    '--p-800': p1[800], '--p-900': p1[900], '--p-950': p1[950],
    '--s-50': p2 ? p2[50] : p1[50], '--s-100': p2 ? p2[100] : p1[100],
    '--s-200': p2 ? p2[200] : p1[200], '--s-300': p2 ? p2[300] : p1[300],
    '--s-400': p2 ? p2[400] : p1[400], '--s-500': p2 ? p2[500] : p1[500],
    '--s-600': p2 ? p2[600] : p1[600], '--s-700': p2 ? p2[700] : p1[700],
    '--s-800': p2 ? p2[800] : p1[800], '--s-900': p2 ? p2[900] : p1[900],
    '--s-950': p2 ? p2[950] : p1[950],
  } as React.CSSProperties;

  const handleMouseMove = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const colorEl = target.closest('[data-shade]') as HTMLElement;
    if (colorEl) {
      setTooltip({
        show: true,
        x: e.clientX,
        y: e.clientY,
        shade: colorEl.getAttribute('data-shade') || '',
        hex: colorEl.getAttribute('data-hex') || ''
      });
    } else {
      setTooltip(prev => ({ ...prev, show: false }));
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative" 
      style={cssVars}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip */}
      {tooltip.show && tooltip.shade && (
        <div
          className="fixed z-50 pointer-events-none bg-slate-900/95 dark:bg-white/95 backdrop-blur-md text-white dark:text-slate-900 text-xs rounded-xl shadow-2xl p-3 flex flex-col gap-3 border border-slate-700/50 dark:border-slate-200/50 min-w-[140px]"
          style={{ left: tooltip.x + 16, top: tooltip.y + 16 }}
        >
          {tooltip.shade.split(', ').map((s, i) => {
            const hexList = tooltip.hex.split(' / ');
            const [prop, val] = s.split(': ');
            const propName = prop === 'bg' ? 'Background' : prop === 'text' ? 'Text' : prop === 'border' ? 'Border' : prop === 'focus' ? 'Focus' : prop === 'dark-bg' ? 'Dark Bg' : prop === 'dark-text' ? 'Dark Text' : prop === 'dark-border' ? 'Dark Border' : prop === 'dark-focus' ? 'Dark Focus' : prop;
            return (
              <div key={i} className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded-full shadow-inner border border-white/10 dark:border-black/10 shrink-0" 
                  style={{ backgroundColor: hexList[i] }} 
                />
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold">{propName} <span className="opacity-60 font-normal">{val}</span></span>
                  <span className="font-mono text-[10px] opacity-70 uppercase mt-0.5">{hexList[i]}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Card 1: Balance */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Balance</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">$24,562.00</h3>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-[var(--s-600)] dark:text-[var(--s-400)] bg-[var(--s-50)] dark:bg-[var(--s-900)]/40 px-2 py-1 rounded-md" data-shade={p2 ? "bg: Sec 50, text: Sec 600" : "bg: 50, text: 600"} data-hex={p2 ? `${p2[50]} / ${p2[600]}` : `${p1[50]} / ${p1[600]}`}>
            <ArrowUpRight size={14} /> +2.4%
          </span>
        </div>
        <div className="mt-auto flex gap-3">
          <button className="flex-1 bg-[var(--p-500)] hover:bg-[var(--p-600)] text-white py-2.5 rounded-md text-sm font-semibold shadow-sm transition-colors" data-shade="bg: 500" data-hex={p1[500]}>
            Send
          </button>
          <button className="flex-1 bg-[var(--s-100)] dark:bg-[var(--s-900)]/40 hover:bg-[var(--s-200)] dark:hover:bg-[var(--s-800)]/60 text-[var(--s-700)] dark:text-[var(--s-300)] py-2.5 rounded-md text-sm font-semibold shadow-sm transition-colors" data-shade={p2 ? "bg: Sec 100, text: Sec 700" : "bg: 100, text: 700"} data-hex={p2 ? `${p2[100]} / ${p2[700]}` : `${p1[100]} / ${p1[700]}`}>
            Receive
          </button>
        </div>
      </div>

      {/* Card 2: Transactions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Transactions</h4>
          <button className="text-xs font-medium text-[var(--s-600)] dark:text-[var(--s-400)] hover:text-[var(--s-700)] dark:hover:text-[var(--s-300)] transition-colors" data-shade={p2 ? "text: Sec 600" : "text: 600"} data-hex={p2 ? p2[600] : p1[600]}>View All</button>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Stripe Transfer', date: 'Today, 2:45 PM', amount: '+$1,200.00', pos: true },
            { name: 'AWS Services', date: 'Yesterday, 10:20 AM', amount: '-$145.20', pos: false },
            { name: 'Team Lunch', date: 'Oct 24, 1:15 PM', amount: '-$84.50', pos: false },
          ].map((tx, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${tx.pos ? 'bg-[var(--s-100)] dark:bg-[var(--s-900)]/40 text-[var(--s-600)] dark:text-[var(--s-400)]' : 'bg-[var(--p-100)] dark:bg-[var(--p-900)]/40 text-[var(--p-600)] dark:text-[var(--p-400)]'}`}
                  data-shade={tx.pos ? (p2 ? 'bg: Sec 100, text: Sec 600' : 'bg: 100, text: 600') : 'bg: 100, text: 600'}
                  data-hex={tx.pos ? (p2 ? `${p2[100]} / ${p2[600]}` : `${p1[100]} / ${p1[600]}`) : `${p1[100]} / ${p1[600]}`}
                >
                  {tx.pos ? <ArrowDownRight size={16} /> : <CreditCard size={16} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{tx.name}</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{tx.date}</p>
                </div>
              </div>
              <span 
                className={`text-sm font-semibold ${tx.pos ? 'text-[var(--s-600)] dark:text-[var(--s-400)]' : 'text-slate-900 dark:text-white'}`}
                data-shade={tx.pos ? (p2 ? 'text: Sec 600' : 'text: 600') : undefined}
                data-hex={tx.pos ? (p2 ? p2[600] : p1[600]) : undefined}
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3: Settings */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-2 mb-5">
          <Settings size={16} className="text-[var(--s-500)]" data-shade={p2 ? "text: Sec 500" : "text: 500"} data-hex={p2 ? p2[500] : p1[500]} />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Settings</h4>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Email Address</label>
            <input 
              type="email" 
              defaultValue="hello@example.com" 
              className="w-full px-3 py-2 bg-transparent border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[var(--s-500)] focus:ring-1 focus:ring-[var(--s-500)] transition-all" 
              data-shade={p2 ? "focus: Sec 500" : "focus: 500"} 
              data-hex={p2 ? p2[500] : p1[500]}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Push Notifications</span>
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Receive alerts on your phone</span>
            </div>
            <div className="w-10 h-5 bg-[var(--p-500)] rounded-full relative shrink-0 transition-colors" data-shade="bg: 500" data-hex={p1[500]}>
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Auto-invest</span>
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Automatically invest spare change</span>
            </div>
            <div className="w-10 h-5 bg-[var(--s-500)] rounded-full relative shrink-0 transition-colors" data-shade={p2 ? "bg: Sec 500" : "bg: 500"} data-hex={p2 ? p2[500] : p1[500]}>
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2 flex flex-col transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <PieChart size={16} className="text-[var(--p-500)]" data-shade="text: 500" data-hex={p1[500]} />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Weekly Activity</h4>
          </div>
          <button className="text-xs font-semibold text-[var(--s-600)] dark:text-[var(--s-400)] transition-colors" data-shade={p2 ? "text: Sec 600" : "text: 600"} data-hex={p2 ? p2[600] : p1[600]}>View Report</button>
        </div>
        <div className="flex-1 flex items-end gap-2 sm:gap-4 h-40 mt-auto">
          {[
            { h: 40, label: 'Mon', shade: 300 },
            { h: 70, label: 'Tue', shade: 400 },
            { h: 45, label: 'Wed', shade: 500 },
            { h: 90, label: 'Thu', shade: 600 },
            { h: 65, label: 'Fri', shade: 700 },
            { h: 85, label: 'Sat', shade: 800 },
            { h: 100, label: 'Sun', shade: 900 }
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end gap-2 group h-full">
              <div 
                className="w-full rounded-t-md transition-all duration-300" 
                style={{ 
                  height: `${item.h}%`,
                  backgroundColor: `var(--p-${item.shade})`
                }}
                data-shade={`bg: ${item.shade}`}
                data-hex={p1[item.shade as keyof typeof p1]}
              ></div>
              <span className="text-center text-xs text-slate-400 font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 5: Badges & Alerts */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-2 mb-5">
          <Bell size={16} className="text-[var(--s-500)]" data-shade={p2 ? "text: Sec 500" : "text: 500"} data-hex={p2 ? p2[500] : p1[500]} />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Status & Alerts</h4>
        </div>
        
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Badges</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-[var(--s-100)] dark:bg-[var(--s-900)]/40 text-[var(--s-700)] dark:text-[var(--s-300)] text-xs font-semibold rounded-md border border-[var(--s-200)] dark:border-[var(--s-800)] transition-colors" data-shade={p2 ? "bg: Sec 100, text: Sec 700, border: Sec 200" : "bg: 100, text: 700, border: 200"} data-hex={p2 ? `${p2[100]} / ${p2[700]} / ${p2[200]}` : `${p1[100]} / ${p1[700]} / ${p1[200]}`}>Pending</span>
              <span className="px-2.5 py-1 bg-[var(--p-500)] text-white text-xs font-semibold rounded-md shadow-sm transition-colors" data-shade="bg: 500" data-hex={p1[500]}>Active</span>
              <span className="px-2.5 py-1 bg-[var(--p-50)] dark:bg-[var(--p-900)]/40 text-[var(--p-700)] dark:text-[var(--p-300)] text-xs font-semibold rounded-md border border-[var(--p-200)] dark:border-[var(--p-800)] transition-colors" data-shade="bg: 50, text: 700, border: 200" data-hex={`${p1[50]} / ${p1[700]} / ${p1[200]}`}>Archived</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Inline Alert</p>
            <div className="p-3.5 bg-[var(--s-50)] dark:bg-[var(--s-900)]/30 border border-[var(--s-200)] dark:border-[var(--s-800)] rounded-md flex gap-3 transition-colors" data-shade={p2 ? "bg: Sec 50, border: Sec 200" : "bg: 50, border: 200"} data-hex={p2 ? `${p2[50]} / ${p2[200]}` : `${p1[50]} / ${p1[200]}`}>
              <Activity size={16} className="text-[var(--s-600)] dark:text-[var(--s-400)] shrink-0 mt-0.5" data-shade={p2 ? "text: Sec 600" : "text: 600"} data-hex={p2 ? p2[600] : p1[600]} />
              <div>
                <p className="text-sm font-semibold text-[var(--s-900)] dark:text-[var(--s-100)]" data-shade={p2 ? "text: Sec 900" : "text: 900"} data-hex={p2 ? p2[900] : p1[900]}>Statement Ready</p>
                <p className="text-xs font-medium text-[var(--s-700)] dark:text-[var(--s-300)] mt-1 leading-relaxed" data-shade={p2 ? "text: Sec 700" : "text: 700"} data-hex={p2 ? p2[700] : p1[700]}>Your monthly statement for October is ready to download.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 6: Messaging */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Support Team</h4>
              <p className="text-xs text-[var(--s-600)] dark:text-[var(--s-400)]" data-shade={p2 ? "text: Sec 600" : "text: 600"} data-hex={p2 ? p2[600] : p1[600]}>Online</p>
            </div>
          </div>
          <MoreHorizontal size={16} className="text-slate-400" />
        </div>
        <div className="space-y-4 mb-4">
          <div className="flex gap-3">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-r-xl rounded-bl-xl text-sm text-slate-800 dark:text-slate-200">
              How can we help you today?
            </div>
          </div>
          <div className="flex gap-3 flex-row-reverse">
            <div className="bg-[var(--p-500)] text-white p-3 rounded-l-xl rounded-br-xl text-sm shadow-sm" data-shade="bg: 500" data-hex={p1[500]}>
              I need help upgrading my plan.
            </div>
          </div>
        </div>
        <div className="flex gap-2 relative">
          <input type="text" placeholder="Type a message..." className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[var(--s-500)] focus:ring-1 focus:ring-[var(--s-500)]" data-shade={p2 ? "focus: Sec 500" : "focus: 500"} data-hex={p2 ? p2[500] : p1[500]} />
          <button className="w-9 h-9 rounded-full bg-[var(--s-500)] text-white flex items-center justify-center transition-colors shrink-0 shadow-sm" data-shade={p2 ? "bg: Sec 500" : "bg: 500"} data-hex={p2 ? p2[500] : p1[500]}>
            <Send size={14} className="ml-0.5" />
          </button>
        </div>
      </div>

      {/* Card 7: Pricing Plan */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-md border-2 border-[var(--p-500)] shadow-md transition-colors relative" data-shade="border: 500" data-hex={p1[500]}>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--s-500)] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm" data-shade={p2 ? "bg: Sec 500" : "bg: 500"} data-hex={p2 ? p2[500] : p1[500]}>Most Popular</div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white text-center mt-2">Pro Plan</h4>
        <div className="text-center mt-4 mb-6">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$29</span>
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">/mo</span>
        </div>
        <ul className="space-y-3 mb-6 text-sm text-slate-600 dark:text-slate-300 font-medium">
          <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[var(--s-500)]" data-shade={p2 ? "text: Sec 500" : "text: 500"} data-hex={p2 ? p2[500] : p1[500]}/> Unlimited projects</li>
          <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[var(--s-500)]" data-shade={p2 ? "text: Sec 500" : "text: 500"} data-hex={p2 ? p2[500] : p1[500]}/> Advanced analytics</li>
          <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[var(--s-500)]" data-shade={p2 ? "text: Sec 500" : "text: 500"} data-hex={p2 ? p2[500] : p1[500]}/> 24/7 Support</li>
        </ul>
        <button className="w-full bg-[var(--p-500)] text-white py-2.5 rounded-md text-sm font-semibold transition-colors shadow-sm" data-shade="bg: 500" data-hex={p1[500]}>Get Started</button>
      </div>

      {/* Card 8: Upload Document */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm transition-colors flex flex-col justify-center">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Upload Document</h4>
        <div className="border-2 border-dashed border-[var(--s-300)] dark:border-[var(--s-700)] bg-[var(--s-50)]/50 dark:bg-[var(--s-900)]/20 rounded-md p-8 flex flex-col items-center justify-center text-center transition-colors" data-shade={p2 ? "border: Sec 300, bg: Sec 50" : "border: 300, bg: 50"} data-hex={p2 ? `${p2[300]} / ${p2[50]}` : `${p1[300]} / ${p1[50]}`}>
          <div className="w-12 h-12 rounded-full bg-[var(--s-100)] dark:bg-[var(--s-800)] flex items-center justify-center mb-3 text-[var(--s-600)] dark:text-[var(--s-400)]" data-shade={p2 ? "bg: Sec 100, text: Sec 600" : "bg: 100, text: 600"} data-hex={p2 ? `${p2[100]} / ${p2[600]}` : `${p1[100]} / ${p1[600]}`}>
            <UploadCloud size={24} />
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Click to upload</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">or drag and drop</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">PDF, PNG, JPG up to 10MB</p>
        </div>
      </div>

      {/* Card 9: Orders Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm transition-colors lg:col-span-2">
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Orders</h4>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md text-xs focus:outline-none focus:border-[var(--s-500)] focus:ring-1 focus:ring-[var(--s-500)]" data-shade={p2 ? "focus: Sec 500" : "focus: 500"} data-hex={p2 ? p2[500] : p1[500]} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-semibold w-8">
                  <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600"></div>
                </th>
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 dark:border-slate-800/50 transition-colors">
                <td className="py-3">
                  <div className="w-4 h-4 rounded bg-[var(--s-500)] border border-[var(--s-500)] flex items-center justify-center" data-shade={p2 ? "bg: Sec 500" : "bg: 500"} data-hex={p2 ? p2[500] : p1[500]}>
                    <Check size={10} className="text-white" />
                  </div>
                </td>
                <td className="py-3 font-mono text-slate-600 dark:text-slate-400 text-xs">#ORD-001</td>
                <td className="py-3 text-slate-900 dark:text-white font-medium">Michael Scott</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-[var(--s-50)] dark:bg-[var(--s-900)]/40 text-[var(--s-700)] dark:text-[var(--s-300)] text-[10px] font-bold uppercase tracking-wider rounded-md border border-[var(--s-200)] dark:border-[var(--s-800)]" data-shade={p2 ? "bg: Sec 50, text: Sec 700" : "bg: 50, text: 700"} data-hex={p2 ? `${p2[50]} / ${p2[700]}` : `${p1[50]} / ${p1[700]}`}>Delivered</span>
                </td>
                <td className="py-3 text-right font-medium text-slate-900 dark:text-white">$120.00</td>
              </tr>
              <tr className="transition-colors">
                <td className="py-3">
                  <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600"></div>
                </td>
                <td className="py-3 font-mono text-slate-600 dark:text-slate-400 text-xs">#ORD-002</td>
                <td className="py-3 text-slate-900 dark:text-white font-medium">Dwight Schrute</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-200 dark:border-amber-800/50">Processing</span>
                </td>
                <td className="py-3 text-right font-medium text-slate-900 dark:text-white">$845.50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 10: Calendar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">October 2026</h4>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-[var(--s-500)]" data-shade={p2 ? "text: Sec 500" : "text: 500"} data-hex={p2 ? p2[500] : p1[500]}><ChevronLeft size={16}/></button>
            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-[var(--s-500)]" data-shade={p2 ? "text: Sec 500" : "text: 500"} data-hex={p2 ? p2[500] : p1[500]}><ChevronRight size={16}/></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-slate-400 font-medium py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-sm">
          {Array.from({length: 31}).map((_, i) => {
            const day = i + 1;
            const isSelected = day === 14;
            const isToday = day === 24;
            const hasEvent = day === 18 || day === 22;
            
            return (
              <div 
                key={day} 
                className={`aspect-square flex flex-col items-center justify-center rounded-md relative ${isSelected ? 'bg-[var(--p-500)] text-white font-bold shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'} ${isToday ? 'text-[var(--s-600)] dark:text-[var(--s-400)] font-bold' : ''}`} 
                data-shade={isSelected ? 'bg: 500' : isToday ? (p2 ? 'text: Sec 600' : 'text: 600') : undefined} 
                data-hex={isSelected ? p1[500] : isToday ? (p2 ? p2[600] : p1[600]) : undefined}
              >
                {day}
                {hasEvent && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--s-500)]" data-shade={p2 ? "bg: Sec 500" : "bg: 500"} data-hex={p2 ? p2[500] : p1[500]}></div>}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  );
}

export default function App() {
  const [draftColor, setDraftColor] = useState('0f4c81');
  const [activeColor, setActiveColor] = useState('#0f4c81');
  const [palette, setPalette] = useState<Record<number, string> | null>(null);
  const [copiedSwatch, setCopiedSwatch] = useState<{shade: number, pid: string} | null>(null);
  const [isDark, setIsDark] = useState(false);

  // New states
  const [activeTab, setActiveTab] = useState<'palette' | 'combination' | 'gradient' | 'wcag'>('palette');
  
  const [color2Draft, setColor2Draft] = useState('');
  const [color2, setColor2] = useState('');
  const [palette2, setPalette2] = useState<Record<number, string> | null>(null);

  const [gradMode, setGradMode] = useState<'current' | 'custom' | 'ai'>('current');
  const [gradC1, setGradC1] = useState({ p: 1, s: 500 });
  const [gradC2, setGradC2] = useState({ p: 2, s: 500 });
  const [customGradC1, setCustomGradC1] = useState('#3b82f6');
  const [customGradC2, setCustomGradC2] = useState('#8b5cf6');
  const [gradDir, setGradDir] = useState('to right');
  const [gradShape, setGradShape] = useState('linear'); 
  const [copiedGradCode, setCopiedGradCode] = useState(false);
  const [showGradCode, setShowGradCode] = useState(false);

  // Modal States
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedbackStatus('sending');
    const target = e.target as typeof e.target & {
      name: { value: string };
      email: { value: string };
      message: { value: string };
      reset: () => void;
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "54b9e182-c59a-4c8d-8159-04799aa0bbfe",
          name: target.name.value,
          email: target.email.value,
          message: target.message.value,
          subject: "New Feedback from ColorGen!",
          from_name: "ColorGen App"
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFeedbackStatus('success');
        setTimeout(() => {
          setShowFeedbackModal(false);
          setFeedbackStatus('idle');
          target.reset();
        }, 2000);
      } else {
        console.error("Submission failed", result);
        setFeedbackStatus('idle');
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      setFeedbackStatus('idle');
      alert("Network error. Please try again.");
    }
  };

  useEffect(() => {
    const randomHex = chroma.random().hex();
    setColor2Draft(randomHex.replace('#', ''));
    setColor2(randomHex);
  }, []);

  useEffect(() => {
    const p = generatePalette(activeColor);
    if (p) {
      setPalette(p);
      document.documentElement.style.setProperty('--logo-shade-200', p[200]);
      document.documentElement.style.setProperty('--logo-shade-300', p[300]);
      document.documentElement.style.setProperty('--logo-shade-500', p[500]);
      document.documentElement.style.setProperty('--logo-shade-700', p[700]);
      document.documentElement.style.setProperty('--logo-shade-800', p[800]);
    }
  }, [activeColor]);

  useEffect(() => {
    if (color2 && chroma.valid(color2)) {
      const p = generatePalette(color2);
      if (p) setPalette2(p);
    }
  }, [color2]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#020617'; 
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc'; 
    }
  }, [isDark]);

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setDraftColor(hex.replace('#', ''));
    setActiveColor(hex);
  };

  const generateRandomColor = () => {
    const randomHex = chroma.random().hex();
    setDraftColor(randomHex.replace('#', ''));
    setActiveColor(randomHex);
  };

  const copyToClipboard = (text: string, shade: number, pid: string = 'main') => {
    navigator.clipboard.writeText(text);
    setCopiedSwatch({ shade, pid });
    setTimeout(() => setCopiedSwatch(null), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Sidebar (Left) */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-8 lg:sticky lg:top-12 lg:h-[calc(100vh-6rem)] overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1.5 mb-2">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <rect x="4" y="4" width="24" height="4" rx="2" fill="var(--logo-shade-200)" />
                <rect x="4" y="9" width="24" height="4" rx="2" fill="var(--logo-shade-300)" />
                <rect x="4" y="14" width="24" height="4" rx="2" fill="var(--logo-shade-500)" />
                <rect x="4" y="19" width="24" height="4" rx="2" fill="var(--logo-shade-700)" />
                <rect x="4" y="24" width="24" height="4" rx="2" fill="var(--logo-shade-800)" />
              </svg>
              <h1 className="text-[28px] leading-none font-bold tracking-tight" style={{ fontFamily: 'Sora, sans-serif', color: isDark ? '#ffffff' : '#0b1621' }}>ColorGen</h1>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1">Color systems made simple and accessible.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Base Color</label>
              <div className="relative flex items-center w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-mono text-sm">#</span>
                </div>
                <input
                  type="text"
                  value={draftColor}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                    setDraftColor(val);
                    if (val.length === 6 && chroma.valid('#' + val)) {
                      setActiveColor('#' + val);
                    }
                  }}
                  className="block w-full pl-8 pr-12 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:ring-1 focus:ring-[var(--p-500)] focus:border-[var(--p-500)] text-base font-mono uppercase transition-all outline-none text-slate-900 dark:text-white shadow-sm"
                  placeholder="0F4C81"
                  style={{ '--p-500': palette?.[500] || '#0f4c81' } as React.CSSProperties}
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                  <div className="relative w-6 h-6 rounded overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0">
                    <input
                      type="color"
                      value={chroma.valid('#' + draftColor) ? chroma('#' + draftColor).hex() : '#ffffff'}
                      onChange={handleColorPickerChange}
                      className="absolute -inset-4 w-16 h-16 cursor-pointer opacity-0"
                    />
                    <div
                      className="w-full h-full pointer-events-none"
                      style={{ backgroundColor: chroma.valid('#' + draftColor) ? chroma('#' + draftColor).hex() : '#ffffff' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Color (Visible in Combination and WCAG tabs) */}
            {(activeTab === 'combination' || activeTab === 'wcag') && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Secondary Color</label>
                <div className="relative flex items-center w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-mono text-sm">#</span>
                  </div>
                  <input
                    type="text"
                    value={color2Draft}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                      setColor2Draft(val);
                      if (val.length === 6 && chroma.valid('#' + val)) {
                        setColor2('#' + val);
                      }
                    }}
                    className="block w-full pl-8 pr-12 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:ring-1 focus:ring-[var(--p-500)] focus:border-[var(--p-500)] text-base font-mono uppercase transition-all outline-none text-slate-900 dark:text-white shadow-sm"
                    placeholder="8B5CF6"
                    style={{ '--p-500': palette2?.[500] || '#8b5cf6' } as React.CSSProperties}
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                    <div className="relative w-6 h-6 rounded overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0">
                      <input
                        type="color"
                        value={chroma.valid('#' + color2Draft) ? chroma('#' + color2Draft).hex() : '#ffffff'}
                        onChange={(e) => {
                          const hex = e.target.value;
                          setColor2Draft(hex.replace('#', ''));
                          setColor2(hex);
                        }}
                        className="absolute -inset-4 w-16 h-16 cursor-pointer opacity-0"
                      />
                      <div
                        className="w-full h-full pointer-events-none"
                        style={{ backgroundColor: chroma.valid('#' + color2Draft) ? chroma('#' + color2Draft).hex() : '#ffffff' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              <button
                onClick={generateRandomColor}
                className="w-full flex items-center justify-center gap-2 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-md text-xs font-semibold transition-colors cursor-pointer select-none focus:outline-none"
              >
                <Shuffle size={14} /> Random
              </button>
              <button
                onClick={() => setIsDark(!isDark)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-semibold transition-colors shadow-sm cursor-pointer select-none focus:outline-none"
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
                {isDark ? 'Light' : 'Dark'}
              </button>
            </div>

            {/* Tailwind Colors */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Tailwind Colors</label>
              {/* Removed -mx-1 and added pl-1 to shift the block to the right */}
              <div className="flex flex-wrap gap-1.5 py-1 pl-1">
                {tailwindColors.map(tc => (
                  <button
                    key={tc.name}
                    onClick={() => {
                      setDraftColor(tc.hex);
                      setActiveColor('#' + tc.hex);
                    }}
                    className="w-7 h-7 rounded-md shadow-sm border border-black/5 dark:border-white/5 transition-transform hover:scale-110 relative hover:z-10 cursor-pointer"
                    style={{ backgroundColor: '#' + tc.hex }}
                    title={tc.name}
                  ></button>
                ))}
              </div>
            </div>

            {/* Trending Colors */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Trending Colors</label>
              <div className="grid grid-cols-3 gap-2">
                {trendingColors.map(tc => (
                  <button
                    key={tc.name}
                    onClick={() => {
                      setDraftColor(tc.hex);
                      setActiveColor('#' + tc.hex);
                    }}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full shadow-sm border border-black/5 dark:border-white/5" style={{ backgroundColor: '#' + tc.hex }} />
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 text-center leading-tight">{tc.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content (Right) */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Navigation Bar */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-full sm:w-fit mb-8 shadow-inner overflow-x-auto scrollbar-hide">
            {[
              { id: 'palette', label: 'Color Palette' },
              { id: 'combination', label: 'Color Combination' },
              { id: 'gradient', label: 'Gradient Builder' },
              { id: 'wcag', label: 'WCAG Accessibility' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none cursor-pointer select-none focus:outline-none ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Color Palette */}
          {activeTab === 'palette' && palette && (
            <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Color Palette</h2>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Click to copy HEX</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-11 gap-2">
                  {shades.map((shade) => {
                    const hex = palette[shade];
                    const textColor = getContrastColor(hex);
                    const isCopied = copiedSwatch?.shade === shade && copiedSwatch?.pid === 'main';
                    const isBase = chroma(hex).hex() === chroma(activeColor).hex();

                    return (
                      <div
                        key={shade}
                        onClick={() => copyToClipboard(hex, shade, 'main')}
                        className="group relative flex flex-col justify-between h-24 sm:h-28 rounded-md p-2.5 cursor-pointer select-none focus:outline-none overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
                        style={{ backgroundColor: hex, color: textColor }}
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-sm sm:text-base opacity-90">{shade}</span>
                          {isBase && <Star size={12} className="fill-current mt-1 opacity-75" />}
                        </div>
                        <span className="font-mono text-[10px] sm:text-xs opacity-75 uppercase">{hex}</span>

                        <div className={`absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px] transition-opacity duration-200 ${isCopied ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="bg-slate-900 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                            <Check size={12} className="text-emerald-400" /> Copied
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">UI Previews</h2>
                <UIPreviews p1={palette} />
              </div>
            </div>
          )}

          {/* Tab 2: Color Combination */}
          {activeTab === 'combination' && palette && palette2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Color Combination</h2>
              </div>

              {/* Color 2 Control */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 w-fit">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Secondary Color</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 font-mono text-sm">#</span>
                    <input
                      type="text"
                      value={color2Draft}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                        setColor2Draft(val);
                        if (val.length === 6 && chroma.valid('#' + val)) {
                          setColor2('#' + val);
                        }
                      }}
                      className="w-32 pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-[var(--p-500)] focus:border-[var(--p-500)] text-sm font-mono uppercase outline-none text-slate-900 dark:text-white"
                      style={{ '--p-500': palette2[500] } as React.CSSProperties}
                    />
                  </div>
                </div>
                <div className="relative w-10 h-10 rounded-md overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0 mt-4">
                  <input
                    type="color"
                    value={chroma.valid('#' + color2Draft) ? chroma('#' + color2Draft).hex() : '#ffffff'}
                    onChange={(e) => {
                      const hex = e.target.value;
                      setColor2Draft(hex.replace('#', ''));
                      setColor2(hex);
                    }}
                    className="absolute -inset-4 w-20 h-20 cursor-pointer opacity-0"
                  />
                  <div className="w-full h-full pointer-events-none" style={{ backgroundColor: chroma.valid('#' + color2Draft) ? chroma('#' + color2Draft).hex() : '#ffffff' }} />
                </div>
                <button
                  onClick={() => {
                    const randomHex = chroma.random().hex();
                    setColor2Draft(randomHex.replace('#', ''));
                    setColor2(randomHex);
                  }}
                  className="mt-4 p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                  title="Randomize Secondary Color"
                >
                  <Shuffle size={16} />
                </button>
              </div>

              {/* Palettes without WCAG */}
              <div className="space-y-8">
                <SimplePaletteRow title="Primary Palette" palette={palette} onCopy={copyToClipboard} copiedSwatch={copiedSwatch} paletteId="p1" baseHex={activeColor} />
                <SimplePaletteRow title="Secondary Palette" palette={palette2} onCopy={copyToClipboard} copiedSwatch={copiedSwatch} paletteId="p2" baseHex={color2} />
              </div>

              {/* Two Color UI Previews */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Combination Previews</h2>
                <TwoColorUIPreviews p1={palette} p2={palette2} />
              </div>
            </div>
          )}

          {/* Tab 3: Gradient Builder */}
          {activeTab === 'gradient' && palette && palette2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Advanced Gradient Builder</h2>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-8">
                {/* Controls */}
                <div className="w-full lg:w-72 shrink-0 space-y-6">
                  
                  {/* Mode Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Color Source</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                      {[
                        { id: 'current', label: 'Current' },
                        { id: 'custom', label: 'Custom' },
                        { id: 'ai', label: 'AI Gen' }
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setGradMode(m.id as any);
                            if (m.id === 'ai') {
                              const randomGrad = recommendedGradients[Math.floor(Math.random() * recommendedGradients.length)];
                              setCustomGradC1(randomGrad.c1);
                              setCustomGradC2(randomGrad.c2);
                            }
                          }}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${gradMode === m.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                    {gradMode === 'ai' && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 text-center">Click "AI Gen" again to generate a new combination.</p>
                    )}
                  </div>

                  {gradMode === 'current' ? (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Color 1 (From)</label>
                        <select 
                          value={`${gradC1.p}-${gradC1.s}`}
                          onChange={(e) => {
                            const [p, s] = e.target.value.split('-');
                            setGradC1({ p: parseInt(p), s: parseInt(s) });
                          }}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--p-500)]"
                          style={{ '--p-500': palette[500] } as React.CSSProperties}
                        >
                          <optgroup label="Primary Palette">
                            {shades.map(s => <option key={`1-${s}`} value={`1-${s}`}>Primary - {s}</option>)}
                          </optgroup>
                          <optgroup label="Secondary Palette">
                            {shades.map(s => <option key={`2-${s}`} value={`2-${s}`}>Secondary - {s}</option>)}
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Color 2 (To)</label>
                        <select 
                          value={`${gradC2.p}-${gradC2.s}`}
                          onChange={(e) => {
                            const [p, s] = e.target.value.split('-');
                            setGradC2({ p: parseInt(p), s: parseInt(s) });
                          }}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--p-500)]"
                          style={{ '--p-500': palette[500] } as React.CSSProperties}
                        >
                          <optgroup label="Primary Palette">
                            {shades.map(s => <option key={`1-${s}`} value={`1-${s}`}>Primary - {s}</option>)}
                          </optgroup>
                          <optgroup label="Secondary Palette">
                            {shades.map(s => <option key={`2-${s}`} value={`2-${s}`}>Secondary - {s}</option>)}
                          </optgroup>
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Color 1</label>
                        <div className="relative w-full h-10 rounded-lg overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer">
                          <input type="color" value={customGradC1} onChange={(e) => setCustomGradC1(e.target.value)} className="absolute -inset-4 w-full h-20 cursor-pointer opacity-0" />
                          <div className="w-full h-full pointer-events-none" style={{ backgroundColor: customGradC1 }} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Color 2</label>
                        <div className="relative w-full h-10 rounded-lg overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer">
                          <input type="color" value={customGradC2} onChange={(e) => setCustomGradC2(e.target.value)} className="absolute -inset-4 w-full h-20 cursor-pointer opacity-0" />
                          <div className="w-full h-full pointer-events-none" style={{ backgroundColor: customGradC2 }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Shape</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'linear', label: 'Linear' },
                        { id: 'radial', label: 'Radial' },
                        { id: 'random', label: 'Random' },
                      ].map(shape => (
                        <button
                          key={shape.id}
                          onClick={() => setGradShape(shape.id)}
                          className={`py-2 px-2 rounded-lg text-xs font-semibold transition-colors ${gradShape === shape.id ? 'bg-[var(--p-500)] text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                          style={{ '--p-500': palette[500] } as React.CSSProperties}
                        >
                          {shape.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {gradShape === 'linear' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Direction</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'to right', label: '→ Right' },
                          { id: 'to bottom right', label: '↘ Bottom Right' },
                          { id: 'to bottom', label: '↓ Bottom' },
                          { id: 'to top right', label: '↗ Top Right' },
                        ].map(dir => (
                          <button
                            key={dir.id}
                            onClick={() => setGradDir(dir.id)}
                            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${gradDir === dir.id ? 'bg-[var(--p-500)] text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            style={{ '--p-500': palette[500] } as React.CSSProperties}
                          >
                            {dir.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview & Code */}
                <div className="flex-1 space-y-6">
                  {(() => {
                    const c1Hex = gradMode === 'current' ? (gradC1.p === 1 ? palette[gradC1.s] : palette2[gradC1.s]) : customGradC1;
                    const c2Hex = gradMode === 'current' ? (gradC2.p === 1 ? palette[gradC2.s] : palette2[gradC2.s]) : customGradC2;
                    
                    let cssGradient = '';
                    let twClass = '';
                    
                    if (gradShape === 'linear') {
                      cssGradient = `linear-gradient(${gradDir}, ${c1Hex}, ${c2Hex})`;
                      const twDir = gradDir === 'to right' ? 'bg-gradient-to-r' : gradDir === 'to bottom' ? 'bg-gradient-to-b' : gradDir === 'to bottom right' ? 'bg-gradient-to-br' : 'bg-gradient-to-tr';
                      twClass = `${twDir} from-[${c1Hex}] to-[${c2Hex}]`;
                    } else if (gradShape === 'radial') {
                      cssGradient = `radial-gradient(circle, ${c1Hex}, ${c2Hex})`;
                      twClass = `bg-[radial-gradient(circle,_${c1Hex},_${c2Hex})]`;
                    } else if (gradShape === 'random') {
                      const shapes = [
                        `linear-gradient(135deg, ${c1Hex} 0%, ${c2Hex} 100%)`,
                        `radial-gradient(circle at top right, ${c1Hex}, ${c2Hex})`,
                        `conic-gradient(from 90deg at 40% 40%, ${c1Hex}, ${c2Hex})`,
                        `linear-gradient(to bottom, ${c1Hex}, ${c2Hex} 80%)`,
                      ];
                      cssGradient = shapes[Math.floor(Math.random() * shapes.length)];
                      twClass = `bg-[${cssGradient.replace(/ /g, '_')}]`;
                    }
                    
                    const codeString = `/* CSS */\nbackground-image: ${cssGradient};\n\n/* Tailwind CSS */\n<div className="${twClass}"></div>`;

                    return (
                      <>
                        <div 
                          className="w-full h-64 sm:h-80 rounded-2xl shadow-inner border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300"
                          style={{ backgroundImage: cssGradient }}
                        />
                        
                        <div className="bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-800">
                          <button 
                            onClick={() => setShowGradCode(!showGradCode)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border-b border-slate-800 transition-colors"
                          >
                            <span className="text-slate-400 font-mono text-xs flex items-center gap-2">
                              {showGradCode ? <ChevronUp size={14}/> : <ChevronDown size={14}/>} Generated Code
                            </span>
                            {showGradCode && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(codeString);
                                  setCopiedGradCode(true);
                                  setTimeout(() => setCopiedGradCode(false), 2000);
                                }}
                                className="text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                              >
                                {copiedGradCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                {copiedGradCode ? 'Copied!' : 'Copy Code'}
                              </div>
                            )}
                          </button>
                          
                          {showGradCode && (
                            <div className="p-4 overflow-x-auto animate-in slide-in-from-top-2 duration-200">
                              <pre><code className="text-slate-300 font-mono text-xs leading-relaxed">{codeString}</code></pre>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Recommended Gradients */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" /> Recommended Combinations
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recommendedGradients.map(grad => (
                    <div 
                      key={grad.name}
                      onClick={() => {
                        setGradMode('custom');
                        setCustomGradC1(grad.c1);
                        setCustomGradC2(grad.c2);
                      }}
                      className="group cursor-pointer"
                    >
                      <div 
                        className="w-full aspect-video rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 transition-transform group-hover:scale-105"
                        style={{ backgroundImage: `linear-gradient(to right, ${grad.c1}, ${grad.c2})` }}
                      />
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-2 text-center">{grad.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: WCAG Accessibility */}
          {activeTab === 'wcag' && palette && palette2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
              <div className="flex items-start justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-6 rounded-2xl">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Info size={20} className="text-blue-500" /> WCAG Accessibility
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    WCAG contrast ratios indicate if text is legally and visually readable. 
                    <strong> AA</strong> requires a ratio of 4.5:1 for normal text, and <strong>AAA</strong> requires 7:1.
                  </p>
                </div>
                <a 
                  href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                >
                  Learn more <ArrowUpRight size={16}/>
                </a>
              </div>

              <div className="space-y-8">
                <WCAGPaletteRow title="Primary Palette" palette={palette} baseHex={activeColor} />
                <WCAGPaletteRow title="Secondary Palette" palette={palette2} baseHex={color2} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 mt-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Did this webtool help you?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
              If this tool saved you some time, any support is greatly appreciated. It helps keep the project alive and growing!
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <a
                href="https://paypal.me/colorgenai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0070ba] hover:bg-[#003087] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <Coffee size={16} />
                Support via PayPal
              </a>
              <a
                href="https://buymeacoffee.com/colorgen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-slate-900 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <Coffee size={16} />
                Buy me a coffee
              </a>
            </div>
            <div className="flex justify-center mt-3">
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <MessageSquare size={16} />
                Feedback
              </button>
            </div>
          </div>
          <div className="w-16 h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">ColorGen © 2026</p>
        </div>
      </footer>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Send Feedback</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Found a bug or have a feature request? Let me know!</p>
            
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
                <input required type="text" id="name" name="name" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--p-500)] focus:border-transparent transition-all" style={{ '--p-500': palette?.[500] || '#0f4c81' } as React.CSSProperties} />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <input required type="email" id="email" name="email" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--p-500)] focus:border-transparent transition-all" style={{ '--p-500': palette?.[500] || '#0f4c81' } as React.CSSProperties} />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                <textarea required id="message" name="message" rows={4} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--p-500)] focus:border-transparent transition-all resize-none" style={{ '--p-500': palette?.[500] || '#0f4c81' } as React.CSSProperties}></textarea>
              </div>
              <button
                type="submit"
                disabled={feedbackStatus !== 'idle'}
                className="w-full py-2.5 rounded-lg text-sm font-bold text-white shadow-sm transition-all disabled:opacity-70 flex justify-center items-center cursor-pointer"
                style={{ backgroundColor: palette?.[500] || '#0f4c81' }}
              >
                {feedbackStatus === 'idle' && 'Send Message'}
                {feedbackStatus === 'sending' && (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Sending...
                  </span>
                )}
                {feedbackStatus === 'success' && (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} /> Sent!
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

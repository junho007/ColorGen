import React, { useState, useEffect, useCallback, useRef } from 'react';
import chroma from 'chroma-js';
import { Copy, Check, Plus, Minus, Dices, Shuffle, Download, ChevronDown, ChevronUp, LayoutTemplate } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface ColorNode {
  id: string;
  color: string;
  x: number;
  y: number;
  extent: number;
}

const THEMES = {
  None: [],
  Natural: ['#2E8B57', '#3CB371', '#8FBC8F', '#98FB98', '#F5FFFA', '#556B2F', '#8B4513', '#A0522D', '#228B22', '#006400'],
  City: ['#708090', '#778899', '#B0C4DE', '#4682B4', '#5F9EA0', '#6495ED', '#00BFFF', '#1E90FF', '#4169E1', '#0000CD'],
  Retro: ['#FF7F50', '#FF6347', '#FF4500', '#FFD700', '#FFA500', '#CD5C5C', '#F08080', '#E9967A', '#FA8072', '#FFA07A'],
  Heritage: ['#800000', '#8B0000', '#A52A2A', '#B22222', '#DC143C', '#D2691E', '#F4A460', '#D2B48C', '#DEB887', '#F5DEB3'],
};

type ThemeName = keyof typeof THEMES;

const ASPECT_RATIOS = [
  { label: '16:9 Desktop', value: 'aspect-video w-full max-w-4xl' },
  { label: '1:1 Square', value: 'aspect-square w-full max-w-lg' },
  { label: '4:3 Standard', value: 'aspect-[4/3] w-full max-w-2xl' },
  { label: '9:16 Mobile', value: 'aspect-[9/16] h-[500px] max-w-sm' },
];

export default function MeshGradient() {
  const [activeTheme, setActiveTheme] = useState<ThemeName>('None');
  const [nodes, setNodes] = useState<ColorNode[]>([]);
  const [copied, setCopied] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0].value);
  const [showCode, setShowCode] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  const getRandomColor = useCallback((theme: ThemeName) => {
    if (theme === 'None') {
      return chroma.random().hex();
    }
    const colors = THEMES[theme];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const generateNode = useCallback((theme: ThemeName, specificColor?: string): ColorNode => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      color: specificColor || getRandomColor(theme),
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      extent: Math.floor(Math.random() * 50) + 40, // 40% to 90%
    };
  }, [getRandomColor]);

  useEffect(() => {
    if (nodes.length === 0) {
      const initialNodes = Array.from({ length: 4 }).map(() => generateNode('None'));
      setNodes(initialNodes);
    }
  }, [generateNode, nodes.length]);

  const handleThemeChange = (theme: ThemeName) => {
    setActiveTheme(theme);
    setNodes(prev => prev.map(node => ({
      ...node,
      color: getRandomColor(theme)
    })));
  };

  const randomizeColors = () => {
    setNodes(prev => prev.map(node => ({
      ...node,
      color: getRandomColor(activeTheme)
    })));
  };

  const randomizePattern = () => {
    setNodes(prev => prev.map(node => ({
      ...node,
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      extent: Math.floor(Math.random() * 50) + 40,
    })));
  };

  const addNode = () => {
    if (nodes.length < 6) {
      setNodes([...nodes, generateNode(activeTheme)]);
    }
  };

  const removeNode = () => {
    if (nodes.length > 2) {
      setNodes(nodes.slice(0, -1));
    }
  };

  const updateNodeColor = (index: number, color: string) => {
    const newNodes = [...nodes];
    newNodes[index].color = color;
    setNodes(newNodes);
  };

  const generateCSS = () => {
    if (nodes.length === 0) return '';
    const gradients = nodes.map(
      (node) => `radial-gradient(at ${node.x}% ${node.y}%, ${node.color} 0px, transparent ${node.extent}%)`
    );
    const baseColor = nodes.length > 1 ? chroma.mix(nodes[0].color, nodes[1].color, 0.5).darken(2).hex() : '#000000';
    return `background-color: ${baseColor};\nbackground-image: \n  ${gradients.join(',\n  ')};`;
  };

  const cssOutput = generateCSS();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        pixelRatio: 3,
        quality: 1.0,
        skipFonts: true,
      });
      const link = document.createElement('a');
      link.download = `mesh-gradient-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mesh Gradient</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Dynamic CSS radial gradient waves</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--p-500)] hover:bg-[var(--p-600)] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Preview */}
        <div className="lg:col-span-8 sticky top-8 self-start flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-4 border border-slate-200 dark:border-slate-800">
          <div 
            ref={previewRef}
            className={`w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden transition-all duration-500 ${aspectRatio}`}
            style={{
              backgroundColor: nodes.length > 1 ? chroma.mix(nodes[0].color, nodes[1].color, 0.5).darken(2).hex() : '#000',
              backgroundImage: nodes.map(n => `radial-gradient(at ${n.x}% ${n.y}%, ${n.color} 0px, transparent ${n.extent}%)`).join(', ')
            }}
          />
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Aspect Ratio Selector */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <LayoutTemplate className="w-4 h-4" />
              Aspect Ratio
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => setAspectRatio(ratio.value)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    aspectRatio === ratio.value
                      ? 'bg-[var(--p-500)] border-[var(--p-500)] text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          {/* Randomizers */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Shuffle className="w-4 h-4" />
              Randomizers
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={randomizeColors}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Dices className="w-4 h-4" />
                Randomize Colors
              </button>
              <button
                onClick={randomizePattern}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                Randomize Pattern
              </button>
            </div>
          </div>

          {/* Color Pickers */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[var(--p-500)] to-emerald-500" />
              Palette & Nodes
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nodes ({nodes.length}/6)</label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={removeNode}
                    disabled={nodes.length <= 2}
                    className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={addNode}
                    disabled={nodes.length >= 6}
                    className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              {nodes.map((node, index) => (
                <div key={node.id} className="flex items-center gap-3 p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm border border-slate-200 dark:border-slate-600 shrink-0">
                    <input
                      type="color"
                      value={chroma.valid(node.color) ? chroma(node.color).hex() : '#ffffff'}
                      onChange={(e) => updateNodeColor(index, e.target.value)}
                      className="absolute -inset-4 w-20 h-20 cursor-pointer opacity-0"
                    />
                    <div className="w-full h-full pointer-events-none" style={{ backgroundColor: chroma.valid(node.color) ? chroma(node.color).hex() : '#ffffff' }} />
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">#</span>
                    <input
                      type="text"
                      value={node.color.replace('#', '')}
                      onChange={(e) => {
                        const val = '#' + e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                        updateNodeColor(index, val);
                      }}
                      className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--p-500)] transition-shadow text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable CSS Output */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Copy className="w-4 h-4" />
            Show CSS Code
          </div>
          {showCode ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        
        {showCode && (
          <div className="border-t border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-950 overflow-x-auto">
            <div className="flex items-center justify-end mb-4">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy CSS'}
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-all">
              <code>{cssOutput}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
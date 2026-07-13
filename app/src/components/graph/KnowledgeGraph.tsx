import { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { books, type KnowledgeNode } from '@/data/knowledgeData';
import { knowledgeEdges, categoryColors } from '@/data/knowledgeGraph';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, Network } from 'lucide-react';

interface GraphNode {
  id: string;
  title: string;
  category: string;
  book: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface KnowledgeGraphProps {
  selectedNodeId: string | null;
  onSelectNode: (node: KnowledgeNode) => void;
}

// Theme-aware color palette
const getThemeColors = (isDark: boolean) => ({
  bg: isDark ? '#0f172a' : '#fafafa',
  nodeLabel: '#fff',
  titleBg: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(30,41,59,0.9)',
  titleText: '#fff',
  borderColor: isDark ? '#334155' : '#e5e7eb',
  // edge colors
  prereq: isDark ? 'rgba(96,165,250,0.55)' : 'rgba(59,130,246,0.6)',
  prereqDim: isDark ? 'rgba(96,165,250,0.12)' : 'rgba(59,130,246,0.15)',
  related: isDark ? 'rgba(167,139,250,0.45)' : 'rgba(139,92,246,0.5)',
  relatedDim: isDark ? 'rgba(167,139,250,0.08)' : 'rgba(139,92,246,0.1)',
  applied: isDark ? 'rgba(52,211,153,0.45)' : 'rgba(16,185,129,0.5)',
  appliedDim: isDark ? 'rgba(52,211,153,0.08)' : 'rgba(16,185,129,0.1)',
  // selected node border
  selectedBorder: isDark ? '#e2e8f0' : '#1e293b',
});

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ selectedNodeId, onSelectNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragNode, setDragNode] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [linkStrength, setLinkStrength] = useState(0.3);
  const nodesRef = useRef<GraphNode[]>([]);
  const animRef = useRef<number>(0);
  const initializedRef = useRef(false);

  // Simulation settling: stop heavy physics after settling, keep lightweight redraw
  const settledRef = useRef(false);
  const settleFrameRef = useRef(0);

  // Responsive dimensions
  const [dims, setDims] = useState({ w: 760, h: 520 });
  const dimsRef = useRef(dims);
  dimsRef.current = dims;

  // Theme
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const colors = getThemeColors(isDark);
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  // Hover/zoom/pan state in refs for the animation loop (avoids re-creating loop on every state change)
  const stateRef = useRef({ zoom, pan, hoveredNode, selectedNodeId, dragNode, linkStrength });
  stateRef.current = { zoom, pan, hoveredNode, selectedNodeId, dragNode, linkStrength };

  // Responsive: observe container width
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const w = container.clientWidth;
      // Keep a sensible aspect ratio; clamp width
      const clampedW = Math.max(320, Math.min(w, 1000));
      const h = Math.round(clampedW * 0.65);
      setDims(prev => {
        // Only update if changed significantly (>10px)
        if (Math.abs(prev.w - clampedW) < 10 && Math.abs(prev.h - h) < 10) return prev;
        return { w: clampedW, h };
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Initialize nodes
  const initNodes = useCallback(() => {
    initializedRef.current = true;
    const { w: W, h: H } = dimsRef.current;
    const nodes: GraphNode[] = [];

    const bookCenters: Record<string, { x: number; y: number }> = {
      'bx1': { x: W * 0.25, y: H * 0.3 },
      'bx2': { x: W * 0.7, y: H * 0.3 },
      'xx1': { x: W * 0.75, y: H * 0.7 },
      'xx2': { x: W * 0.5, y: H * 0.8 },
      'xx3': { x: W * 0.2, y: H * 0.7 },
    };

    books.forEach(book => {
      const center = bookCenters[book.id] || { x: W / 2, y: H / 2 };
      book.chapters.forEach((chapter, ci) => {
        chapter.nodes.forEach((node, ni) => {
          const angle = (ci * 0.5 + ni * 0.15) * Math.PI;
          const r = 40 + ni * 15;
          nodes.push({
            id: node.id,
            title: node.title,
            category: node.category,
            book: book.name,
            x: center.x + Math.cos(angle) * r + (Math.random() - 0.5) * 30,
            y: center.y + Math.sin(angle) * r + (Math.random() - 0.5) * 30,
            vx: 0,
            vy: 0,
            radius: 10,
          });
        });
      });
    });
    nodesRef.current = nodes;
    settledRef.current = false;
    settleFrameRef.current = 0;
  }, []);

  // Force simulation step — pure physics, no React state reads
  const simulate = useCallback(() => {
    const nodes = nodesRef.current;
    if (nodes.length === 0) return;

    const { w: W, h: H } = dimsRef.current;
    const { linkStrength: ls, dragNode: dn } = stateRef.current;
    const centerX = W / 2;
    const centerY = H / 2;

    // Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const distSq = dx * dx + dy * dy + 0.01;
        const dist = Math.sqrt(distSq);
        const force = 800 / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        nodes[i].vx -= fx;
        nodes[i].vy -= fy;
        nodes[j].vx += fx;
        nodes[j].vy += fy;
      }
    }

    // Attraction along edges
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    knowledgeEdges.forEach(edge => {
      const s = nodeMap.get(edge.source);
      const t = nodeMap.get(edge.target);
      if (!s || !t) return;
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
      const targetDist = 80;
      const force = (dist - targetDist) * ls;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      s.vx += fx;
      s.vy += fy;
      t.vx -= fx;
      t.vy -= fy;
    });

    // Center gravity
    nodes.forEach(node => {
      const dx = centerX - node.x;
      const dy = centerY - node.y;
      node.vx += dx * 0.001;
      node.vy += dy * 0.001;
    });

    // Apply velocity with damping
    let maxVel = 0;
    nodes.forEach(node => {
      if (node.id === dn) return;
      node.vx *= 0.85;
      node.vy *= 0.85;
      node.x += node.vx;
      node.y += node.vy;
      maxVel = Math.max(maxVel, Math.abs(node.vx), Math.abs(node.vy));

      // Keep in bounds
      const margin = 30;
      node.x = Math.max(margin, Math.min(W - margin, node.x));
      node.y = Math.max(margin, Math.min(H - margin, node.y));
    });

    // Settle detection: when max velocity drops below threshold for sustained frames
    if (maxVel > 0.15) {
      settleFrameRef.current = 0;
    } else {
      settleFrameRef.current++;
      if (settleFrameRef.current > 30) {
        settledRef.current = true;
      }
    }
  }, []);

  // Draw the graph — reads from refs + current React state for hover/select
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w: W, h: H } = dimsRef.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const c = getThemeColors(isDarkRef.current);

    // Background
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);

    const { zoom: z, pan: p, hoveredNode: hn, selectedNodeId: sn } = stateRef.current;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(z, z);

    const nodes = nodesRef.current;
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    // Draw edges
    knowledgeEdges.forEach(edge => {
      const s = nodeMap.get(edge.source);
      const t = nodeMap.get(edge.target);
      if (!s || !t) return;

      const isHighlighted = hn === edge.source || hn === edge.target ||
                            sn === edge.source || sn === edge.target;

      if (edge.type === 'prerequisite') {
        ctx.strokeStyle = isHighlighted ? c.prereq : c.prereqDim;
        ctx.lineWidth = isHighlighted ? 2 : 1;
      } else if (edge.type === 'related') {
        ctx.strokeStyle = isHighlighted ? c.related : c.relatedDim;
        ctx.lineWidth = isHighlighted ? 1.5 : 0.8;
      } else {
        ctx.strokeStyle = isHighlighted ? c.applied : c.appliedDim;
        ctx.lineWidth = isHighlighted ? 1.5 : 0.8;
      }

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();

      // Arrow for prerequisite edges
      if (edge.type === 'prerequisite' && isHighlighted) {
        const angle = Math.atan2(t.y - s.y, t.x - s.x);
        const arrowSize = 6;
        const offset = t.radius + 2;
        const ax = t.x - Math.cos(angle) * offset;
        const ay = t.y - Math.sin(angle) * offset;
        ctx.fillStyle = ctx.strokeStyle as string;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - arrowSize * Math.cos(angle - 0.4), ay - arrowSize * Math.sin(angle - 0.4));
        ctx.lineTo(ax - arrowSize * Math.cos(angle + 0.4), ay - arrowSize * Math.sin(angle + 0.4));
        ctx.fill();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = node.id === sn;
      const isHovered = node.id === hn;
      const color = categoryColors[node.category] || '#6b7280';

      // Glow for selected/hovered
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = color + '30';
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? color : (isHovered ? color + 'DD' : color + 'AA');
      ctx.fill();
      ctx.strokeStyle = isSelected ? c.selectedBorder : color;
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.stroke();

      // Node ID label
      ctx.fillStyle = c.nodeLabel;
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id, node.x, node.y);

      // Title label for hovered/selected
      if (isHovered || isSelected) {
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        const text = node.title;
        const metrics = ctx.measureText(text);
        const padding = 4;
        ctx.fillStyle = c.titleBg;
        ctx.fillRect(node.x - metrics.width / 2 - padding, node.y - node.radius - 22, metrics.width + padding * 2, 16);
        ctx.fillStyle = c.titleText;
        ctx.fillText(text, node.x, node.y - node.radius - 8);
      }
    });

    ctx.restore();
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }, []);

  // === Animation loop: only ONE effect, created once on mount ===
  useEffect(() => {
    initNodes();

    const animate = () => {
      // Only run physics if not settled, or if user is dragging/panning/zooming
      const s = stateRef.current;
      const needsPhysics = !settledRef.current || s.dragNode !== null;

      if (needsPhysics) {
        simulate();
      }
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-init when dimensions change significantly (window resize)
  useEffect(() => {
    if (!initializedRef.current) return;
    // Just reposition nodes proportionally — don't re-randomize
    const nodes = nodesRef.current;
    if (nodes.length === 0) return;
    // Re-trigger physics settling
    settledRef.current = false;
    settleFrameRef.current = 0;
  }, [dims]);

  // Get node at screen position
  const getNodeAt = useCallback((sx: number, sy: number): GraphNode | null => {
    const nodes = nodesRef.current;
    const x = (sx - pan.x) / zoom;
    const y = (sy - pan.y) / zoom;
    for (const node of nodes) {
      const dx = node.x - x;
      const dy = node.y - y;
      if (dx * dx + dy * dy <= (node.radius + 4) ** 2) {
        return node;
      }
    }
    return null;
  }, [pan, zoom]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const node = getNodeAt(sx, sy);
    if (node) {
      setDragNode(node.id);
      setIsDragging(true);
      // Wake up physics when dragging
      settledRef.current = false;
      settleFrameRef.current = 0;
    } else {
      setIsPanning(true);
    }
    setLastMouse({ x: sx, y: sy });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (isDragging && dragNode) {
      const node = nodesRef.current.find(n => n.id === dragNode);
      if (node) {
        node.x = (sx - pan.x) / zoom;
        node.y = (sy - pan.y) / zoom;
        node.vx = 0;
        node.vy = 0;
      }
    } else if (isPanning) {
      setPan(prev => ({ x: prev.x + (sx - lastMouse.x), y: prev.y + (sy - lastMouse.y) }));
    } else {
      const node = getNodeAt(sx, sy);
      setHoveredNode(node?.id || null);
      e.currentTarget.style.cursor = node ? 'pointer' : 'default';
    }
    setLastMouse({ x: sx, y: sy });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragNode(null);
    setIsPanning(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const node = getNodeAt(sx, sy);
    if (node) {
      for (const book of books) {
        for (const chapter of book.chapters) {
          const found = chapter.nodes.find(n => n.id === node.id);
          if (found) {
            onSelectNode({ ...found, book: book.name });
            return;
          }
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const delta = -e.deltaY * 0.001;
    const newZoom = Math.max(0.3, Math.min(3, zoom + delta));
    setZoom(newZoom);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    initializedRef.current = false;
    nodesRef.current = [];
    initNodes();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Network className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          知识图谱网络
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setZoom(z => Math.min(3, z + 0.2))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setZoom(z => Math.max(0.3, z - 0.2))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={resetView}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="flex justify-center w-full">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleClick}
          onWheel={handleWheel}
          style={{ borderRadius: '8px', border: `1px solid ${colors.borderColor}`, cursor: 'default', maxWidth: '100%' }}
        />
      </div>

      {/* Link strength slider */}
      <div className="mt-3 max-w-md mx-auto space-y-1">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
          关联强度: {linkStrength.toFixed(2)}
        </label>
        <Slider value={[linkStrength * 100]} min={5} max={80} step={5}
          onValueChange={(v) => {
            setLinkStrength(v[0] / 100);
            // Re-trigger settling physics on strength change
            settledRef.current = false;
            settleFrameRef.current = 0;
          }} />
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-blue-500" style={{ opacity: 0.6 }}></div>
          <span>先修关系</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-purple-500" style={{ opacity: 0.5 }}></div>
          <span>相关关系</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-green-500" style={{ opacity: 0.5 }}></div>
          <span>应用关系</span>
        </div>
        <span className="text-gray-400 dark:text-gray-500 ml-2">提示：拖拽节点可调整位置，滚轮缩放</span>
      </div>
    </div>
  );
};

export default KnowledgeGraph;

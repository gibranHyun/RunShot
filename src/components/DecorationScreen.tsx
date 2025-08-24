import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Save, Share2, Type, Palette, AlignLeft, AlignCenter, AlignRight, Layout, Sticker } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RunningData } from '../App';

interface DecorationScreenProps {
  runningData: RunningData;
  onBack: () => void;
}

interface TextStyle {
  fontSize: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  fontFamily: string;
  fontWeight?: string;
  textTransform?: string;
  letterSpacing?: string;
}

interface Template {
  id: string;
  name: string;
  preview: string;
  textPositions: { x: number; y: number }[];
  textStyles: TextStyle[];
  backgroundColor?: string;
  elements: { type: 'text' | 'icon'; content: string; position: { x: number; y: number }; style: any }[];
}

interface StickerItem {
  id: string;
  type: 'text' | 'icon' | 'badge';
  content: string;
  category: string;
  isTransparent?: boolean;
  style?: {
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    borderRadius?: string;
    padding?: string;
    fontWeight?: string;
    textTransform?: string;
    letterSpacing?: string;
  };
}

interface CanvasSticker {
  id: string;
  sticker: StickerItem;
  position: { x: number; y: number };
  style: TextStyle & { 
    backgroundColor?: string; 
    borderRadius?: string; 
    padding?: string;
    fontWeight?: string;
    textTransform?: string;
    letterSpacing?: string;
  };
}

export default function DecorationScreen({ runningData, onBack }: DecorationScreenProps) {
  const [backgroundImage, setBackgroundImage] = useState<string>('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop');
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);
  const [selectedStickerIndex, setSelectedStickerIndex] = useState<number | null>(null);
  const [textStyles, setTextStyles] = useState<TextStyle[]>([
    { fontSize: 24, color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' },
    { fontSize: 20, color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' },
    { fontSize: 20, color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' },
    { fontSize: 20, color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }
  ]);
  const [textPositions, setTextPositions] = useState([
    { x: 20, y: 50 },
    { x: 20, y: 100 },
    { x: 20, y: 150 },
    { x: 20, y: 200 }
  ]);
  const [templateElements, setTemplateElements] = useState<any[]>([]);
  const [canvasStickers, setCanvasStickers] = useState<CanvasSticker[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [activeTab, setActiveTab] = useState('background');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const runningTexts = [
    `TOTAL ${runningData.totalDistance}KM`,
    `${runningData.totalRuns} RUNS`,
    `${Math.floor(runningData.totalTime / 60)}H ${runningData.totalTime % 60}M`,
    `${runningData.averagePace} PACE`
  ];

  // 새로운 템플릿 데이터 - 샘플 이미지 스타일 참고
  const templates: Template[] = [
    {
      id: 'black-minimal-r',
      name: 'R',
      preview: 'R',
      textPositions: [
        { x: 100, y: 40 },
        { x: 100, y: 80 },
        { x: 100, y: 120 },
        { x: 100, y: 160 }
      ],
      textStyles: [
        { fontSize: 22, color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' },
        { fontSize: 18, color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' },
        { fontSize: 18, color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' },
        { fontSize: 18, color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }
      ],
      backgroundColor: '#1a1a1a',
      elements: [
        { type: 'text', content: 'R', position: { x: 50, y: 100 }, style: { fontSize: 80, color: '#ffffff', fontFamily: 'Arial Black', fontWeight: '900', textAlign: 'center' } }
      ]
    },
    {
      id: 'black-runday-circle',
      name: 'RuuDay',
      preview: '⭕',
      textPositions: [
        { x: 140, y: 50 },
        { x: 140, y: 90 },
        { x: 140, y: 130 },
        { x: 140, y: 170 }
      ],
      textStyles: [
        { fontSize: 20, color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' },
        { fontSize: 18, color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' },
        { fontSize: 18, color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' },
        { fontSize: 18, color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }
      ],
      backgroundColor: '#1a1a1a',
      elements: [
        { type: 'text', content: 'RuuDay', position: { x: 70, y: 110 }, style: { fontSize: 24, color: '#ffffff', fontFamily: 'Arial Black', fontWeight: '900', textAlign: 'center', border: '3px solid #ffffff', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }
      ]
    },
    {
      id: 'black-runday-bold',
      name: 'RUN DAY',
      preview: 'RUN DAY',
      textPositions: [
        { x: 40, y: 180 },
        { x: 150, y: 180 },
        { x: 250, y: 180 },
        { x: 350, y: 180 }
      ],
      textStyles: [
        { fontSize: 16, color: '#ffffff', textAlign: 'center', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' },
        { fontSize: 16, color: '#ffffff', textAlign: 'center', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' },
        { fontSize: 16, color: '#ffffff', textAlign: 'center', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' },
        { fontSize: 16, color: '#ffffff', textAlign: 'center', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }
      ],
      backgroundColor: '#1a1a1a',
      elements: [
        { type: 'text', content: 'RUN', position: { x: 200, y: 60 }, style: { fontSize: 48, color: '#ffffff', fontFamily: 'Arial Black', fontWeight: '900', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2em' } },
        { type: 'text', content: 'DAY', position: { x: 200, y: 120 }, style: { fontSize: 48, color: '#ffffff', fontFamily: 'Arial Black', fontWeight: '900', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2em' } }
      ]
    },
    {
      id: 'black-runner-box',
      name: 'RUNNER',
      preview: '📦',
      textPositions: [
        { x: 60, y: 180 },
        { x: 160, y: 180 },
        { x: 260, y: 180 },
        { x: 360, y: 180 }
      ],
      textStyles: [
        { fontSize: 14, color: '#ffffff', textAlign: 'center', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' },
        { fontSize: 14, color: '#ffffff', textAlign: 'center', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' },
        { fontSize: 14, color: '#ffffff', textAlign: 'center', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' },
        { fontSize: 14, color: '#ffffff', textAlign: 'center', fontFamily: 'Arial Black', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }
      ],
      backgroundColor: '#1a1a1a',
      elements: [
        { type: 'text', content: 'RUNNER', position: { x: 200, y: 100 }, style: { fontSize: 36, color: '#000000', fontFamily: 'Arial Black', fontWeight: '900', textAlign: 'center', backgroundColor: '#ffffff', padding: '15px 25px', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.15em' } }
      ]
    }
  ];

  // 새로운 스티커 데이터 - 샘플 이미지 참고
  const stickers: StickerItem[] = [
    // 텍스트 스티커들 - 블랙 박스 스타일
    { 
      id: 'run-day-1', 
      type: 'text', 
      content: 'RUN DAY', 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 20, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '8px 12px',
        borderRadius: '4px'
      } 
    },
    { 
      id: 'run-day-2', 
      type: 'text', 
      content: 'RUN\nDAY', 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 18, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '10px 15px',
        borderRadius: '4px',
        textAlign: 'center',
        lineHeight: '1.2'
      } 
    },
    { 
      id: 'runner-1', 
      type: 'text', 
      content: 'RUNNER', 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 18, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '8px 12px',
        borderRadius: '4px'
      } 
    },
    { 
      id: 'runner-box', 
      type: 'text', 
      content: 'RUNNER', 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 16, 
        color: '#000000', 
        backgroundColor: '#ffffff',
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '6px 10px',
        borderRadius: '4px',
        border: '2px solid #000000'
      } 
    },
    { 
      id: 'im-a-runner', 
      type: 'text', 
      content: "I'M\nA\nRUNNER", 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 14, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '12px 8px',
        borderRadius: '4px',
        textAlign: 'center',
        lineHeight: '1.2'
      } 
    },
    { 
      id: 'korean-runner', 
      type: 'text', 
      content: '새벽러너', 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 16, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        letterSpacing: '0.1em',
        padding: '8px 12px',
        borderRadius: '4px'
      } 
    },
    { 
      id: 'fun-run', 
      type: 'text', 
      content: 'FUN\nRUN', 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 18, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '10px 12px',
        borderRadius: '4px',
        textAlign: 'center',
        lineHeight: '1.2'
      } 
    },
    { 
      id: 'happy-run', 
      type: 'text', 
      content: 'HAPPY\nRUN', 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 16, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '10px 12px',
        borderRadius: '4px',
        textAlign: 'center',
        lineHeight: '1.2'
      } 
    },
    { 
      id: 'morning-run', 
      type: 'text', 
      content: '☀️ MORNING\nRUN', 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 14, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '8px 10px',
        borderRadius: '4px',
        textAlign: 'center',
        lineHeight: '1.3'
      } 
    },
    { 
      id: 'night-run', 
      type: 'text', 
      content: '🌙 NIGHT\nRUN', 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 14, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '8px 10px',
        borderRadius: '4px',
        textAlign: 'center',
        lineHeight: '1.3'
      } 
    },
    { 
      id: 'lets-get-running', 
      type: 'text', 
      content: "LET'S GET\nRUNNING", 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 12, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '8px 10px',
        borderRadius: '4px',
        textAlign: 'center',
        lineHeight: '1.3'
      } 
    },
    { 
      id: 'lets-run', 
      type: 'text', 
      content: "Let's\nRUN", 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 16, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        textTransform: 'capitalize', 
        letterSpacing: '0.1em',
        padding: '10px 12px',
        borderRadius: '4px',
        textAlign: 'center',
        lineHeight: '1.2'
      } 
    },
    { 
      id: 'day', 
      type: 'text', 
      content: 'Day', 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 24, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '300', 
        letterSpacing: '0.1em',
        padding: '8px 15px',
        borderRadius: '4px'
      } 
    },
    { 
      id: 'runday', 
      type: 'text', 
      content: 'RUNDAY', 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 14, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '6px 8px',
        borderRadius: '4px'
      } 
    },
    { 
      id: 'runday-vertical', 
      type: 'text', 
      content: 'R\nU\nN\nD\nA\nY', 
      category: 'text', 
      isTransparent: false,
      style: { 
        fontSize: 14, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        padding: '15px 8px',
        borderRadius: '4px',
        textAlign: 'center',
        lineHeight: '1.2'
      } 
    },
    
    // 거리 배지 - 원형 디자인
    { 
      id: '3k-circle', 
      type: 'badge', 
      content: '3K', 
      category: 'distance', 
      isTransparent: false,
      style: { 
        fontSize: 20, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900',
        padding: '15px',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid #ffffff'
      } 
    },
    { 
      id: '5k-circle', 
      type: 'badge', 
      content: '5K', 
      category: 'distance', 
      isTransparent: false,
      style: { 
        fontSize: 20, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900',
        padding: '15px',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid #ffffff'
      } 
    },
    { 
      id: '7k-circle', 
      type: 'badge', 
      content: '7K', 
      category: 'distance', 
      isTransparent: false,
      style: { 
        fontSize: 20, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900',
        padding: '15px',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid #ffffff'
      } 
    },
    { 
      id: '10k-circle', 
      type: 'badge', 
      content: '10K', 
      category: 'distance', 
      isTransparent: false,
      style: { 
        fontSize: 18, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900',
        padding: '15px',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid #ffffff'
      } 
    },
    { 
      id: '21k-circle', 
      type: 'badge', 
      content: '21K', 
      category: 'distance', 
      isTransparent: false,
      style: { 
        fontSize: 18, 
        color: '#ffffff', 
        backgroundColor: '#000000',
        fontWeight: '900',
        padding: '15px',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid #ffffff'
      } 
    },
    
    // 아이콘 스티커들 - 블랙 박스 스타일
    { 
      id: 'treadmill', 
      type: 'icon', 
      content: '🏃‍♂️', 
      category: 'icon', 
      isTransparent: false,
      style: { 
        fontSize: 24, 
        backgroundColor: '#000000',
        padding: '10px',
        borderRadius: '4px'
      } 
    },
    { 
      id: 'running-shoe', 
      type: 'icon', 
      content: '👟', 
      category: 'icon', 
      isTransparent: false,
      style: { 
        fontSize: 24, 
        backgroundColor: '#000000',
        padding: '10px',
        borderRadius: '4px'
      } 
    },
    { 
      id: 'heartbeat', 
      type: 'text', 
      content: '♥️💓', 
      category: 'icon', 
      isTransparent: false,
      style: { 
        fontSize: 20, 
        backgroundColor: '#000000',
        padding: '8px 10px',
        borderRadius: '4px'
      } 
    }
  ];

  const colorOptions = [
    '#ffffff', '#000000', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#ffdd00'
  ];

  const fontOptions = [
    { name: 'Arial Black', family: 'Arial Black' },
    { name: 'Impact', family: 'Impact' },
    { name: 'Helvetica Bold', family: 'Helvetica' },
    { name: 'Bebas Neue', family: 'Bebas Neue' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyTemplate = (template: Template) => {
    setTextPositions(template.textPositions);
    setTextStyles(template.textStyles);
    setTemplateElements(template.elements || []);
    setSelectedTextIndex(null);
    setSelectedStickerIndex(null);
    setShowStylePanel(false);
    
    // 템플릿에 배경색이 있으면 어두운 배경 이미지로 변경
    if (template.backgroundColor) {
      setBackgroundImage('https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop');
    }
  };

  const addSticker = (sticker: StickerItem) => {
    const newSticker: CanvasSticker = {
      id: `${sticker.id}-${Date.now()}`,
      sticker,
      position: { x: 100, y: 100 },
      style: {
        fontSize: sticker.style?.fontSize || 24,
        color: sticker.style?.color || '#ffffff',
        textAlign: 'center',
        fontFamily: 'Arial Black',
        fontWeight: sticker.style?.fontWeight || '900',
        textTransform: sticker.style?.textTransform || 'uppercase',
        letterSpacing: sticker.style?.letterSpacing || '0.1em',
        backgroundColor: sticker.isTransparent ? 'transparent' : sticker.style?.backgroundColor,
        borderRadius: sticker.style?.borderRadius,
        padding: sticker.style?.padding
      }
    };
    setCanvasStickers(prev => [...prev, newSticker]);
  };

  const updateTextStyle = (property: keyof TextStyle, value: any) => {
    if (selectedTextIndex !== null) {
      const newStyles = [...textStyles];
      newStyles[selectedTextIndex] = { ...newStyles[selectedTextIndex], [property]: value };
      setTextStyles(newStyles);
    }
  };

  const updateStickerStyle = (property: string, value: any) => {
    if (selectedStickerIndex !== null) {
      const newStickers = [...canvasStickers];
      newStickers[selectedStickerIndex] = {
        ...newStickers[selectedStickerIndex],
        style: { ...newStickers[selectedStickerIndex].style, [property]: value }
      };
      setCanvasStickers(newStickers);
    }
  };

  const handleTextPointerDown = (index: number, e: React.PointerEvent) => {
    if (e.detail === 2) {
      setSelectedTextIndex(index);
      setSelectedStickerIndex(null);
      setShowStylePanel(true);
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    setSelectedTextIndex(index);
    setSelectedStickerIndex(null);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = textPositions[index];
    const canvasRect = canvasRef.current?.getBoundingClientRect();

    const handlePointerMove = (e: PointerEvent) => {
      if (!canvasRect) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newPositions = [...textPositions];
      newPositions[index] = {
        x: Math.max(0, Math.min(canvasRect.width - 150, startPos.x + deltaX)),
        y: Math.max(0, Math.min(canvasRect.height - 50, startPos.y + deltaY))
      };
      setTextPositions(newPositions);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handleStickerPointerDown = (index: number, e: React.PointerEvent) => {
    if (e.detail === 2) {
      setSelectedStickerIndex(index);
      setSelectedTextIndex(null);
      setShowStylePanel(true);
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    setSelectedStickerIndex(index);
    setSelectedTextIndex(null);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = canvasStickers[index].position;
    const canvasRect = canvasRef.current?.getBoundingClientRect();

    const handlePointerMove = (e: PointerEvent) => {
      if (!canvasRect) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newStickers = [...canvasStickers];
      newStickers[index] = {
        ...newStickers[index],
        position: {
          x: Math.max(0, Math.min(canvasRect.width - 100, startPos.x + deltaX)),
          y: Math.max(0, Math.min(canvasRect.height - 50, startPos.y + deltaY))
        }
      };
      setCanvasStickers(newStickers);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const deleteSelectedSticker = () => {
    if (selectedStickerIndex !== null) {
      const newStickers = [...canvasStickers];
      newStickers.splice(selectedStickerIndex, 1);
      setCanvasStickers(newStickers);
      setSelectedStickerIndex(null);
      setShowStylePanel(false);
    }
  };

  const handleSave = () => {
    alert('이미지가 갤러리에 저장되었습니다!');
  };

  const handleShare = () => {
    alert('공유 기능을 열었습니다!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>내 기록 꾸미기</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            저장
          </Button>
          <Button size="sm" onClick={handleShare} className="bg-gradient-to-r from-blue-500 to-green-500">
            <Share2 className="w-4 h-4 mr-1" />
            공유
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-20">
        {/* Canvas Area */}
        <Card className="overflow-hidden">
          <div 
            ref={canvasRef}
            className="relative w-full aspect-[4/3] bg-cover bg-center touch-manipulation"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            {/* Background overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
            
            {/* Template Elements */}
            {templateElements.map((element, index) => (
              <div
                key={`template-${index}`}
                className="absolute pointer-events-none select-none"
                style={{
                  left: element.position.x,
                  top: element.position.y,
                  fontSize: element.style.fontSize,
                  color: element.style.color,
                  fontFamily: element.style.fontFamily || 'Arial Black',
                  fontWeight: element.style.fontWeight || '900',
                  textTransform: element.style.textTransform || 'uppercase',
                  letterSpacing: element.style.letterSpacing || '0.1em',
                  backgroundColor: element.style.backgroundColor,
                  padding: element.style.padding,
                  borderRadius: element.style.borderRadius,
                  border: element.style.border,
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  display: element.style.display,
                  alignItems: element.style.alignItems,
                  justifyContent: element.style.justifyContent,
                  width: element.style.width,
                  height: element.style.height,
                  lineHeight: element.style.lineHeight,
                  whiteSpace: 'pre-line'
                }}
              >
                {element.content}
              </div>
            ))}
            
            {/* Text Overlays */}
            {runningTexts.map((text, index) => (
              <div
                key={index}
                className={`absolute touch-manipulation select-none px-3 py-2 rounded transition-all ${
                  selectedTextIndex === index ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
                } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                  left: textPositions[index].x,
                  top: textPositions[index].y,
                  fontSize: textStyles[index].fontSize,
                  color: textStyles[index].color,
                  textAlign: textStyles[index].textAlign,
                  fontFamily: textStyles[index].fontFamily,
                  fontWeight: textStyles[index].fontWeight || '900',
                  textTransform: textStyles[index].textTransform || 'uppercase',
                  letterSpacing: textStyles[index].letterSpacing || '0.05em',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  minWidth: '120px'
                }}
                onPointerDown={(e) => handleTextPointerDown(index, e)}
              >
                {text}
              </div>
            ))}

            {/* Sticker Overlays */}
            {canvasStickers.map((canvasSticker, index) => (
              <div
                key={canvasSticker.id}
                className={`absolute touch-manipulation select-none rounded transition-all ${
                  selectedStickerIndex === index ? 'ring-2 ring-green-500 bg-green-500/10' : ''
                } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                  left: canvasSticker.position.x,
                  top: canvasSticker.position.y,
                  fontSize: canvasSticker.style.fontSize,
                  color: canvasSticker.style.color,
                  textAlign: canvasSticker.style.textAlign,
                  fontFamily: canvasSticker.style.fontFamily,
                  fontWeight: canvasSticker.style.fontWeight || '900',
                  textTransform: canvasSticker.style.textTransform || 'uppercase',
                  letterSpacing: canvasSticker.style.letterSpacing || '0.05em',
                  backgroundColor: canvasSticker.style.backgroundColor || 'transparent',
                  borderRadius: canvasSticker.style.borderRadius,
                  padding: canvasSticker.style.padding,
                  textShadow: canvasSticker.sticker.type === 'icon' ? 'none' : '2px 2px 4px rgba(0,0,0,0.8)',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  minWidth: canvasSticker.sticker.type === 'icon' ? 'auto' : '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: canvasSticker.sticker.style?.border,
                  width: canvasSticker.sticker.style?.width,
                  height: canvasSticker.sticker.style?.height,
                  lineHeight: canvasSticker.sticker.style?.lineHeight,
                  whiteSpace: 'pre-line'
                }}
                onPointerDown={(e) => handleStickerPointerDown(index, e)}
              >
                {canvasSticker.sticker.content}
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Controls */}
        {(selectedTextIndex !== null || selectedStickerIndex !== null) && (
          <Card className="p-3 border-2 border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">
                {selectedTextIndex !== null ? '텍스트 선택됨' : '스티커 선택됨'}
              </span>
              <div className="flex gap-2">
                {selectedStickerIndex !== null && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={deleteSelectedSticker}
                    className="text-red-600 border-red-200"
                  >
                    삭제
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowStylePanel(!showStylePanel)}
                  className="text-blue-600"
                >
                  <Type className="w-4 h-4 mr-1" />
                  {showStylePanel ? '접기' : '편집'}
                </Button>
              </div>
            </div>
            <div className="text-xs text-blue-600">
              {selectedTextIndex !== null ? 
                `"${runningTexts[selectedTextIndex]}"` : 
                `"${canvasStickers[selectedStickerIndex!]?.sticker.content}"`
              }
            </div>
          </Card>
        )}

        {/* Style Panel */}
        {showStylePanel && (selectedTextIndex !== null || selectedStickerIndex !== null) && (
          <Card className="p-4 bg-gray-50 border-2 border-blue-200">
            <h3 className="font-medium mb-3">스타일 편집</h3>
            
            <div className="space-y-4">
              {/* Font Size */}
              <div>
                <label className="text-sm font-medium mb-2 block">크기</label>
                <Slider
                  value={[selectedTextIndex !== null ? textStyles[selectedTextIndex].fontSize : canvasStickers[selectedStickerIndex!]?.style.fontSize || 24]}
                  onValueChange={([value]) => {
                    if (selectedTextIndex !== null) {
                      updateTextStyle('fontSize', value);
                    } else {
                      updateStickerStyle('fontSize', value);
                    }
                  }}
                  min={12}
                  max={60}
                  step={2}
                  className="w-full"
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-sm font-medium mb-2 block">색상</label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border-2 border-gray-300"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        if (selectedTextIndex !== null) {
                          updateTextStyle('color', color);
                        } else {
                          updateStickerStyle('color', color);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="text-sm font-medium mb-2 block">폰트</label>
                <div className="grid grid-cols-2 gap-2">
                  {fontOptions.map((font) => (
                    <Button
                      key={font.family}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedTextIndex !== null) {
                          updateTextStyle('fontFamily', font.family);
                        } else {
                          updateStickerStyle('fontFamily', font.family);
                        }
                      }}
                      className="text-xs"
                      style={{ fontFamily: font.family }}
                    >
                      {font.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="text-sm font-medium mb-2 block">정렬</label>
                <div className="flex gap-2">
                  {[
                    { value: 'left', icon: AlignLeft },
                    { value: 'center', icon: AlignCenter },
                    { value: 'right', icon: AlignRight }
                  ].map(({ value, icon: Icon }) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedTextIndex !== null) {
                          updateTextStyle('textAlign', value);
                        } else {
                          updateStickerStyle('textAlign', value);
                        }
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tools Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="background">배경</TabsTrigger>
            <TabsTrigger value="templates">템플릿</TabsTrigger>
            <TabsTrigger value="stickers">스티커</TabsTrigger>
          </TabsList>

          <TabsContent value="background" className="mt-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">배경 이미지 업로드</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    이미지 선택
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">미리 설정된 배경</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
                      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=800&h=600&fit=crop'
                    ].map((bg, index) => (
                      <div
                        key={index}
                        className="aspect-video bg-cover bg-center rounded cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors"
                        style={{ backgroundImage: `url(${bg})` }}
                        onClick={() => setBackgroundImage(bg)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-4">
            <Card className="p-4">
              <div className="space-y-3">
                <h3 className="font-medium">템플릿 선택</h3>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="relative aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors group"
                      onClick={() => applyTemplate(template)}
                    >
                      {/* Template Preview */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-2xl mb-2">{template.preview}</div>
                          <div className="text-xs font-medium px-2 py-1 bg-black/50 rounded">
                            {template.name}
                          </div>
                        </div>
                      </div>
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium">
                          적용하기
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="stickers" className="mt-4">
            <Card className="p-4">
              <div className="space-y-4">
                <h3 className="font-medium">스티커 추가</h3>
                
                {/* Text Stickers */}
                <div>
                  <h4 className="text-sm font-medium mb-2">텍스트 스티커</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {stickers.filter(s => s.category === 'text').map((sticker) => (
                      <div
                        key={sticker.id}
                        className="aspect-square bg-black text-white rounded cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center text-xs font-black uppercase tracking-wide text-center border border-gray-600"
                        onClick={() => addSticker(sticker)}
                        style={{
                          fontSize: '10px',
                          lineHeight: '1.2',
                          whiteSpace: 'pre-line'
                        }}
                      >
                        {sticker.content}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distance Badges */}
                <div>
                  <h4 className="text-sm font-medium mb-2">거리 배지</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {stickers.filter(s => s.category === 'distance').map((sticker) => (
                      <div
                        key={sticker.id}
                        className="aspect-square bg-black text-white rounded-full cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center text-sm font-black border-2 border-white"
                        onClick={() => addSticker(sticker)}
                      >
                        {sticker.content}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Icon Stickers */}
                <div>
                  <h4 className="text-sm font-medium mb-2">아이콘 스티커</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {stickers.filter(s => s.category === 'icon').map((sticker) => (
                      <div
                        key={sticker.id}
                        className="aspect-square bg-black text-white rounded cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center text-lg border border-gray-600"
                        onClick={() => addSticker(sticker)}
                      >
                        {sticker.content}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
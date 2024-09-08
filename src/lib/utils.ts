import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;

  const scaleConversion = (
    valueA: number,
    scaleA: [number, number],
    scaleB: [number, number]
  ) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (style: Record<string, number | string | undefined>): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, '');
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t
      });
    },
    easing: cubicOut
  };
};

export const colorNameToHex = (color: string) => {
  const colorMap: Record<string, string> = {
    black: 'bg-black text-white',
    white: 'bg-white text-black border',
    'alpine green': 'bg-green-800 text-white',
    army: 'bg-green-800 text-white',
    'blue aqua': 'bg-blue-400 text-white',
    bone: 'bg-orange-200 text-black',
    brown: 'bg-amber-800 text-white',
    charcoal: 'bg-gray-800 text-white',
    'classic navy': 'bg-blue-800 text-white',
    'grey heather': 'bg-gray-400 text-black',
    lavender: 'bg-purple-400 text-white',
    'light pink': 'bg-pink-200 text-black',
    'light yellow': 'bg-yellow-200 text-black',
    maroon: 'bg-red-800 text-white',
    sandstone: 'bg-yellow-400 text-black',
    red: 'bg-red-800 text-white',
    'sport grey': 'bg-gray-400 text-black',
    'sport dark navy': 'bg-blue-800 text-white',
    chambray: 'bg-blue-400 text-white',
    'sport scarlet red': 'bg-red-800 text-white',
    'sport dark green': 'bg-green-800 text-white',
    'ash grey': 'bg-gray-400 text-black',
    burgundy: 'bg-red-800 text-white',
    cream: 'bg-orange-200 text-black',
    'military green': 'bg-green-800 text-white',
    sand: 'bg-yellow-600 text-black',
    banana: 'bg-yellow-200 text-black',
    'sport purple': 'bg-purple-800 text-white',
    bay: 'bg-blue-300 text-white',
    berry: 'bg-red-800 text-white',
    ivory: 'bg-orange-200 text-black',
    terracotta: 'bg-orange-700 text-white',
    orchid: 'bg-purple-300 text-white',
    wine: 'bg-red-800 text-white',
    natural: 'bg-orange-100 text-black',
    seafoam: 'bg-green-300 text-white',
    'cloudy blue': 'bg-blue-300 text-white'
  };
  return colorMap[color] || 'bg-gray-400 text-black';
};

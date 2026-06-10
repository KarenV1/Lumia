import { DayOfWeek } from '../types/index.ts';

// Mapeo de días a imágenes de fondo reales
const dayBackgroundMap: { [key in DayOfWeek]: string } = {
  lunes: '/fondos/bg-lunes.png',
  martes: '/fondos/bg-martes.png',
  miércoles: '/fondos/bg-miercoles.png',
  jueves: '/fondos/bg-jueves.png',
  viernes: '/fondos/bg-viernes.png',
  sábado: '/fondos/bg-sabado.png',
  domingo: '/fondos/bg-domingo.png',
};

export const backgroundHelper = {
  getDayBackground: (dayOfWeek: DayOfWeek): string => {
    return dayBackgroundMap[dayOfWeek];
  },

  getDayEmoji: (dayOfWeek: DayOfWeek): string => {
    const emojis: { [key in DayOfWeek]: string } = {
      lunes: '🌊',
      martes: '🌸',
      miércoles: '🌿',
      jueves: '🌞',
      viernes: '🎨',
      sábado: '🌅',
      domingo: '🌙',
    };
    return emojis[dayOfWeek];
  },

  getDayName: (dayOfWeek: DayOfWeek): string => {
    const names: { [key in DayOfWeek]: string } = {
      lunes: 'Lunes',
      martes: 'Martes',
      miércoles: 'Miércoles',
      jueves: 'Jueves',
      viernes: 'Viernes',
      sábado: 'Sábado',
      domingo: 'Domingo',
    };
    return names[dayOfWeek];
  },
};

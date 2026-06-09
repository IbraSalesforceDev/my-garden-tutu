/**
 * Mapeo de los códigos WMO de Open-Meteo a icono + descripción en español.
 */
const tabla: Record<number, { icono: string; texto: string }> = {
  0: { icono: '☀️', texto: 'Despejado' },
  1: { icono: '🌤️', texto: 'Mayormente despejado' },
  2: { icono: '⛅', texto: 'Parcialmente nublado' },
  3: { icono: '☁️', texto: 'Nublado' },
  45: { icono: '🌫️', texto: 'Niebla' },
  48: { icono: '🌫️', texto: 'Niebla con escarcha' },
  51: { icono: '🌦️', texto: 'Llovizna ligera' },
  53: { icono: '🌦️', texto: 'Llovizna' },
  55: { icono: '🌧️', texto: 'Llovizna intensa' },
  61: { icono: '🌦️', texto: 'Lluvia ligera' },
  63: { icono: '🌧️', texto: 'Lluvia' },
  65: { icono: '🌧️', texto: 'Lluvia intensa' },
  71: { icono: '🌨️', texto: 'Nieve ligera' },
  73: { icono: '🌨️', texto: 'Nieve' },
  75: { icono: '❄️', texto: 'Nieve intensa' },
  80: { icono: '🌦️', texto: 'Chubascos' },
  81: { icono: '🌧️', texto: 'Chubascos fuertes' },
  82: { icono: '⛈️', texto: 'Chubascos violentos' },
  95: { icono: '⛈️', texto: 'Tormenta' },
  96: { icono: '⛈️', texto: 'Tormenta con granizo' },
  99: { icono: '⛈️', texto: 'Tormenta fuerte con granizo' },
};

export function describirClima(codigo: number) {
  return tabla[codigo] ?? { icono: '🌡️', texto: 'Desconocido' };
}

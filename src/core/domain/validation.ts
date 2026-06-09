import { z } from 'zod';
import { ESTADOS_CULTIVO } from '@/core/domain/entities/Cultivo';

/**
 * Esquemas de validación compartidos por la capa de aplicación y la API.
 * Mantener las reglas de negocio aquí evita duplicarlas en cada endpoint.
 */

export const nuevoCultivoSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(80),
  variedad: z
    .string()
    .trim()
    .max(80)
    .nullish()
    .transform((v) => v || null),
  estado: z.enum(ESTADOS_CULTIVO).default('sembrado'),
  fechaSiembra: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)'),
  frecuenciaRiegoDias: z.coerce.number().int().min(1).max(60).default(3),
  ubicacion: z
    .string()
    .trim()
    .max(120)
    .nullish()
    .transform((v) => v || null),
  notas: z
    .string()
    .trim()
    .max(500)
    .nullish()
    .transform((v) => v || null),
});

export const actualizarCultivoSchema = nuevoCultivoSchema.partial();

export const nuevoRiegoSchema = z.object({
  cultivoId: z.string().uuid('cultivoId inválido'),
  fecha: z
    .string()
    .datetime({ offset: true })
    .default(() => new Date().toISOString()),
  cantidadLitros: z.coerce
    .number()
    .min(0)
    .max(1000)
    .nullish()
    .transform((v) => v ?? null),
  metodo: z.enum(['manual', 'goteo', 'aspersion', 'lluvia']).default('manual'),
  notas: z
    .string()
    .trim()
    .max(300)
    .nullish()
    .transform((v) => v || null),
});

export const coordenadasSchema = z.object({
  latitud: z.coerce.number().min(-90).max(90),
  longitud: z.coerce.number().min(-180).max(180),
});

export type NuevoCultivoInput = z.input<typeof nuevoCultivoSchema>;
export type NuevoRiegoInput = z.input<typeof nuevoRiegoSchema>;

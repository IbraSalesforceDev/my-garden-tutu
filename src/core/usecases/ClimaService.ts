import type { Clima } from '@/core/domain/entities/Clima';
import type { WeatherProvider } from '@/core/domain/repositories/WeatherProvider';
import { ValidationError } from '@/core/domain/errors';
import { coordenadasSchema } from '@/core/domain/validation';

export class ClimaService {
  constructor(private readonly provider: WeatherProvider) {}

  async obtener(input: unknown): Promise<Clima> {
    const parsed = coordenadasSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        'Coordenadas inválidas',
        parsed.error.flatten().fieldErrors,
      );
    }
    return this.provider.obtener(parsed.data.latitud, parsed.data.longitud);
  }
}

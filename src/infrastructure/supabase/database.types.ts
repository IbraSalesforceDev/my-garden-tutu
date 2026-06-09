/**
 * Tipos de la base de datos Supabase.
 * En un flujo real se generan con:
 *   supabase gen types typescript --project-id <id> > src/infrastructure/supabase/database.types.ts
 * Se incluye una versión escrita a mano para arrancar sin esperar al proyecto.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      cultivos: {
        Row: {
          id: string;
          user_id: string;
          nombre: string;
          variedad: string | null;
          estado: string;
          fecha_siembra: string;
          frecuencia_riego_dias: number;
          ubicacion: string | null;
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nombre: string;
          variedad?: string | null;
          estado?: string;
          fecha_siembra: string;
          frecuencia_riego_dias?: number;
          ubicacion?: string | null;
          notas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['cultivos']['Insert']>;
        Relationships: [];
      };
      riegos: {
        Row: {
          id: string;
          user_id: string;
          cultivo_id: string;
          fecha: string;
          cantidad_litros: number | null;
          metodo: string;
          notas: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cultivo_id: string;
          fecha?: string;
          cantidad_litros?: number | null;
          metodo?: string;
          notas?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['riegos']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'riegos_cultivo_id_fkey';
            columns: ['cultivo_id'];
            referencedRelation: 'cultivos';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

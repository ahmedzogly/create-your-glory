export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          created_at: string
          description: string | null
          description_ar: string | null
          display_order: number
          id: string
          image_url: string
          issuer: string
          issuer_ar: string | null
          link: string | null
          title: string
          title_ar: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          display_order?: number
          id?: string
          image_url: string
          issuer?: string
          issuer_ar?: string | null
          link?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          display_order?: number
          id?: string
          image_url?: string
          issuer?: string
          issuer_ar?: string | null
          link?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          degree_ar: string | null
          description: string | null
          description_ar: string | null
          display_order: number
          id: string
          image_url: string | null
          period: string
          school: string
          school_ar: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree: string
          degree_ar?: string | null
          description?: string | null
          description_ar?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          period: string
          school: string
          school_ar?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          degree?: string
          degree_ar?: string | null
          description?: string | null
          description_ar?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          period?: string
          school?: string
          school_ar?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          bullets: string[]
          bullets_ar: string[] | null
          company: string
          company_ar: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          period: string
          title: string
          title_ar: string | null
          updated_at: string
        }
        Insert: {
          bullets?: string[]
          bullets_ar?: string[] | null
          company: string
          company_ar?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          period: string
          title: string
          title_ar?: string | null
          updated_at?: string
        }
        Update: {
          bullets?: string[]
          bullets_ar?: string[] | null
          company?: string
          company_ar?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          period?: string
          title?: string
          title_ar?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      orbit_skills: {
        Row: {
          color: string
          created_at: string
          display_order: number
          icon: string
          id: string
          label: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          label: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          category_ar: string | null
          created_at: string
          description: string
          description_ar: string | null
          display_order: number
          id: string
          image_url: string
          link: string | null
          title: string
          title_ar: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          category_ar?: string | null
          created_at?: string
          description: string
          description_ar?: string | null
          display_order?: number
          id?: string
          image_url: string
          link?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          category_ar?: string | null
          created_at?: string
          description?: string
          description_ar?: string | null
          display_order?: number
          id?: string
          image_url?: string
          link?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
          value_ar: string | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
          value_ar?: string | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
          value_ar?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          category_ar: string | null
          created_at: string
          display_order: number
          id: string
          items: string[]
          items_ar: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          category_ar?: string | null
          created_at?: string
          display_order?: number
          id?: string
          items?: string[]
          items_ar?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          category_ar?: string | null
          created_at?: string
          display_order?: number
          id?: string
          items?: string[]
          items_ar?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

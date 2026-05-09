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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      email_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          profile_id: string
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string
          profile_id: string
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          profile_id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_subscribers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          color: string
          created_at: string
          icon: string
          id: string
          is_featured: boolean
          is_pinned: boolean
          link_type: string
          metadata: Json
          position: number
          profile_id: string
          thumbnail_url: string
          title: string
          url: string
        }
        Insert: {
          color?: string
          created_at?: string
          icon?: string
          id?: string
          is_featured?: boolean
          is_pinned?: boolean
          link_type?: string
          metadata?: Json
          position?: number
          profile_id: string
          thumbnail_url?: string
          title: string
          url: string
        }
        Update: {
          color?: string
          created_at?: string
          icon?: string
          id?: string
          is_featured?: boolean
          is_pinned?: boolean
          link_type?: string
          metadata?: Json
          position?: number
          profile_id?: string
          thumbnail_url?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mockup_slides: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string
          is_active: boolean
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url: string
          is_active?: boolean
          position?: number
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accent_color: string
          avatar_emoji: string
          bg_animated: boolean
          bg_color: string
          bg_video_url: string
          bio: string
          booking_url: string
          button_color: string
          button_style: string
          button_text_color: string
          cover_url: string
          created_at: string
          display_name: string
          font_family: string
          font_weight: string
          id: string
          is_pro: boolean
          is_verified: boolean
          logo_text: string
          logo_url: string
          qr_bg: string
          qr_color: string
          social_links: Json
          tagline: string
          theme: string
          updated_at: string
          username: string
          whatsapp_number: string
        }
        Insert: {
          accent_color?: string
          avatar_emoji?: string
          bg_animated?: boolean
          bg_color?: string
          bg_video_url?: string
          bio?: string
          booking_url?: string
          button_color?: string
          button_style?: string
          button_text_color?: string
          cover_url?: string
          created_at?: string
          display_name?: string
          font_family?: string
          font_weight?: string
          id: string
          is_pro?: boolean
          is_verified?: boolean
          logo_text?: string
          logo_url?: string
          qr_bg?: string
          qr_color?: string
          social_links?: Json
          tagline?: string
          theme?: string
          updated_at?: string
          username: string
          whatsapp_number?: string
        }
        Update: {
          accent_color?: string
          avatar_emoji?: string
          bg_animated?: boolean
          bg_color?: string
          bg_video_url?: string
          bio?: string
          booking_url?: string
          button_color?: string
          button_style?: string
          button_text_color?: string
          cover_url?: string
          created_at?: string
          display_name?: string
          font_family?: string
          font_weight?: string
          id?: string
          is_pro?: boolean
          is_verified?: boolean
          logo_text?: string
          logo_url?: string
          qr_bg?: string
          qr_color?: string
          social_links?: Json
          tagline?: string
          theme?: string
          updated_at?: string
          username?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      scan_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          link_id: string | null
          profile_id: string
          source: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          link_id?: string | null
          profile_id: string
          source?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          link_id?: string | null
          profile_id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_events_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          paddle_customer_id: string
          paddle_subscription_id: string
          price_id: string
          product_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          paddle_customer_id: string
          paddle_subscription_id: string
          price_id: string
          product_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          paddle_customer_id?: string
          paddle_subscription_id?: string
          price_id?: string
          product_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
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
      has_active_subscription: {
        Args: { check_env?: string; user_uuid: string }
        Returns: boolean
      }
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

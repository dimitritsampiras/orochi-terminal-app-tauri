export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      batch_documents: {
        Row: {
          batch_id: number | null
          created_at: string
          document_notes: string
          document_path: string
          document_type: Database["public"]["Enums"]["batch_document_type"]
          merged_pdf_order_ids: string[] | null
          name: string
        }
        Insert: {
          batch_id?: number | null
          created_at?: string
          document_notes?: string
          document_path: string
          document_type: Database["public"]["Enums"]["batch_document_type"]
          merged_pdf_order_ids?: string[] | null
          name?: string
        }
        Update: {
          batch_id?: number | null
          created_at?: string
          document_notes?: string
          document_path?: string
          document_type?: Database["public"]["Enums"]["batch_document_type"]
          merged_pdf_order_ids?: string[] | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_documents_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          active: boolean
          created_at: string
          id: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      blank_variants: {
        Row: {
          blank_id: string
          color: string
          id: string
          quantity: number
          size: Database["public"]["Enums"]["garment_size"]
          volume: number
          weight: number
        }
        Insert: {
          blank_id: string
          color: string
          id?: string
          quantity?: number
          size: Database["public"]["Enums"]["garment_size"]
          volume: number
          weight: number
        }
        Update: {
          blank_id?: string
          color?: string
          id?: string
          quantity?: number
          size?: Database["public"]["Enums"]["garment_size"]
          volume?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "blank_variants_blank_id_fkey"
            columns: ["blank_id"]
            isOneToOne: false
            referencedRelation: "blanks"
            referencedColumns: ["id"]
          },
        ]
      }
      blanks: {
        Row: {
          blank_company: string
          blank_name: string
          created_at: string
          customs_price: number
          garment_type: Database["public"]["Enums"]["garment_type"]
          id: string
          links: string[]
        }
        Insert: {
          blank_company: string
          blank_name: string
          created_at?: string
          customs_price: number
          garment_type: Database["public"]["Enums"]["garment_type"]
          id?: string
          links: string[]
        }
        Update: {
          blank_company?: string
          blank_name?: string
          created_at?: string
          customs_price?: number
          garment_type?: Database["public"]["Enums"]["garment_type"]
          id?: string
          links?: string[]
        }
        Relationships: []
      }
      line_items: {
        Row: {
          completion_status: Database["public"]["Enums"]["line_item_completion_status"]
          created_at: string | null
          has_deprecated_blank_stock: boolean | null
          has_deprecated_variant_stock: boolean | null
          id: string
          marked_as_packaged: boolean
          name: string
          order_id: string
          product_id: string | null
          quantity: number
          updated_at: string | null
          variant_id: string | null
        }
        Insert: {
          completion_status?: Database["public"]["Enums"]["line_item_completion_status"]
          created_at?: string | null
          has_deprecated_blank_stock?: boolean | null
          has_deprecated_variant_stock?: boolean | null
          id: string
          marked_as_packaged?: boolean
          name: string
          order_id: string
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          variant_id?: string | null
        }
        Update: {
          completion_status?: Database["public"]["Enums"]["line_item_completion_status"]
          created_at?: string | null
          has_deprecated_blank_stock?: boolean | null
          has_deprecated_variant_stock?: boolean | null
          id?: string
          marked_as_packaged?: boolean
          name?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gql_line_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gql_line_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gql_line_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          category: Database["public"]["Enums"]["order_log_category"] | null
          created_at: string
          id: number
          message: string
          order_id: string | null
          type: Database["public"]["Enums"]["log_type"]
        }
        Insert: {
          category?: Database["public"]["Enums"]["order_log_category"] | null
          created_at?: string
          id?: number
          message: string
          order_id?: string | null
          type?: Database["public"]["Enums"]["log_type"]
        }
        Update: {
          category?: Database["public"]["Enums"]["order_log_category"] | null
          created_at?: string
          id?: number
          message?: string
          order_id?: string | null
          type?: Database["public"]["Enums"]["log_type"]
        }
        Relationships: [
          {
            foreignKeyName: "logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_notes: {
        Row: {
          created_at: string
          id: string
          note: string
          order_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note: string
          order_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          order_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_notes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_notes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          display_customer_name: string | null
          display_destination_country_code: string | null
          display_destination_country_name: string | null
          display_fulfillment_status: Database["public"]["Enums"]["display_fulfillment_status"]
          display_is_cancelled: boolean
          fulfillment_priority: Database["public"]["Enums"]["fulfillment_priority"]
          id: string
          name: string
          queued: boolean
          shipping_priority: Database["public"]["Enums"]["shipping_priority"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_customer_name?: string | null
          display_destination_country_code?: string | null
          display_destination_country_name?: string | null
          display_fulfillment_status: Database["public"]["Enums"]["display_fulfillment_status"]
          display_is_cancelled?: boolean
          fulfillment_priority?: Database["public"]["Enums"]["fulfillment_priority"]
          id: string
          name: string
          queued?: boolean
          shipping_priority?: Database["public"]["Enums"]["shipping_priority"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_customer_name?: string | null
          display_destination_country_code?: string | null
          display_destination_country_name?: string | null
          display_fulfillment_status?: Database["public"]["Enums"]["display_fulfillment_status"]
          display_is_cancelled?: boolean
          fulfillment_priority?: Database["public"]["Enums"]["fulfillment_priority"]
          id?: string
          name?: string
          queued?: boolean
          shipping_priority?: Database["public"]["Enums"]["shipping_priority"]
          updated_at?: string | null
        }
        Relationships: []
      }
      orders_batches: {
        Row: {
          batch_id: number
          order_id: string
        }
        Insert: {
          batch_id: number
          order_id: string
        }
        Update: {
          batch_id?: number
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_session_batches_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_session_batches_session_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      print_logs: {
        Row: {
          active: boolean
          created_at: string | null
          id: string
          line_item_id: string
          print_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          id?: string
          line_item_id: string
          print_id: string
        }
        Update: {
          active?: boolean
          created_at?: string | null
          id?: string
          line_item_id?: string
          print_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "print_logs_line_item_id_fkey"
            columns: ["line_item_id"]
            isOneToOne: false
            referencedRelation: "line_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "print_logs_print_id_fkey"
            columns: ["print_id"]
            isOneToOne: false
            referencedRelation: "prints"
            referencedColumns: ["id"]
          },
        ]
      }
      prints: {
        Row: {
          heat_transfer_code: string | null
          id: string
          is_small_print: boolean | null
          location: Database["public"]["Enums"]["print_location"]
          product_id: string | null
        }
        Insert: {
          heat_transfer_code?: string | null
          id?: string
          is_small_print?: boolean | null
          location: Database["public"]["Enums"]["print_location"]
          product_id?: string | null
        }
        Update: {
          heat_transfer_code?: string | null
          id?: string
          is_small_print?: boolean | null
          location?: Database["public"]["Enums"]["print_location"]
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "print_info_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          blank_variant_id: string | null
          created_at: string | null
          id: string
          price: string
          product_id: string
          title: string
          updated_at: string | null
          warehouse_inventory: number
        }
        Insert: {
          blank_variant_id?: string | null
          created_at?: string | null
          id: string
          price: string
          product_id: string
          title: string
          updated_at?: string | null
          warehouse_inventory?: number
        }
        Update: {
          blank_variant_id?: string | null
          created_at?: string | null
          id?: string
          price?: string
          product_id?: string
          title?: string
          updated_at?: string | null
          warehouse_inventory?: number
        }
        Relationships: [
          {
            foreignKeyName: "gql_product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_blank_variant_id_fkey"
            columns: ["blank_variant_id"]
            isOneToOne: false
            referencedRelation: "blank_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          blank_id: string | null
          created_at: string | null
          id: string
          is_black_label: boolean
          status: Database["public"]["Enums"]["product_status"]
          title: string
          updated_at: string | null
          vendor: string
        }
        Insert: {
          blank_id?: string | null
          created_at?: string | null
          id: string
          is_black_label?: boolean
          status?: Database["public"]["Enums"]["product_status"]
          title: string
          updated_at?: string | null
          vendor: string
        }
        Update: {
          blank_id?: string | null
          created_at?: string | null
          id?: string
          is_black_label?: boolean
          status?: Database["public"]["Enums"]["product_status"]
          title?: string
          updated_at?: string | null
          vendor?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_blank_id_fkey"
            columns: ["blank_id"]
            isOneToOne: false
            referencedRelation: "blanks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          creator_vendor_name: string | null
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          username: string
        }
        Insert: {
          created_at?: string | null
          creator_vendor_name?: string | null
          email: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          username: string
        }
        Update: {
          created_at?: string | null
          creator_vendor_name?: string | null
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          api: Database["public"]["Enums"]["shipment_api"]
          chosen_carrier_name: string | null
          chosen_rate_id: string | null
          created_at: string
          id: string
          is_purchased: boolean
          is_refunded: boolean | null
          label_slip_path: string | null
          line_item_ids: string[] | null
          order_id: string
          parcel_snapshot: Json
          plain_slip_path: string | null
          shipment_id: string
          shippo_transaction_id: string | null
        }
        Insert: {
          api?: Database["public"]["Enums"]["shipment_api"]
          chosen_carrier_name?: string | null
          chosen_rate_id?: string | null
          created_at?: string
          id?: string
          is_purchased?: boolean
          is_refunded?: boolean | null
          label_slip_path?: string | null
          line_item_ids?: string[] | null
          order_id: string
          parcel_snapshot: Json
          plain_slip_path?: string | null
          shipment_id: string
          shippo_transaction_id?: string | null
        }
        Update: {
          api?: Database["public"]["Enums"]["shipment_api"]
          chosen_carrier_name?: string | null
          chosen_rate_id?: string | null
          created_at?: string
          id?: string
          is_purchased?: boolean
          is_refunded?: boolean | null
          label_slip_path?: string | null
          line_item_ids?: string[] | null
          order_id?: string
          parcel_snapshot?: Json
          plain_slip_path?: string | null
          shipment_id?: string
          shippo_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completedItems: number
          created_at: string
          id: number
          status: Database["public"]["Enums"]["task_status"]
          totalItems: number
        }
        Insert: {
          completedItems: number
          created_at?: string
          id?: number
          status: Database["public"]["Enums"]["task_status"]
          totalItems: number
        }
        Update: {
          completedItems?: number
          created_at?: string
          id?: number
          status?: Database["public"]["Enums"]["task_status"]
          totalItems?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      batch_document_type:
        | "assembly_list"
        | "picking_list"
        | "merged_label_slips"
      display_fulfillment_status:
        | "FULFILLED"
        | "IN_PROGRESS"
        | "ON_HOLD"
        | "OPEN"
        | "PARTIALLY_FULFILLED"
        | "PENDING_FULFILLMENT"
        | "RESTOCKED"
        | "SCHEDULED"
        | "UNFULFILLED"
      fulfillment_priority: "normal" | "urgent" | "critical"
      garment_size:
        | "xs"
        | "sm"
        | "md"
        | "lg"
        | "xl"
        | "2xl"
        | "3xl"
        | "4xl"
        | "5xl"
        | "os"
      garment_type:
        | "coat"
        | "jacket"
        | "hoodie"
        | "crewneck"
        | "longsleeve"
        | "tee"
        | "shorts"
        | "sweatpants"
        | "headwear"
        | "accessory"
      line_item_completion_status:
        | "not_printed"
        | "partially_printed"
        | "printed"
        | "in_stock"
        | "oos_blank"
        | "skipped"
        | "ignore"
      log_type: "INFO" | "WARN" | "ERROR"
      order_log_category: "SHIPPING" | "ASSEMBLY"
      print_location:
        | "front"
        | "back"
        | "left_sleeve"
        | "right_sleeve"
        | "other"
      product_status: "ACTIVE" | "DRAFT" | "ARCHIVED"
      shipment_api: "SHIPPO" | "EASYPOST"
      shipping_priority: "express" | "fastest" | "standard"
      task_status: "running" | "completed" | "cancelled"
      user_role:
        | "admin"
        | "superadmin"
        | "staff"
        | "creator"
        | "va"
        | "warehouse"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

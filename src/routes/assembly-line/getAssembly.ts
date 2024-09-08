import { supabase } from '$lib/supabase';
import type { Tables } from '$lib/types/database';
import type { QueryData } from '@supabase/supabase-js';
import axios from 'axios';

const query = supabase
  .from('batches')
  .select(
    `
    *,
    orders_batches!inner(
      order:orders!inner(
        line_items(
          *,
          products(id, prints(*), blanks(*)),
          product_variants(id, warehouse_inventory, blank_variants(*))
        )
      )
    )
    `
  )
  .single();

export type AssemblyLineItem = QueryData<
  typeof query
>['orders_batches'][number]['order']['line_items'][number];

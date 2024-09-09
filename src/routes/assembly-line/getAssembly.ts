import { supabase } from '$lib/supabase';
import type { Tables } from '$lib/types/database';
import type { QueryData } from '@supabase/supabase-js';
import axios from 'axios';

const query = supabase
  .from('batches')
  .select(
    `
*,
orders(
  line_items(
    *,
    order:orders(*, line_items(id)),
    products(id, is_black_label, prints(*), blanks(*)),
    product_variants(id, warehouse_inventory, blank_variants(*))
  )
)
`
  )

  .single();

export type AssemblyLineItem = QueryData<typeof query>['orders'][number]['line_items'][number];

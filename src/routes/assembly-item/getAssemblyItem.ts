import { supabase } from '$lib/supabase';
import type {
  AssemblyLineOrderQuery,
  ProductMediaQueryQuery
} from '$lib/types/admin.generated';
import type { QueryData } from '@supabase/supabase-js';
import axios from 'axios';
import invariant from 'tiny-invariant';

const queryString =
  '*, product_variants(*), order:orders(*,line_items(*)), print_logs(*), product:products(*, prints(*))';

const query = supabase.from('line_items').select(queryString).single();

export type AssemblyItem = QueryData<typeof query>;

export const getAssemblyItem = async (itemId: string) => {
  const id = `gid://shopify/LineItem/${itemId}`;

  const { data } = await supabase.from('line_items').select(queryString).eq('id', id).single();

  invariant(data, 'No data found in line_items table');

  const { data: axiosData } = await axios.get<{
    promiseArray: [{ data: AssemblyLineOrderQuery }, { data: ProductMediaQueryQuery }];
  }>(`${import.meta.env.VITE_SERVER_URL}/api/assembly/${itemId}`);

  const [{ data: orderData }, { data: mediaData }] = axiosData.promiseArray;

  invariant(orderData.node?.__typename === 'Order');

  const shopifyLineItem = orderData.node.lineItems.nodes.find(
    (lineItem) => lineItem.id === data.id
  );

  const blankPromise = async () => {
    try {
      const { data: blank, error } = await supabase
        .from('blanks')
        .select('*')
        .eq('id', data.product?.blank_id || '')
        .single();

      console.log(error);

      const blankVariant = await supabase
        .from('product_variants')
        .select('*, blank_variants(*)')
        .eq('id', data.variant_id || '')
        .single()
        .then(({ data, error }) => {
          console.log(error);

          return data?.blank_variants || null;
        });

      if (!blank || !blankVariant) return null;

      return {
        blank,
        blankVariant
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const mediaArray = Array.from(mediaData?.files.edges || []).reduce((acc, edge) => {
    if (edge.node.__typename === 'MediaImage') {
      acc.push({
        url: edge.node.image?.url.toString(),
        alt: edge.node.alt?.toString(),
        updatedAt: edge.node.updatedAt.toString()
      });
      return acc;
    }
    return acc;
  }, [] as { url: string; alt?: string; updatedAt: string }[]);

  console.log(mediaArray);

  return {
    lineItem: data,
    shopifyLineItem,
    media: mediaArray,
    blankData: await blankPromise()
  };
};

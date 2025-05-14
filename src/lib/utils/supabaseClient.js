import { createClient } from '@supabase/supabase-js';
// @ts-expect-error import api key
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY} from '$env/static/public';


const supabaseUrl = PUBLIC_SUPABASE_URL ?? '';

const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
);

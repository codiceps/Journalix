import { getSupabaseClient } from '../src/lib/supabase';

async function run() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error listing buckets:", error);
  } else {
    console.log("Found buckets:", data.map(b => b.name));
  }
}

run();

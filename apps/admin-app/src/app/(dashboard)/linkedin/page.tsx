import LinkedInList from "./LinkedInList";
import type { LinkedInPost } from "../../../types/database";
import { getServiceSupabase } from "../../../lib/db/supabase";
import { memDb } from "../../../lib/db/memory";

export default async function LinkedInPage() {
  const supabase = getServiceSupabase();
  let posts: LinkedInPost[] = [] as any;
  if (supabase) {
    const { data } = await supabase.from('linkedin_posts').select('*').order('created_at', { ascending: false });
    posts = (data as any[]) ?? [];
  } else {
    posts = memDb.linkedin_posts.slice().sort((a,b)=>+new Date(b.created_at)-+new Date(a.created_at)) as any;
  }
  return <LinkedInList initialPosts={posts} />;
}

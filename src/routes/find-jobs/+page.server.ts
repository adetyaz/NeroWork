import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/utils/supabaseClient';

export const load: PageServerLoad = async () => {
	const jobs = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
	if (jobs) {
		return jobs;
	}

	throw error(404, 'Jobs not found');
};

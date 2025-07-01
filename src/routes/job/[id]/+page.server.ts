import { supabase } from '$lib/utils/supabaseClient';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { data: job, error: supabaseError } = await supabase
		.from('jobs')
		.select(
			`*,
      client:clients!client_id(company_name, logo_image)`
		)
		.eq('id', params.id)
		.single();

	if (supabaseError || !job) {
		throw error(404, 'Job not found');
	}

	return { job };
};

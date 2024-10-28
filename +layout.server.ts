import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/auth';
// import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ request, locals }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	locals.getSession = async () => {
		return session;
	};

	if (!session?.user) {
		// redirect(302, '/sign-in');
	}

	return { session };
};

import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/auth';

export const load: LayoutServerLoad = async ({ request, locals }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	locals.getSession = async () => {
		return session;
	};

	if (session?.user) {
		console.log('user is logged in');
	}

	return { session };
};

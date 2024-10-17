import { svelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from './lib/auth';

export async function handle({ event, resolve }) {
	event.locals.getSession = async () => {
		return await auth.api.getSession({
			headers: event.request.headers
		});
	};

	return svelteKitHandler({ event, resolve, auth });
}

import { createAuthClient } from 'better-auth/svelte';
export const client = createAuthClient({
	baseURL: 'http://localhost:3000'
});

export const authClient = createAuthClient();

export type User = (typeof authClient.$Infer.Session)['user'];

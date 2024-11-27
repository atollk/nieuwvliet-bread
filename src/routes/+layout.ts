import { initializeStores } from '@skeletonlabs/skeleton';

export const ssr = false;
export const prerender = false;

// Handle the base path for client-side routing
export const load = ({ url }) => {
	return {
		url: url.pathname
	};
};

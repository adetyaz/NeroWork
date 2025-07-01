// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace NodeJS {
		interface ProcessEnv {
			MAILERSEND_API_KEY: string;
			RESEND_API_KEY: string; // Legacy - deprecated
		}
	}
}

// Environmental variables type declarations
declare module '$env/static/private' {
	export const MAILERSEND_API_KEY: string;
	export const RESEND_API_KEY: string; // Legacy - deprecated
}

declare module '$env/dynamic/private' {
	export const env: {
		MAILERSEND_API_KEY: string;
		RESEND_API_KEY: string; // Legacy - deprecated
		[key: string]: string | undefined;
	};
}

declare module '$env/static/public' {
	export const PUBLIC_SUPABASE_URL: string;
	export const PUBLIC_SUPABASE_ANON_KEY: string;
	export const PUBLIC_NERO_API_KEY: string;
	export const PUBLIC_ETHERSCAN_API_KEY: string;
	export const PUBLIC_RESEND_API_KEY: string;
}

export {};

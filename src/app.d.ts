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
			GMAIL_USER: string;
			GMAIL_APP_PASSWORD: string;
			MAILERSEND_API_KEY: string; // Deprecated
			RESEND_API_KEY: string; // Deprecated
			EMAILJS_PUBLIC_KEY: string; // Deprecated - doesn't work server-side
			EMAILJS_PRIVATE_KEY: string; // Deprecated - doesn't work server-side
			EMAILJS_SERVICE_ID: string; // Deprecated - doesn't work server-side
			EMAILJS_TEMPLATE_ID: string; // Deprecated - doesn't work server-side
		}
	}
}

// Environmental variables type declarations
declare module '$env/static/private' {
	export const GMAIL_USER: string;
	export const GMAIL_APP_PASSWORD: string;
	export const MAILERSEND_API_KEY: string; // Deprecated
	export const RESEND_API_KEY: string; // Deprecated
	export const EMAILJS_PUBLIC_KEY: string; // Deprecated - doesn't work server-side
	export const EMAILJS_PRIVATE_KEY: string; // Deprecated - doesn't work server-side
	export const EMAILJS_SERVICE_ID: string; // Deprecated - doesn't work server-side
	export const EMAILJS_TEMPLATE_ID: string; // Deprecated - doesn't work server-side
}

declare module '$env/dynamic/private' {
	export const env: {
		GMAIL_USER: string;
		GMAIL_APP_PASSWORD: string;
		MAILERSEND_API_KEY: string; // Deprecated
		RESEND_API_KEY: string; // Deprecated
		EMAILJS_PUBLIC_KEY: string; // Deprecated - doesn't work server-side
		EMAILJS_PRIVATE_KEY: string; // Deprecated - doesn't work server-side
		EMAILJS_SERVICE_ID: string; // Deprecated - doesn't work server-side
		EMAILJS_TEMPLATE_ID: string; // Deprecated - doesn't work server-side
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

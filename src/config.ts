export enum Environment {
	production = "production",
	staging = "staging",
	local = "local",
}

export interface EnvironmentConfig {
	environment: Environment
	appBaseUrl: string
	apiBaseUrl: string
	mcpBaseUrl: string
	firebase: {
		apiKey: string
		authDomain: string
		projectId: string
		storageBucket?: string
		messagingSenderId?: string
		appId?: string
	}
}

class BluEndpoint {
	public static instance = new BluEndpoint()
	public static get config() {
		return BluEndpoint.instance.config()
	}

	private environment: Environment = Environment.production

	private constructor() {
		// Set environment at module load
		const _env = process?.env?.BLU_ENVIRONMENT || process?.env?.CLINE_ENVIRONMENT
		if (_env && Object.values(Environment).includes(_env as Environment)) {
			this.environment = _env as Environment
			return
		}
	}

	public config(): EnvironmentConfig {
		return this.getEnvironment()
	}

	public setEnvironment(env: string) {
		switch (env.toLowerCase()) {
			case "staging":
				this.environment = Environment.staging
				break
			case "local":
				this.environment = Environment.local
				break
			default:
				this.environment = Environment.production
				break
		}
		console.info("Blu environment updated: ", this.environment)
	}

	public getEnvironment(): EnvironmentConfig {
		switch (this.environment) {
			case Environment.staging:
				return {
					environment: Environment.staging,
					appBaseUrl: "https://staging-app.getblu.in",
					apiBaseUrl: "https://core-api.staging.int.getblu.in",
					mcpBaseUrl: "https://api.getblu.in/v1/mcp",
					firebase: {
						apiKey: "AIzaSyASSwkwX1kSO8vddjZkE5N19QU9cVQ0CIk",
						authDomain: "blu-staging.firebaseapp.com",
						projectId: "blu-staging",
						storageBucket: "blu-staging.firebasestorage.app",
						messagingSenderId: "853479478430",
						appId: "1:853479478430:web:2de0dba1c63c3262d4578f",
					},
				}
			case Environment.local:
				return {
					environment: Environment.local,
					appBaseUrl: "http://localhost:3000",
					apiBaseUrl: "http://localhost:7777",
					mcpBaseUrl: "https://api.getblu.in/v1/mcp",
					firebase: {
						apiKey: "AIzaSyD8wtkd1I-EICuAg6xgAQpRdwYTvwxZG2w",
						authDomain: "blu-preview.firebaseapp.com",
						projectId: "blu-preview",
					},
				}
			default:
				return {
					environment: Environment.production,
					appBaseUrl: "https://app.getblu.in",
					apiBaseUrl: "https://api.getblu.in",
					mcpBaseUrl: "https://api.getblu.in/v1/mcp",
					firebase: {
						apiKey: "AIzaSyC5rx59Xt8UgwdU3PCfzUF7vCwmp9-K2vk",
						authDomain: "blu-prod.firebaseapp.com",
						projectId: "blu-prod",
						storageBucket: "blu-prod.firebasestorage.app",
						messagingSenderId: "941048379330",
						appId: "1:941048379330:web:45058eedeefc5cdfcc485b",
					},
				}
		}
	}
}

/**
 * Singleton instance to access the current environment configuration.
 * Usage:
 * - BluEnv.config() to get the current config.
 * - BluEnv.setEnvironment(Environment.local) to change the environment.
 */
export const BluEnv = BluEndpoint.instance

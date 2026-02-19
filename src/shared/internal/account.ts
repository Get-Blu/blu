/**
 * List of email domains that are considered trusted testers for Blu.
 */
const BLU_TRUSTED_TESTER_DOMAINS = ["fibilabs.tech"]

/**
 * Checks if the given email belongs to a Blu bot user.
 * E.g. Emails ending with @getblu.in
 */
export function isBluBotUser(email: string): boolean {
	return email.endsWith("@getblu.in")
}

export function isBluInternalTester(email: string): boolean {
	return isBluBotUser(email) || BLU_TRUSTED_TESTER_DOMAINS.some((d) => email.endsWith(`@${d}`))
}

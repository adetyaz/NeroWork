export const extractErrorCode = (error: any): string | null => {
	if (!error) return null;

	// Get the error message string
	const errorMessage = error.message || error.toString();

	// Extract AA error codes (format: AA## or FailedOp(##, "..."))
	const aaMatch = errorMessage.match(/AA(\d\d)/);
	if (aaMatch) return `AA${aaMatch[1]}`;

	// Extract Paymaster error codes
	const pmMatch = errorMessage.match(/PM(\d\d)/);
	if (pmMatch) return `PM${pmMatch[1]}`;

	// Extract error from FailedOp format
	const failedOpMatch = errorMessage.match(/FailedOp\((\d+),\s*"([^"]*)"/);
	if (failedOpMatch) {
		const code = parseInt(failedOpMatch[1]);
		// Map code to AA error format
		if (code >= 0 && code <= 99) {
			return `AA${code.toString().padStart(2, '0')}`;
		}
	}

	return null;
};

export const getReadableErrorMessage = (error: any): string => {
	// Extract error code
	const errorCode = extractErrorCode(error);

	// Get error message from map if code exists
	if (errorCode) {
		return ` (${errorCode})`;
	}

	// Handle other common Ethereum errors
	const errorMessage = error.message || error.toString();

	if (errorMessage.includes('insufficient funds')) {
		return 'Insufficient funds to execute this transaction';
	}

	if (errorMessage.includes('execution reverted')) {
		// Try to extract the revert reason
		const revertMatch = errorMessage.match(/execution reverted: (.*?)($|")/);
		if (revertMatch) {
			return `Transaction reverted: ${revertMatch[1]}`;
		}
		return 'Transaction reverted - check the target contract';
	}

	// If no specific error identified, return the original message
	return errorMessage;
};

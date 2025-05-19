// const getFilteredTokens = () => {
// 	if (paymentType === 0) return [];

// 	console.log('Payment type:', paymentType);
// 	console.log('All supported tokens:', supportedTokens);

// 	// For each token, check if it matches the payment type
// 	// If we can't determine the type, default to returning all tokens
// 	const filtered = supportedTokens.filter((token) => {
// 		// If no tokens have the right type, return all tokens for selected payment type
// 		if (token.type === undefined) return true;

// 		// Use loose equality (==) instead of strict equality (===) to match numeric types
// 		return (
// 			token.type == paymentType ||
// 			// For prepay (1), also include tokens with prepay=true
// 			(paymentType === 1 && token.prepay === true) ||
// 			// For postpay (2), also include tokens with postpay=true
// 			(paymentType === 2 && token.postpay === true)
// 		);
// 	});

// 	console.log('Filtered tokens for payment type', paymentType, ':', filtered);
// 	return filtered;
// };

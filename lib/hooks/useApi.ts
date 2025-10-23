import { useState, useCallback } from 'react';

interface ApiState<T> {
	data: T | null;
	loading: boolean;
	error: Error | null;
}

interface ApiActions<T> {
	execute: (...args: any[]) => Promise<T>;
	reset: () => void;
}

export function useApi<T>(
	apiFunction: (...args: any[]) => Promise<T>
): ApiState<T> & ApiActions<T> {
	const [state, setState] = useState<ApiState<T>>({
		data: null,
		loading: false,
		error: null,
	});

	const execute = useCallback(
		async (...args: any[]) => {
			setState({ data: null, loading: true, error: null });

			try {
				const result = await apiFunction(...args);
				setState({ data: result, loading: false, error: null });
				return result;
			} catch (error) {
				const errorObj =
					error instanceof Error ? error : new Error(String(error));
				setState({ data: null, loading: false, error: errorObj });
				throw errorObj;
			}
		},
		[apiFunction]
	);

	const reset = useCallback(() => {
		setState({ data: null, loading: false, error: null });
	}, []);

	return {
		...state,
		execute,
		reset,
	};
}

import { useState, useTransition } from 'react';

interface OptimisticUpdateOptions<T> {
	onSuccess?: (data: T) => void;
	onError?: (error: Error) => void;
}

export function useOptimisticUpdate<T>(
	initialData: T,
	options?: OptimisticUpdateOptions<T>
) {
	const [data, setData] = useState<T>(initialData);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<Error | null>(null);

	const updateOptimistically = async (
		optimisticUpdate: (currentData: T) => T,
		actualUpdate: () => Promise<T>
	) => {
		// Apply optimistic update immediately
		setData(optimisticUpdate);
		setError(null);

		startTransition(async () => {
			try {
				const result = await actualUpdate();
				setData(result);
				options?.onSuccess?.(result);
			} catch (err) {
				// Rollback optimistic update on error
				setData(initialData);
				setError(err as Error);
				options?.onError?.(err as Error);
			}
		});
	};

	return {
		data,
		isPending,
		error,
		updateOptimistically,
	};
}

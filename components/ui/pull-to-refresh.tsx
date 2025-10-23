'use client';

import { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
	onRefresh: () => Promise<void>;
	children: React.ReactNode;
	threshold?: number;
}

export function PullToRefresh({
	onRefresh,
	children,
	threshold = 80,
}: PullToRefreshProps) {
	const [isPulling, setIsPulling] = useState(false);
	const [pullDistance, setPullDistance] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const startY = useRef(0);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleTouchStart = (e: TouchEvent) => {
		if (containerRef.current?.scrollTop === 0) {
			startY.current = e.touches[0].clientY;
			setIsPulling(true);
		}
	};

	const handleTouchMove = (e: TouchEvent) => {
		if (!isPulling || isRefreshing) return;

		const currentY = e.touches[0].clientY;
		const distance = currentY - startY.current;

		if (distance > 0 && containerRef.current?.scrollTop === 0) {
			setPullDistance(Math.min(distance, threshold * 1.5));
			e.preventDefault();
		}
	};

	const handleTouchEnd = async () => {
		if (!isPulling || isRefreshing) return;

		if (pullDistance >= threshold) {
			setIsRefreshing(true);
			try {
				await onRefresh();
			} catch (error) {
				console.error('Refresh failed:', error);
			} finally {
				setIsRefreshing(false);
			}
		}

		setIsPulling(false);
		setPullDistance(0);
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		container.addEventListener('touchstart', handleTouchStart as any, {
			passive: false,
		});
		container.addEventListener('touchmove', handleTouchMove as any, {
			passive: false,
		});
		container.addEventListener('touchend', handleTouchEnd);

		return () => {
			container.removeEventListener('touchstart', handleTouchStart as any);
			container.removeEventListener('touchmove', handleTouchMove as any);
			container.removeEventListener('touchend', handleTouchEnd);
		};
	}, [isPulling, pullDistance, isRefreshing]);

	const rotation = (pullDistance / threshold) * 360;
	const opacity = Math.min(pullDistance / threshold, 1);

	return (
		<div ref={containerRef} className='relative overflow-auto h-full'>
			{/* Pull indicator */}
			<div
				className='absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 lg:hidden'
				style={{
					height: pullDistance,
					opacity: opacity,
				}}
			>
				<div
					className={`bg-indigo-600 rounded-full p-2 ${
						isRefreshing ? 'animate-spin' : ''
					}`}
					style={{
						transform: isRefreshing ? '' : `rotate(${rotation}deg)`,
					}}
				>
					<RefreshCw className='h-5 w-5 text-white' />
				</div>
			</div>

			{/* Content */}
			<div
				className='transition-transform duration-200'
				style={{
					transform: `translateY(${isPulling && !isRefreshing ? pullDistance : 0}px)`,
				}}
			>
				{children}
			</div>
		</div>
	);
}

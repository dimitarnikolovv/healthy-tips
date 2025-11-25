<script lang="ts">
	import 'vidstack/bundle';
	import { BULGARIAN_PLAYER } from '.';
	import type { MediaLoadingStrategy, MediaPosterLoadingStrategy } from 'vidstack';
	import type { MediaPlayerElement } from 'vidstack/elements';
	import { cn } from '$lib/utils';
	import type { Video } from '@/server/db/schema/videos';

	type Props = {
		video: Video;
		title?: string;
		class?: string;
		storageKey?: string;
		noScrubGesture?: boolean;
		options?: {
			posterLoad?: MediaPosterLoadingStrategy;
			load?: MediaLoadingStrategy;
		};
	};

	const defaultOptions: Props['options'] = {
		posterLoad: 'visible',
		load: 'visible'
	};

	let {
		video,
		title,
		storageKey,
		class: className = '',
		options = defaultOptions,
		noScrubGesture = false
	}: Props = $props();

	options = { ...defaultOptions, ...options };

	let player: MediaPlayerElement | null = null;

	$effect(() => {
		if (player) {
			player.preload = 'metadata';
		}
	});
</script>

<media-player
	title={title ?? video.title}
	bind:this={player}
	class={cn('aspect-video overflow-hidden rounded-lg border-0!', className)}
	playsInline
	preload="metadata"
	src="/api/videos/stream/{video.id}"
>
	<media-provider>
		<source src={`/api/videos/stream/${video.id}`} />
	</media-provider>
	<media-video-layout {noScrubGesture} translations={BULGARIAN_PLAYER}> </media-video-layout>
</media-player>

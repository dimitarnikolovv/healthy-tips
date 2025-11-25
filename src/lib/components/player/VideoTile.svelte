<script lang="ts">
	import type { Video } from '@/server/db/schema/videos';

	let { video }: { video: Video } = $props();

	function formatPublished(value: Video['publishedAt'], fallback: Video['createdAt']) {
		const target = value ?? fallback;
		if (!target) {
			return 'Очаква публикуване';
		}

		const date = typeof target === 'string' ? new Date(target) : target;
		return date.toLocaleDateString('bg-BG', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	const slugLabel = $derived(video.slug.replace(/-/g, ' '));
</script>

<article class="space-y-4 rounded-3xl border border-[#0f172a]/10 bg-[#f5f5f0] p-4 shadow-sm">
	<div class="relative overflow-hidden rounded-[22px] border border-[#0f172a]/15 bg-[#0f172a]/10">
		<div
			class="aspect-video overflow-hidden rounded-3xl [&_video]:aspect-video! [&_video]:object-cover!"
		>
			<video src="/api/videos/stream/{video.id}" playsinline controls>
				<track kind="captions" srclang="bg" label="Български" />
			</video>
		</div>
	</div>

	<div class="space-y-3">
		<div
			class="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-widest"
		>
			<span
				class="rounded-full px-3 py-1 font-semibold"
				style="background-color:#2fbf71;color:#0f172a;"
			>
				{slugLabel}
			</span>
			<span class="text-[#0f172a]/60">{formatPublished(video.publishedAt, video.createdAt)}</span>
		</div>

		<a href={`/videos/${video.id}`} class="text-xl font-semibold text-[#0f172a]">{video.title}</a>

		<p class="line-clamp-3 text-sm text-[#0f172a]/70">
			{video.description ??
				'Няма добавено описание към това видео, но можете да го изгледате веднага.'}
		</p>
	</div>
</article>

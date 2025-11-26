<script lang="ts">
	import VideoTile from '@/components/VideoTile.svelte';
	import type { Video } from '@/server/db/schema/videos.js';
	import { activeFilter, sidebarFilters, type SidebarFilter } from './sidebarFilters.js';

	let { data } = $props();
	const filteredVideos = $derived(getFilteredVideos(data.videos, $activeFilter));
	const heroVideo = $derived(filteredVideos[0]);
	const totalVideos = $derived(data.videos.length);

	const quickStats = $derived([
		{
			label: 'Видеа онлайн',
			value: totalVideos.toString(),
			caption: 'Общо налични'
		},
		{
			label: 'Филтър',
			value: sidebarFilters.find((item) => item.value === $activeFilter)?.label ?? 'Всички',
			caption: `${filteredVideos.length} резултата`
		},
		{
			label: 'Последно добавено',
			value: heroVideo ? heroVideo.title : 'Очаквайте скоро',
			caption: heroVideo ? formatPublished(heroVideo.publishedAt ?? heroVideo.createdAt) : '—'
		}
	]);

	function getFilteredVideos(videos: Video[], filter: SidebarFilter) {
		if (filter === 'week') {
			const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000;
			return videos.filter((video) => {
				const publishedAt = new Date(video.publishedAt ?? video.createdAt).getTime();
				return publishedAt >= threshold;
			});
		}

		if (filter === 'month') {
			const threshold = Date.now() - 30 * 24 * 60 * 60 * 1000;
			return videos.filter((video) => {
				const publishedAt = new Date(video.publishedAt ?? video.createdAt).getTime();
				return publishedAt >= threshold;
			});
		}

		return videos;
	}

	function formatPublished(value: string | Date | null) {
		if (!value) return 'Очаква публикуване';
		const date = typeof value === 'string' ? new Date(value) : value;
		return date.toLocaleDateString('bg-BG', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<section id="hero" class="rounded-3xl border border-[#0f172a]/10 bg-[#0f172a]/3 p-8">
	<p class="text-sm uppercase tracking-[0.3em] text-[#0f172a]/60">Днешен акцент</p>
	<h2 class="mt-4 text-4xl font-semibold leading-snug">
		Стилна колекция от видеа за фокусирано и минималистично преживяване.
	</h2>
	<p class="mt-4 max-w-2xl text-[#0f172a]/70">
		{#if heroVideo}
			Последно добавено: „{heroVideo.title}“ – пусни го директно или намери нова идея чрез
			търсачката.
		{:else}
			Очаквайте нови видеа съвсем скоро. Библиотеката се обновява постоянно.
		{/if}
	</p>
	<div class="mt-6 flex flex-wrap gap-4">
		<a href="#library" class="rounded-2xl border border-[#0f172a] px-6 py-3 text-sm font-semibold">
			Към библиотеката
		</a>
		{#if heroVideo}
			<a
				href="/videos/{heroVideo.id}"
				class="rounded-2xl bg-[#2fbf71] px-6 py-3 text-sm font-semibold text-[#0f172a]"
			>
				Пусни {heroVideo.title}
			</a>
		{/if}
	</div>
</section>

<form id="search" method="GET" class="rounded-2xl border border-[#0f172a]/10 bg-[#f5f5f0] p-5">
	<label class="block text-sm font-semibold uppercase tracking-[0.3em] text-[#0f172a]/60">
		Търсачка
		<input
			type="search"
			name="q"
			placeholder="Напишете тема или заглавие..."
			class="mt-3 w-full rounded-xl border border-[#0f172a]/20 bg-transparent px-4 py-3 text-base focus:border-[#2fbf71] focus:outline-none"
			value={data.searchTerm}
		/>
	</label>
	<div class="mt-4 flex flex-wrap gap-3">
		<button
			type="submit"
			class="rounded-xl bg-[#2fbf71] px-6 py-3 text-sm font-semibold text-[#0f172a]"
		>
			Търси
		</button>
		{#if data.searchTerm}
			<a href="/" class="rounded-xl border border-[#0f172a]/20 px-5 py-3 text-sm font-semibold">
				Изчисти
			</a>
		{/if}
	</div>
</form>

<div class="grid gap-4 md:grid-cols-3">
	{#each quickStats as stat}
		<article class="rounded-2xl border border-[#0f172a]/10 bg-[#f5f5f0] p-4">
			<p class="text-xs uppercase tracking-[0.3em] text-[#0f172a]/60">{stat.label}</p>
			<p class="mt-2 text-3xl font-semibold">{stat.value}</p>
			<p class="text-sm text-[#0f172a]/60">{stat.caption}</p>
		</article>
	{/each}
</div>

<section id="library" class="space-y-6">
	<div class="flex flex-wrap items-center gap-3">
		<h3 class="text-2xl font-semibold">Видео библиотека</h3>
		<span class="rounded-full border border-[#0f172a]/10 px-4 py-1 text-sm">
			{filteredVideos.length}
			{filteredVideos.length === 1 ? 'видео' : 'видеа'}
		</span>
		{#if data.searchTerm}
			<span class="rounded-full border border-[#0f172a]/10 px-4 py-1 text-sm text-[#0f172a]/70">
				Търсене: “{data.searchTerm}”
			</span>
		{/if}
		{#if $activeFilter !== 'all'}
			<span class="rounded-full border border-[#0f172a]/10 px-4 py-1 text-sm text-[#2fbf71]">
				Филтър: {sidebarFilters.find((item) => item.value === $activeFilter)?.label}
			</span>
		{/if}
	</div>

	{#if filteredVideos.length === 0}
		<div
			class="rounded-3xl border border-dashed border-[#0f172a]/20 p-10 text-center text-[#0f172a]/70"
		>
			<p class="text-lg font-semibold text-[#0f172a]">Няма намерени видеа</p>
			<p class="mt-2 text-sm">Променете търсенето или филтъра и опитайте отново.</p>
		</div>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			{#each filteredVideos as video (video.id)}
				<VideoTile {video} />
			{/each}
		</div>
	{/if}
</section>

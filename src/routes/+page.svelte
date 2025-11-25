<script lang="ts">
	import type { PageData } from './$types';
	import VideoTile from '$lib/components/player/VideoTile.svelte';

	let { data }: { data: PageData } = $props();

	const sidebarFilters = [
		{ label: 'Всички видеа', value: 'all', description: 'Пълната библиотека.' },
		{ label: 'Последните 7 дни', value: 'week', description: 'Най-новото съдържание.' },
		{ label: 'Този месец', value: 'month', description: 'Подбрани акценти.' }
	] as const;

	const navShortcuts = [
		{ label: 'Начало', href: '#hero' },
		{ label: 'Търсачка', href: '#search' },
		{ label: 'Библиотека', href: '#library' }
	] as const;

	type SidebarFilter = (typeof sidebarFilters)[number]['value'];

	let activeFilter: SidebarFilter = $state(sidebarFilters[0].value);
	const filteredVideos = $derived(getFilteredVideos(data.videos, activeFilter));
	const heroVideo = $derived(filteredVideos[0]);
	const totalVideos = $derived(data.videos.length);

	const userInitials = $derived(
		data.user
			? `${data.user.firstName?.[0] ?? ''}${data.user.lastName?.[0] ?? ''}`.toUpperCase()
			: ''
	);

	const quickStats = $derived([
		{
			label: 'Видеа онлайн',
			value: totalVideos.toString(),
			caption: 'Общо налични'
		},
		{
			label: 'Филтър',
			value: sidebarFilters.find((item) => item.value === activeFilter)?.label ?? 'Всички',
			caption: `${filteredVideos.length} резултата`
		},
		{
			label: 'Последно добавено',
			value: heroVideo ? heroVideo.title : 'Очаквайте скоро',
			caption: heroVideo ? formatPublished(heroVideo.publishedAt ?? heroVideo.createdAt) : '—'
		}
	]);

	function getFilteredVideos(videos: PageData['videos'], filter: SidebarFilter) {
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

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
</svelte:head>

<div class="min-h-screen bg-[#f5f5f0] text-[#0f172a]">
	<div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row">
		<aside
			class="w-full rounded-3xl border border-[#0f172a]/10 bg-[#f5f5f0] p-6 lg:max-w-xs lg:sticky lg:top-8 lg:self-start"
		>
			<div class="space-y-1">
				<p class="text-xs uppercase tracking-[0.3em] text-[#0f172a]/60">Healthy Tips</p>
				<h1 class="text-3xl font-semibold">Видео библиотека</h1>
				<p class="text-sm text-[#0f172a]/70">
					Подбрани материали за движение, хранене и баланс – в стилна, изчистена визия.
				</p>
			</div>

			<div class="mt-8 space-y-2">
				{#each sidebarFilters as item}
					<button
						type="button"
						class={`w-full rounded-2xl border border-[#0f172a]/10 px-4 py-3 text-left transition ${
							activeFilter === item.value
								? 'bg-[#2fbf71] font-semibold text-[#0f172a]'
								: 'bg-[#f5f5f0]'
						}`}
						onclick={() => (activeFilter = item.value)}
					>
						<p>{item.label}</p>
						<p class="text-sm text-[#0f172a]/60">{item.description}</p>
					</button>
				{/each}
			</div>

			<nav class="mt-8 space-y-2 text-sm">
				{#each navShortcuts as link}
					<a
						href={link.href}
						class="flex items-center justify-between rounded-2xl border border-[#0f172a]/10 px-4 py-3"
					>
						<span>{link.label}</span>
						<span aria-hidden="true">→</span>
					</a>
				{/each}
			</nav>

			<div class="mt-8 h-px bg-[#0f172a]/10"></div>

			<div class="pt-6">
				{#if data.user}
					<div class="flex items-center gap-3 rounded-2xl border border-[#0f172a]/10 px-4 py-3">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f172a]/90 text-lg font-semibold text-[#f5f5f0]"
						>
							{userInitials || 'HT'}
						</div>
						<div class="flex-1">
							<p class="font-semibold">{data.user.firstName} {data.user.lastName}</p>
							<p class="text-xs uppercase tracking-[0.2em] text-[#0f172a]/60">
								{data.user.role === 'admin' ? 'Администратор' : 'Потребител'}
							</p>
						</div>
						<a href="/logout" class="text-sm font-semibold text-[#2fbf71]">Изход</a>
					</div>
				{:else}
					<div class="space-y-3 rounded-2xl border border-[#0f172a]/10 p-4">
						<p class="text-sm text-[#0f172a]/70">
							Влезте, за да запазвате любими видеа и да получавате препоръки.
						</p>
						<div class="flex gap-3">
							<a
								href="/login"
								class="flex-1 rounded-xl border border-[#0f172a]/10 py-2 text-center font-semibold"
							>
								Вход
							</a>
							<a
								href="/register"
								class="flex-1 rounded-xl bg-[#2fbf71] py-2 text-center font-semibold text-[#0f172a]"
							>
								Регистрация
							</a>
						</div>
					</div>
				{/if}
			</div>
		</aside>

		<main class="flex-1 space-y-10">
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
					<a
						href="#library"
						class="rounded-2xl border border-[#0f172a] px-6 py-3 text-sm font-semibold"
					>
						Към библиотеката
					</a>
					{#if heroVideo}
						<button
							form="search"
							name="q"
							type="submit"
							value={heroVideo.title}
							class="rounded-2xl bg-[#2fbf71] px-6 py-3 text-sm font-semibold text-[#0f172a]"
						>
							Пусни {heroVideo.title}
						</button>
					{/if}
				</div>
			</section>

			<form
				id="search"
				method="GET"
				class="rounded-2xl border border-[#0f172a]/10 bg-[#f5f5f0] p-5"
			>
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
						<a
							href="/"
							class="rounded-xl border border-[#0f172a]/20 px-5 py-3 text-sm font-semibold"
						>
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
						<span
							class="rounded-full border border-[#0f172a]/10 px-4 py-1 text-sm text-[#0f172a]/70"
						>
							Търсене: “{data.searchTerm}”
						</span>
					{/if}
					{#if activeFilter !== 'all'}
						<span class="rounded-full border border-[#0f172a]/10 px-4 py-1 text-sm text-[#2fbf71]">
							Филтър: {sidebarFilters.find((item) => item.value === activeFilter)?.label}
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
					<div class="grid gap-6 md:grid-cols-2">
						{#each filteredVideos as video (video.id)}
							<VideoTile {video} />
						{/each}
					</div>
				{/if}
			</section>
		</main>
	</div>
</div>

<script lang="ts">
	import { page } from '$app/state';
	import { RolesEnum } from '@/types/enums.js';
	import { activeFilter, sidebarFilters } from './sidebarFilters.js';

	let { data, children } = $props();

	const navShortcuts = [
		{ label: 'Начало', href: '/#hero' },
		{ label: 'Търсачка', href: '/#search' },
		{ label: 'Библиотека', href: '/#library' }
	] as const;

	const userInitials = $derived(
		data.user
			? `${data.user.firstName?.[0] ?? ''}${data.user.lastName?.[0] ?? ''}`.toUpperCase()
			: ''
	);
</script>

<svelte:head>
	<title>{page.data.title}</title>
	<meta name="description" content={page.data.description} />
</svelte:head>

<div class="min-h-screen bg-[#f5f5f0] text-[#0f172a]">
	<div class="mx-auto flex flex-col gap-8 px-4 py-10 lg:flex-row">
		<aside
			class="w-full rounded-3xl border border-[#0f172a]/10 bg-[#f5f5f0] p-6 lg:max-w-sm lg:sticky lg:top-8 lg:self-start"
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
							$activeFilter === item.value
								? 'bg-[#2fbf71] font-semibold text-[#0f172a]'
								: 'bg-[#f5f5f0]'
						}`}
						onclick={() => activeFilter.set(item.value)}
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
							<p class="text-xs text-[#0f172a]/70">{data.user.email}</p>
						</div>
						<a href="/logout" class="text-sm font-semibold text-[#2fbf71]">Изход</a>
					</div>

					{#if data.user.role === RolesEnum.admin}
						<a
							href="/admin"
							class="flex py-3 px-6 border mt-4 border-[#0f172a]/10 rounded-2xl hover:bg-[#2fbf71] hover:text-[#0f172a] font-semibold text-center justify-center text-sm text-[#0f172a]/70 transition"
							>Към панела</a
						>
					{/if}
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
			{@render children?.()}
		</main>
	</div>
</div>

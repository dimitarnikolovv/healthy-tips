<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination';
	import { bytesToHumanReadable } from '$lib/utils/videos';
	import { toast } from 'svelte-sonner';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data, form } = $props();

	const formatter = new Intl.DateTimeFormat('bg-BG', {
		dateStyle: 'medium',
		timeStyle: 'short'
	});

	const handlePageChange = async (newPage: number | undefined) => {
		if (newPage === undefined) return;
		if (newPage > data.totalPages || newPage < 1) return;

		const searchParams = new URLSearchParams(page.url.search);
		searchParams.set('page', newPage.toString());
		searchParams.set('limit', data.limit.toString());

		await goto(`${page.url.pathname}?${searchParams.toString()}`);
	};

	$effect(() => {
		if (!form?.message) return;

		if ('success' in form && form.success) {
			toast.success(form.message);
		} else {
			toast.error(form.message);
		}
	});

	function formatDate(value: Date | string | null) {
		if (!value) return '—';
		return formatter.format(new Date(value));
	}

	function confirmDeletion(event: Event) {
		if (!confirm('Сигурни ли сте, че искате да изтриете видеото?')) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<div class="space-y-6">
	<header class="space-y-1">
		<h1 class="text-3xl font-semibold tracking-tight">Всички видеа</h1>
		<p class="text-muted-foreground">Преглед, редакция и изтриване на качените видеа.</p>
	</header>

	<div class="overflow-hidden rounded-2xl border">
		{#if data.videos.length === 0}
			<div class="grid min-h-[200px] place-items-center px-4 py-16 text-center">
				<div class="space-y-2">
					<p class="text-lg font-medium">Все още няма качени видеа.</p>
					<p class="text-sm text-muted-foreground">
						Добавете първото съдържание от секцията „Качване на видео“.
					</p>
				</div>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full border-collapse text-sm">
					<thead>
						<tr class="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
							<th class="px-4 py-3 font-medium">Заглавие</th>
							<th class="px-4 py-3 font-medium">Статус</th>
							<th class="px-4 py-3 font-medium">Размер</th>
							<th class="px-4 py-3 font-medium">Качено</th>
							<th class="px-4 py-3 font-medium">Публикувано</th>
							<th class="px-4 py-3 font-medium">Действия</th>
						</tr>
					</thead>
					<tbody>
						{#each data.videos as video}
							<tr class="border-t">
								<td class="px-4 py-4">
									<div class="font-medium">{video.title}</div>
									<p class="text-xs text-muted-foreground">
										{video.uploader?.firstName ?? '-'}
										{video.uploader?.lastName ?? '-'}
									</p>
								</td>
								<td class="px-4 py-4">
									<span
										class={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
											video.status === 'published'
												? 'bg-emerald-100 text-emerald-800 '
												: 'bg-amber-100 text-amber-800 '
										}`}
									>
										{video.status === 'published' ? 'Публикувано' : 'Чернова'}
									</span>
								</td>
								<td class="px-4 py-4 text-muted-foreground"
									>{bytesToHumanReadable(video.fileSize)}</td
								>
								<td class="px-4 py-4 text-xs text-muted-foreground"
									>{formatDate(video.createdAt)}</td
								>
								<td class="px-4 py-4 text-xs text-muted-foreground"
									>{formatDate(video.publishedAt)}</td
								>
								<td class="px-4 py-4">
									<div class="flex gap-2">
										<a
											href={`/admin/videos/${video.id}`}
											class="rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:border-primary hover:text-primary"
										>
											Редакция
										</a>
										<form method="POST" action="?/delete" class="inline-flex">
											<input type="hidden" name="videoId" value={video.id} />
											<button
												type="submit"
												class="rounded-lg border border-destructive/60 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10"
												onclick={confirmDeletion}
											>
												Изтрий
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	{#if data.videos.length > 0}
		<div class="mt-8">
			<Pagination.Root
				count={data.totalItems}
				page={data.page}
				perPage={data.limit}
				onPageChange={async (p) => {
					await handlePageChange(p);
				}}
			>
				{#snippet children({ pages, currentPage })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.PrevButton
								onclick={() => handlePageChange(currentPage ? currentPage - 1 : 1)}
							>
								<ChevronLeft class="w-4" />
								<span class="hidden sm:inline">Назад</span>
							</Pagination.PrevButton>
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.NextButton
								onclick={() => handlePageChange(currentPage ? currentPage + 1 : 1)}
							>
								<span class="hidden sm:inline">Напред</span>
								<ChevronRight class="w-4" />
							</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		</div>
	{/if}
</div>

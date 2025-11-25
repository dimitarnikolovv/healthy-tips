<script lang="ts">
	import { page } from '$app/state';

	const navItems = [
		{
			href: '/admin',
			label: 'Качване на видео',
			description: 'Добавяне на ново съдържание'
		},
		{
			href: '/admin/videos',
			label: 'Всички видеа',
			description: 'Управление и изтриване'
		}
	];

	let { children } = $props();
</script>

<div class="min-h-screen bg-muted/20 pl-72">
	<aside class="fixed inset-y-0 left-0 flex w-72 flex-col border-r bg-background p-6 shadow-sm">
		<div class="space-y-1">
			<h2 class="text-xl font-semibold">Администрация</h2>
			<p class="text-sm text-muted-foreground">Управление на съдържанието в Healthy Tips</p>
		</div>

		<nav class="mt-6 space-y-1">
			{#each navItems as item}
				<a
					href={item.href}
					class={`block rounded-xl border px-4 py-3 text-sm transition hover:border-primary hover:text-primary ${
						page.url.pathname === item.href ||
						(page.url.pathname.startsWith(item.href) && item.href !== '/admin')
							? 'border-primary bg-primary/5 text-primary'
							: 'border-transparent bg-transparent text-foreground'
					}`}
				>
					<div class="font-medium">{item.label}</div>
					<p class="text-xs text-muted-foreground">{item.description}</p>
				</a>
			{/each}
		</nav>

		<div class="mt-auto space-y-1 text-xs text-muted-foreground">
			<p>Healthy Tips Video Platform</p>
			<p class="font-semibold text-foreground">© {new Date().getFullYear()}</p>
		</div>
	</aside>

	<div class="flex min-h-screen flex-col">
		<header class="border-b bg-background/90 backdrop-blur">
			<div
				class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
			>
				<a href="/admin" class="flex items-center gap-2">
					<div
						class="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-semibold"
					>
						HT
					</div>
					<div>
						<p class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
							Healthy Tips
						</p>
						<p class="text-lg font-semibold leading-tight">Admin</p>
					</div>
				</a>

				<div class="flex flex-wrap items-center gap-3">
					<a
						href="/"
						class="rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
					>
						Към сайта
					</a>
					<a
						href="/logout"
						class="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/90"
					>
						Изход
					</a>
				</div>
			</div>
		</header>

		<div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
			<main class="rounded-2xl border bg-background p-6 shadow-sm">
				{@render children()}
			</main>
		</div>
	</div>
</div>

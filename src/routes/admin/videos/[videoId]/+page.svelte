<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { adminVideoUpdateSchema } from './schema';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { displayVideoStatus, VideoStatusEnum } from '$lib/types/enums';
	import { bytesToHumanReadable } from '$lib/utils/videos';
	import { toast } from 'svelte-sonner';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const editForm = superForm(data.editForm, {
		validators: zod4Client(adminVideoUpdateSchema),
		resetForm: false
	});

	const { form: formData, enhance: updateEnhance, delayed } = editForm;

	$formData.title = data.video.title;
	$formData.description = data.video.description ?? '';
	$formData.status = data.video.status;

	const statusOptions = [
		{ label: 'Чернова', value: VideoStatusEnum.draft },
		{ label: 'Публикувано', value: VideoStatusEnum.published }
	];

	$effect(() => {
		if (!form?.message) return;

		if (form.form?.valid) {
			toast.success(form.message);
		} else {
			toast.error(form.message);
		}
	});
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<div class="space-y-6">
	<header class="space-y-1">
		<a href="/admin/videos" class="text-sm text-muted-foreground hover:text-primary"
			>&larr; Назад към всички видеа</a
		>
		<h1 class="text-3xl font-semibold tracking-tight">Редакция: {data.video.title}</h1>
		<p class="text-muted-foreground">
			ID: <span class="font-mono text-sm">{data.video.id}</span>
		</p>
	</header>

	<div class="grid gap-6 lg:grid-cols-[2fr,1fr]">
		<form method="POST" action="?/update" use:updateEnhance class="space-y-5">
			<Card.Root class="border-site-primary">
				<Card.Header>
					<Card.Title>Основна информация</Card.Title>
					<Card.Description
						>Редактирайте заглавието, описанието и статуса на видеото.</Card.Description
					>
				</Card.Header>
				<Card.Content class="space-y-4">
					<Form.Field form={editForm} name="title">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Заглавие</Form.Label>
								<Input
									{...props}
									type="text"
									placeholder="Заглавие на видеото"
									required
									disabled={$delayed}
									bind:value={$formData.title}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field form={editForm} name="description">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Описание</Form.Label>
								<textarea
									{...props}
									class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[3px] shadow-xs flex min-h-[180px] w-full rounded-md border px-3 py-2 text-base outline-none transition-[color,box-shadow] md:text-sm"
									placeholder="Добавете описание към видеото..."
									disabled={$delayed}
									bind:value={$formData.description}
								>
								</textarea>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field form={editForm} name="status">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label
									>Статус
									<span class="text-destructive text-sm">*</span></Form.Label
								>
								<Select.Root
									type="single"
									disabled={$delayed}
									{...props}
									bind:value={$formData.status}
									allowDeselect={false}
								>
									<Select.Trigger class="w-full" disabled={$delayed}>
										{displayVideoStatus($formData.status)}
									</Select.Trigger>
									<Select.Content>
										<Select.Item
											value={VideoStatusEnum.draft}
											label={displayVideoStatus(VideoStatusEnum.draft)}
										/>
										<Select.Item
											value={VideoStatusEnum.published}
											label={displayVideoStatus(VideoStatusEnum.published)}
										/>
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
				<Card.Footer class="flex justify-end gap-2">
					<Form.Button class="btn-site-primary min-w-40" disabled={$delayed}
						>Запази промените</Form.Button
					>
				</Card.Footer>
			</Card.Root>
		</form>

		<section class="space-y-4 rounded-2xl border bg-muted/30 p-5 text-sm">
			<div>
				<p class="text-xs uppercase text-muted-foreground">Slug</p>
				<p class="font-medium">{data.video.slug}</p>
			</div>
			<div>
				<p class="text-xs uppercase text-muted-foreground">Размер на файла</p>
				<p class="font-medium">{bytesToHumanReadable(data.video.fileSize)}</p>
			</div>
			<div>
				<p class="text-xs uppercase text-muted-foreground">S3 обект</p>
				<p class="font-mono text-xs break-all">{data.video.objectKey}</p>
			</div>
			<div>
				<p class="text-xs uppercase text-muted-foreground">Bucket</p>
				<p class="font-medium">{data.video.bucket}</p>
			</div>
			<div>
				<p class="text-xs uppercase text-muted-foreground">Създадено на</p>
				<p class="font-medium">
					{new Date(data.video.createdAt).toLocaleString('bg-BG')}
				</p>
			</div>
			<div>
				<p class="text-xs uppercase text-muted-foreground">Последно публикувано</p>
				<p class="font-medium">
					{data.video.publishedAt ? new Date(data.video.publishedAt).toLocaleString('bg-BG') : '—'}
				</p>
			</div>
		</section>
	</div>
</div>

<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { ACCEPTED_VIDEO_MIME_TYPES, adminVideoUploadSchema } from './schema';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import Dropzone from '@/components/ui-extras/dropzone';
	import { Button } from '@/components/ui/button';
	import { Trash2, Upload } from '@lucide/svelte';
	import { displayVideoStatus, VideoStatusEnum } from '@/types/enums';

	let { data, form } = $props();

	const uploadForm = superForm(data.uploadForm, {
		validators: zod4Client(adminVideoUploadSchema),
		resetForm: false,
		dataType: 'json'
	});

	const { form: formData, enhance: uploadEnhance, delayed } = uploadForm;

	const showVideoPreviewOnDrop = async (event: any) => {
		const { acceptedFiles } = event.detail;

		const file: File = acceptedFiles[0];

		if (file) {
			$formData.videoFile = file;
		}
	};

	$effect(() => {
		if (form?.message) {
			console.log(form.form);
			if (form.form.valid) {
				toast.success(form.message);
			} else {
				toast.error(form.message);
			}
		}
	});
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<section class="mx-auto w-full max-w-3xl space-y-6 py-12">
	<header class="space-y-2">
		<h1 class="text-3xl font-semibold tracking-tight">Качване на ново видео</h1>
		<p class="text-muted-foreground">
			Файловете се съхраняват в MinIO (S3) и веднага се записват в базата данни. При грешка
			качването се анулира автоматично.
		</p>
	</header>

	<form
		method="POST"
		action="?/upload"
		enctype="multipart/form-data"
		use:uploadEnhance
		class="space-y-4"
	>
		<Card.Root class="border-site-primary">
			<Card.Header>
				<Card.Title>Данни за видеото</Card.Title>
				<Card.Description>Попълнете основната информация и добавете видео файл.</Card.Description>
			</Card.Header>

			<Card.Content class="space-y-5">
				<Form.Field form={uploadForm} name="title">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Заглавие <span class="text-destructive">*</span></Form.Label>
							<Input
								{...props}
								type="text"
								placeholder="Пример: Смути с горски плодове"
								disabled={$delayed}
								required
								bind:value={$formData.title}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field form={uploadForm} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Описание</Form.Label>
							<textarea
								{...props}
								class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[3px] shadow-xs flex min-h-40 w-full rounded-md border px-3 py-2 text-base outline-none transition-[color,box-shadow] md:text-sm"
								placeholder="Добавете кратко описание за видеото..."
								disabled={$delayed}
								bind:value={$formData.description}
							>
							</textarea>
						{/snippet}
					</Form.Control>
					<Form.Description>
						Ограничение: до 2000 символа. Описанието се показва на потребителите.
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field form={uploadForm} name="status">
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

				<Form.Field form={uploadForm} name="videoFile">
					<Form.Control>
						{#snippet children({ props })}
							<Dropzone
								on:click={showVideoPreviewOnDrop}
								on:drop={showVideoPreviewOnDrop}
								disabled={$delayed}
								multiple={false}
								accept={ACCEPTED_VIDEO_MIME_TYPES.join(',')}
								class="mb-0! aspect-auto! h-full min-h-72"
							>
								{#if !$formData.videoFile}
									<div class="pointer-events-none flex flex-col items-center gap-1">
										<Upload class="text-muted-foreground pointer-events-none h-5 w-5" />
										<span> Качи видео файл </span>
									</div>
								{/if}

								{#if $formData.videoFile}
									<div class="bg-muted m-4 grid gap-2 rounded-md p-2 max-sm:mb-10">
										<div>
											Избран видео файл: <span class="font-mono">{$formData.videoFile.name}</span>.
										</div>

										<Button
											class="mx-auto rounded-full"
											size="icon"
											variant="destructive"
											onclick={() => {
												// @ts-expect-error - we want to clear the video file
												$formData.videoFile = undefined;
											}}
										>
											<Trash2></Trash2>
										</Button>
									</div>
								{/if}
							</Dropzone>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>

			<Card.Footer class="flex justify-end">
				<Form.Button class="btn-site-primary min-w-40" disabled={$delayed}>Качи видео</Form.Button>
			</Card.Footer>
		</Card.Root>
	</form>
</section>

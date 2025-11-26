<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { addCommentSchema } from './schema.js';
	import CommentRow from './CommentRow.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Textarea } from '$lib/components/ui/textarea';

	let { data } = $props();

	const addCommentForm = superForm(data.addCommentForm, {
		validators: zod4Client(addCommentSchema),
		resetForm: true
	});

	const { form: formData, enhance: addCommentEnhance, delayed } = addCommentForm;
</script>

<div class="flex">
	<div class="space-y-4 max-w-7xl mx-auto">
		<div
			class="aspect-video overflow-hidden [&_video]:aspect-video! rounded-3xl [&_video]:object-cover!"
		>
			<video src="/api/videos/stream/{data.video.id}" playsinline controls>
				<track kind="captions" srclang="bg" label="Български" />
			</video>
		</div>

		<div>
			<h1 class="text-2xl font-bold">{data.video.title}</h1>
			<p>{data.video.description ?? 'Няма описание'}</p>
		</div>

		<div>
			{#if data.user}
				<form action="?/addComment" method="POST" use:addCommentEnhance>
					<Form.Field form={addCommentForm} name="content">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Коментар</Form.Label>
								<Textarea
									{...props}
									disabled={$delayed}
									bind:value={$formData.content}
									class="placeholder:text-muted-foreground border border-primary"
									placeholder="Напишете коментар..."
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Button type="submit" disabled={$delayed}>Добави коментар</Form.Button>
				</form>
			{:else}
				<p class="text-muted-foreground">Влезте в профила си, за да коментирате това видео.</p>
			{/if}
			<section class="mt-8 space-y-4">
				<h2 class="text-xl font-semibold">Коментари</h2>

				{#if data.comments.length > 0}
					<div class="space-y-3">
						{#each data.comments as comment (comment.id)}
							<CommentRow
								{comment}
								currentUser={data.user}
								editForm={data.editCommentForm}
								deleteForm={data.deleteCommentForm}
							></CommentRow>
						{/each}
					</div>
				{:else}
					<p class="text-muted-foreground">Все още няма коментари. Бъдете първи!</p>
				{/if}
			</section>
		</div>
	</div>
</div>

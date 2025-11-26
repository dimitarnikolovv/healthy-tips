<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import {
		editCommentSchema,
		deleteCommentSchema,
		type DeleteCommentSchema,
		type EditCommentSchema
	} from './schema';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import type { Comment } from '@/server/db/schema/comments';
	import type { User } from '@/server/db/schema/auth';
	import * as Form from '$lib/components/ui/form';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';

	type Props = {
		editForm: SuperValidated<EditCommentSchema>;
		deleteForm: SuperValidated<DeleteCommentSchema>;

		comment: Comment & {
			user: Pick<User, 'id' | 'firstName' | 'lastName' | 'role'>;
		};

		currentUser: Omit<User, 'passwordHash'> | null;
	};

	let { editForm, deleteForm, comment, currentUser }: Props = $props();

	const formatDate = (value: Date | string | null | undefined) => {
		if (!value) return '';
		const date = value instanceof Date ? value : new Date(value);
		return date.toLocaleString('bg-BG', {
			dateStyle: 'medium',
			timeStyle: 'short'
		});
	};

	const editCommentForm = superForm(structuredClone(editForm), {
		validators: zod4Client(editCommentSchema),
		onSubmit: () => {
			isEditing = false;
		}
	});

	const { form: editFormData, enhance: editCommentEnhance, delayed: editDelayed } = editCommentForm;

	const deleteCommentForm = superForm(structuredClone(deleteForm), {
		validators: zod4Client(deleteCommentSchema)
	});

	const {
		form: deleteFormData,
		enhance: deleteCommentEnhance,
		delayed: deleteDelayed
	} = deleteCommentForm;

	let isOwner = $derived(currentUser?.id === comment.userId);

	let isEditing = $state(false);

	$editFormData.id = comment.id;
	$editFormData.content = comment.content;
	$deleteFormData.id = comment.id;
</script>

<article class="rounded-2xl border border-border bg-card p-4 text-sm shadow-xs space-y-2">
	<header class="flex flex-wrap items-center justify-between gap-4">
		<div class="space-y-1">
			<p class="font-semibold leading-none">
				{comment.user.firstName}
				{comment.user.lastName}
			</p>
			<p class="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
		</div>

		{#if isOwner}
			<div class="flex items-center gap-2">
				<Button
					type="button"
					size="sm"
					variant="outline"
					onclick={() => (isEditing = !isEditing)}
					aria-pressed={isEditing}
				>
					{isEditing ? 'Откажи' : 'Редактирай'}
				</Button>

				<form action="?/deleteComment" method="POST" use:deleteCommentEnhance>
					<input type="hidden" name="id" bind:value={$deleteFormData.id} />
					<Form.Button variant="destructive" size="sm" disabled={$deleteDelayed}>Изтрий</Form.Button
					>
				</form>
			</div>
		{/if}
	</header>

	{#if isEditing}
		<form class="space-y-3" action="?/editComment" method="POST" use:editCommentEnhance>
			<input type="hidden" name="id" bind:value={$editFormData.id} />

			<Form.Field form={editCommentForm} name="content">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Коментар</Form.Label>
						<Textarea
							{...props}
							class="min-h-[140px] placeholder:text-muted-foreground"
							disabled={$editDelayed}
							bind:value={$editFormData.content}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="flex items-center gap-2">
				<Form.Button disabled={$editDelayed}>Запази</Form.Button>
				<Button type="button" variant="ghost" onclick={() => (isEditing = false)}>Откажи</Button>
			</div>
		</form>
	{:else}
		<p class="whitespace-pre-wrap leading-relaxed text-base">{comment.content}</p>
	{/if}
</article>

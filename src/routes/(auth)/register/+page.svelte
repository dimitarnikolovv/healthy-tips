<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form';
	import { registerUserSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import TogglePassword from '$lib/components/TogglePassword.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { toast } from 'svelte-sonner';
	import { ArrowLeft } from '@lucide/svelte';

	let { data, form } = $props();

	const registerForm = superForm(data.registerForm, {
		validators: zod4Client(registerUserSchema),
		resetForm: false
	});

	const { form: formData, enhance: registerEnhance, delayed } = registerForm;

	let toggled: boolean = $state(false);

	$effect(() => {
		if (form?.message) {
			if (form.form.valid) {
				toast.success(form.message);
			} else {
				toast.error(form.message);
			}
		}
	});
</script>

<div class="grid h-[70dvh] place-items-center">
	<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
		<div class="grid gap-6">
			<form
				method="POST"
				action="?/register"
				use:registerEnhance
				class="grid place-items-center gap-4"
			>
				<Card.Root class="border-site-primary w-full max-w-md">
					<Card.Header>
						<Card.Title class="text-2xl">
							<h1 class="text-2xl font-semibold tracking-tight">Регистрация в платформата</h1>
							<a href="/" class="text-sm flex items-center gap-2 mt-2 hover:underline">
								<ArrowLeft class="size-4" /> Към началната страница</a
							>
						</Card.Title>
					</Card.Header>
					<Card.Content class="grid gap-4">
						<div class="grid grid-cols-2 gap-2">
							<Form.Field form={registerForm} name="firstName">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Име <span class="text-destructive text-base">*</span></Form.Label>
										<Input
											{...props}
											disabled={$delayed}
											bind:value={$formData.firstName}
											type="text"
											required
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>

							<Form.Field form={registerForm} name="lastName">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label
											>Фамилия <span class="text-destructive text-base">*</span></Form.Label
										>
										<Input
											{...props}
											disabled={$delayed}
											bind:value={$formData.lastName}
											type="text"
											required
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>

						<Form.Field form={registerForm} name="email">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Имейл <span class="text-destructive text-base">*</span></Form.Label>
									<Input
										{...props}
										disabled={$delayed}
										bind:value={$formData.email}
										type="email"
										class="placeholder:text-muted-foreground"
										placeholder="m@example.com"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field form={registerForm} name="password">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Парола <span class="text-destructive text-base">*</span></Form.Label>

									<div class="relative">
										<Input
											{...props}
											disabled={$delayed}
											bind:value={$formData.password}
											type={toggled ? 'text' : 'password'}
											required
										/>

										<button
											onclick={() => {
												toggled = !toggled;
											}}
											type="button"
											disabled={$delayed}
											form="_!"
											class="text-muted-foreground absolute top-1.5 right-2 hover:cursor-pointer"
										>
											<TogglePassword {toggled} />
										</button>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field form={registerForm} name="passwordConfirm">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>
										Потвърдете паролата <span class="text-destructive text-base">*</span>
									</Form.Label>

									<div class="relative">
										<Input
											{...props}
											disabled={$delayed}
											bind:value={$formData.passwordConfirm}
											type={toggled ? 'text' : 'password'}
											required
										/>

										<button
											onclick={() => {
												toggled = !toggled;
											}}
											type="button"
											disabled={$delayed}
											form="_!"
											class="text-muted-foreground absolute top-1.5 right-2 hover:cursor-pointer"
										>
											<TogglePassword {toggled} />
										</button>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
					<Card.Footer>
						<Form.Button disabled={$delayed} class="btn-site-primary w-full"
							>Регистрация</Form.Button
						>
					</Card.Footer>
				</Card.Root>
			</form>
			<div class="mt-4 text-center text-sm">
				Имаш профил?
				<a href="/login" class="underline"> Вход </a>
			</div>
		</div>
	</div>
</div>

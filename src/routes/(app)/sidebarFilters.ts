import { writable } from 'svelte/store';

export const sidebarFilters = [
	{ label: 'Всички видеа', value: 'all', description: 'Пълната библиотека.' },
	{ label: 'Последните 7 дни', value: 'week', description: 'Най-новото съдържание.' },
	{ label: 'Този месец', value: 'month', description: 'Подбрани акценти.' }
] as const;

export type SidebarFilter = (typeof sidebarFilters)[number]['value'];

export const activeFilter = writable<SidebarFilter>(sidebarFilters[0].value);

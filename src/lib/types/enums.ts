// When changed change the enum and type in src/lib/server/db/schema/auth.ts
export enum RolesEnum {
	basic = 'basic',
	admin = 'admin'
}

export function displayRole(role: RolesEnum) {
	switch (role) {
		case RolesEnum.admin:
			return 'Администратор';
		case RolesEnum.basic:
			return 'Обикновен потребител';
	}
}

// When changed change the enum in src/lib/server/db/schema/enums.ts
export enum VideoStatusEnum {
	draft = 'draft',
	published = 'published'
}

export function displayVideoStatus(status: VideoStatusEnum) {
	switch (status) {
		case VideoStatusEnum.draft:
			return 'Чернова';
		case VideoStatusEnum.published:
			return 'Публикувано';
	}
}

export enum TimePeriod {
	Last24Hours = 'Last24Hours',
	Today = 'Today',
	Yesterday = 'Yesterday',
	Last7Days = 'Last7Days',
	ThisWeek = 'ThisWeek',
	LastWeek = 'LastWeek',
	ThisMonth = 'ThisMonth',
	LastMonth = 'LastMonth',
	Last3Months = 'Last3Months',
	Last6Months = 'Last6Months',
	Last9Months = 'Last9Months',
	ThisYear = 'ThisYear',
	LastYear = 'LastYear'
}

export function displayTimePeriod(timePeriod: TimePeriod | string) {
	switch (timePeriod) {
		case TimePeriod.Last24Hours:
			return 'Последните 24 часа';
		case TimePeriod.Today:
			return 'Днес';
		case TimePeriod.Yesterday:
			return 'Вчера';
		case TimePeriod.Last7Days:
			return 'Последните 7 дни';
		case TimePeriod.ThisWeek:
			return 'Тази седмица';
		case TimePeriod.LastWeek:
			return 'Миналата седмица';
		case TimePeriod.ThisMonth:
			return 'Този месец';
		case TimePeriod.LastMonth:
			return 'Миналият месец';
		case TimePeriod.Last3Months:
			return 'Последните 3 месеца';
		case TimePeriod.Last6Months:
			return 'Последните 6 месеца';
		case TimePeriod.Last9Months:
			return 'Последните 9 месеца';
		case TimePeriod.ThisYear:
			return 'Тази година';
		case TimePeriod.LastYear:
			return 'Миналата година';
		default:
			return timePeriod;
	}
}

export enum Months {
	January = 'January',
	February = 'February',
	March = 'March',
	April = 'April',
	May = 'May',
	June = 'June',
	July = 'July',
	August = 'August',
	September = 'September',
	October = 'October',
	November = 'November',
	December = 'December'
}

export function displayMonth(month: Months) {
	switch (month) {
		case Months.January:
			return 'Януари';
		case Months.February:
			return 'Февруари';
		case Months.March:
			return 'Март';
		case Months.April:
			return 'Април';
		case Months.May:
			return 'Май';
		case Months.June:
			return 'Юни';
		case Months.July:
			return 'Юли';
		case Months.August:
			return 'Август';
		case Months.September:
			return 'Септември';
		case Months.October:
			return 'Октомври';
		case Months.November:
			return 'Ноември';
		case Months.December:
			return 'Декември';
	}
}

export enum DaysOfWeek {
	Monday = 'Monday',
	Tuesday = 'Tuesday',
	Wednesday = 'Wednesday',
	Thursday = 'Thursday',
	Friday = 'Friday',
	Saturday = 'Saturday',
	Sunday = 'Sunday'
}

export function displayDayOfWeek(day: DaysOfWeek) {
	switch (day) {
		case DaysOfWeek.Monday:
			return 'Понеделник';
		case DaysOfWeek.Tuesday:
			return 'Вторник';
		case DaysOfWeek.Wednesday:
			return 'Сряда';
		case DaysOfWeek.Thursday:
			return 'Четвъртък';
		case DaysOfWeek.Friday:
			return 'Петък';
		case DaysOfWeek.Saturday:
			return 'Събота';
		case DaysOfWeek.Sunday:
			return 'Неделя';
	}
}

export enum DurationUnitEnum {
	hours = 'hours',
	days = 'days',
	months = 'months'
}

export function displayDuration(unit: DurationUnitEnum) {
	switch (unit) {
		case DurationUnitEnum.hours:
			return 'часа';
		case DurationUnitEnum.days:
			return 'дни';
		case DurationUnitEnum.months:
			return 'месеца';
	}
}

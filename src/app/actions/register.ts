'use server';

import { PocketbaseError } from '@/errors';
import pb from '@/pocketbase';
import { RegisterPayloadSchema, safeValidate } from '@/schemas';
import { AUTH_COOKIE, AuthCookieOptions } from '@/utils';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ActionState } from './types';

export default async function register(
	prevState: ActionState,
	formData: FormData
) {
	const value = Object.fromEntries(formData.entries());

	const [data, error] = await safeValidate(value, RegisterPayloadSchema);

	if (error) return { validationErrors: error, payload: value };

	try {
		await pb.collection('users').create(data);

		const { token, record: model } = await pb
			.collection('users')
			.authWithPassword(data.username, data.password);

		const cookie = JSON.stringify({ token, model });
		cookies().set(AUTH_COOKIE, cookie, AuthCookieOptions);

		redirect('/');
	} catch (err) {
		return {
			error: PocketbaseError.auth(err).message,
			payload: value,
		};
	}
}

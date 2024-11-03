'use client';

import { ACValue } from '@/components/autocomplete-input/types';
import Input from '@/components/input';
import MarkdownEditor from '@/components/markdown-editor/editor';
import { useToast } from '@/components/toast';
import useFormFields from '@/hooks/useFormFields';
import { Tag } from '@/schemas';
import { FormEvent, useTransition } from 'react';
import upsertPost from '../../_actions/upsertPost.action';
import SelectTags from './select-tags';

type FormUpsertPostProps = {
	data: {
		tags: Tag[];
		post?: {
			id: string;
			title: string;
			body: string;
			tags: { value: string; label: string }[];
		};
	};
};

export default function FormUpsertPost({ data }: FormUpsertPostProps) {
	const { tags, post } = data;
	const isUpdate = !!post;
	const [isPending, startTransition] = useTransition();
	const { fields, setFields, fieldsError, setFieldsError } = useFormFields({
		title: post?.title ?? '',
		body: post?.body ?? '',
		tagInput: '',
		tags: post?.tags ?? ([] as ACValue<string, true>),
	});
	const toast = useToast();

	const handleUpsertPost = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFieldsError(null);
		const payload = {
			title: fields.title,
			body: fields.body,
			tags: fields.tags.map((tag) => tag.value),
		};
		startTransition(async () => {
			const { validationError, error } = await upsertPost({
				id: post?.id,
				payload,
			});
			if (validationError) {
				setFieldsError(validationError.details);
			} else if (error) {
				toast.error(error);
			}
		});
	};

	return (
		<form
			onSubmit={handleUpsertPost}
			className="grid w-full max-w-5xl gap-8"
		>
			<Input
				placeholder="Post Title"
				id="title"
				name="title"
				value={fields.title}
				onChange={(e) =>
					setFields((prev) => ({
						...prev,
						title: e.target.value,
					}))
				}
				error={fieldsError?.title}
				className="input-lg text-4xl"
			/>
			<MarkdownEditor
				value={fields.body}
				onChange={(e) =>
					setFields((prev) => ({ ...prev, body: e.target.value }))
				}
			/>
			<SelectTags
				tags={tags}
				inputValue={fields.tagInput}
				onInputChange={(e) =>
					setFields((prev) => ({ ...prev, tagInput: e.target.value }))
				}
				value={fields.tags}
				onChange={(newValue) =>
					setFields((prev) => ({
						...prev,
						tagInput: '',
						tags: newValue,
					}))
				}
				error={fieldsError?.tags}
			/>
			<button
				type="submit"
				disabled={isPending}
				className="btn btn-primary"
			>
				{isUpdate ? 'Update' : 'Publish'}
			</button>
		</form>
	);
}
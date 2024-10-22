'use client';

import Input from '@/components/input';
import { useToast } from '@/components/toast';
import useFormFields from '@/hooks/useFormFields';
import useUpsertTag from '@/hooks/useUpsertTag';
import { Tag } from '@/schemas';
import { useTransition } from 'react';
import { twMerge } from 'tailwind-merge';
import upsertTag from '../_actions/upsertTag.action';

const DIALOG_SEARCH_PARAM = 'upsert-tag';

type UpsertTagFormProps = {
	data?: Tag;
};

export default function UpsertTagForm({ data }: UpsertTagFormProps) {
	const isUpdate = !!data;
	const { isActive, closeDialog } = useUpsertTag();
	const [isPending, startTransition] = useTransition();
	const { fields, setFields, fieldsError, setFieldsError } = useFormFields({
		name: data?.name ?? '',
	});
	const toast = useToast();

	const handleUpsertTag = async () => {
		setFieldsError(null);
		startTransition(async () => {
			const { validationError, error, success } = await upsertTag({
				id: data?.id,
				payload: fields,
			});
			if (validationError) {
				setFieldsError(validationError.details);
			} else if (error) {
				toast.error(error);
			} else if (success) {
				closeDialog();
				toast.success(isUpdate ? 'Tag updated' : 'Tag created');
			}
		});
	};

	return (
		<dialog
			id="upsert-tag-dialog"
			className={twMerge('modal', isActive && 'modal-open')}
			open={isActive}
		>
			<div className="modal-box">
				<form
					action={handleUpsertTag}
					className="grid w-full max-w-xl gap-8"
				>
					<h1 className="text-3xl font-bold">
						{isUpdate ? 'Update tag' : 'Create tag'}
					</h1>
					<Input
						id="name"
						name="name"
						label="Tag name"
						value={fields.name}
						onChange={(e) =>
							setFields((prev) => ({
								...prev,
								name: e.target.value,
							}))
						}
						error={fieldsError?.name}
					/>
					<button
						type="submit"
						disabled={isPending}
						className="btn btn-primary"
					>
						{isUpdate ? 'Update Tag' : 'Create Tag'}
					</button>
				</form>
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					closeDialog();
				}}
				method="dialog"
				className="modal-backdrop"
			>
				<button>close</button>
			</form>
		</dialog>
	);
}

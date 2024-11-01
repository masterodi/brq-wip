import getTags from '@/app/_queries/getTags.query';
import validateRequest from '@/app/_queries/validateRequest.query';
import { redirect } from 'next/navigation';
import UpsertPostForm from '../../_upsert-post-form';

export default async function CreatePost() {
	const { session } = await validateRequest();

	if (!session) {
		return redirect('/login');
	}

	const tags = await getTags();

	return (
		<div className="container mx-auto max-w-6xl p-4">
			<UpsertPostForm tags={tags} />
		</div>
	);
}

import { deletePost } from '@/app/actions/posts.actions';
import { getPosts } from '@/app/queries/posts.queries';
import { Edit, Trash } from 'lucide-react';

async function PostsTable() {
	const posts = await getPosts();
	const columns = ['id', 'title', 'slug', 'tags', 'created', 'updated'];

	return (
		<table className="table mx-auto max-w-5xl">
			<thead>
				<tr>
					{columns.map((key) => (
						<th key={key}>{key.toUpperCase()}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{posts.map((post) => (
					<tr key={post.id}>
						{columns.map((col) => (
							<td
								key={`${post.id}-${col}`}
								className="h-[120px] max-w-40 overflow-hidden text-ellipsis whitespace-nowrap break-words"
							>
								{post[col]}
							</td>
						))}
						<td>
							<button
								type="button"
								className="btn btn-ghost hover:text-info"
							>
								<Edit />
							</button>
						</td>
						<td>
							<form
								action={async () => {
									'use server';
									await deletePost(post.id);
								}}
							>
								<button
									type="submit"
									className="btn btn-ghost hover:text-error"
								>
									<Trash />
								</button>
							</form>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default function DashboardHome() {
	return (
		<div className="p-4">
			<PostsTable />
		</div>
	);
}

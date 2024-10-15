import getPostBySlug from '@/app/_queries/getPostBySlug.query';
import RichTextDisplay from '@/components/rich-text/rich-text-display';

type PostProps = {
	params: { slug: string };
};

export default async function Post(props: PostProps) {
	const post = await getPostBySlug(props.params.slug);

	if (!post) {
		return (
			<main className="mx-auto my-12 min-h-screen w-full max-w-5xl p-4">
				<h1 className="text-4xl font-bold">
					Post not found. It was either renamed or deleted.
				</h1>
			</main>
		);
	}

	return (
		<main className="mx-auto my-12 min-h-screen w-full max-w-5xl p-4">
			<header className="mb-12">
				<h1 className="mb-2 text-4xl font-bold">{post.title}</h1>
				<div className="mb-4 flex gap-2">
					{post.tags.map((tag) => (
						<div key={tag.id} className="badge badge-primary">
							{tag.name}
						</div>
					))}
				</div>
				<h6>
					{new Date(post.createdAt).toLocaleString()}, <br />
					edited: {new Date(post.updatedAt).toLocaleString()}
				</h6>
				<h6></h6>
			</header>

			<article className="prose max-w-none">
				<RichTextDisplay richText={post.body} />
			</article>

			<div className="divider" />

			<footer className="flex gap-4 rounded-md bg-base-200 p-4">
				<div className="avatar">
					<div className="mask mask-squircle h-12 w-12">
						<img
							src="https://img.daisyui.com/images/profile/demo/2@94.webp"
							alt="Avatar Tailwind CSS Component"
						/>
					</div>
				</div>
				<h4>
					Post written by{' '}
					<span className="text-primary">{post.user.username}</span>
				</h4>
			</footer>
		</main>
	);
}
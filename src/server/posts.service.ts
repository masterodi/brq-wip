import { PocketbaseError } from '@/errors';
import pb from '@/pocketbase';
import { CreatePostPayloadSchema, validate } from '@/schemas';
import {
	CreatePostPayload,
	Post,
	PostWithTags,
	PostWithTagsUser,
	PostWithUser,
} from '@/types';
import { RecordFullListOptions } from 'pocketbase';

export type ExpandOptions = { tags?: true; created_by?: true };

export type QueryOptions<E extends ExpandOptions | undefined> = {
	expand?: E;
};

type QueryResult<E extends ExpandOptions | undefined = undefined> =
	E extends { tags: true; created_by: true } ? PostWithTagsUser
	: E extends { tags: true } ? PostWithTags
	: E extends { created_by: true } ? PostWithUser
	: Post;

async function getList<E extends ExpandOptions | undefined>(
	options?: QueryOptions<E>
) {
	const queryOptions: RecordFullListOptions = {
		sort: '-created',
		expand:
			options?.expand ? Object.keys(options.expand).join(',') : undefined,
	};

	const data = await pb
		.collection<QueryResult<E>>('posts')
		.getFullList(queryOptions);

	return data;
}

async function getOne<E extends ExpandOptions | undefined>(
	id: string,
	options?: QueryOptions<E>
) {
	const queryOptions: RecordFullListOptions = {
		sort: '-created',
		expand:
			options?.expand ? Object.keys(options.expand).join(',') : undefined,
	};

	const data = await pb
		.collection<QueryResult<E>>('posts')
		.getOne(id, queryOptions);

	return data;
}

type QueryFilters<S extends string> = {
	slug: S;
};

async function getFiltered<
	S extends string,
	E extends ExpandOptions | undefined,
>(filters: QueryFilters<S>, options?: QueryOptions<E>) {
	const queryOptions: RecordFullListOptions = {
		sort: '-created',
		expand:
			options?.expand ? Object.keys(options.expand).join(',') : undefined,
	};

	const data = await pb
		.collection<QueryResult<E>>('posts')
		.getFirstListItem(`slug="${filters.slug}"`, queryOptions);
	return data;
}

async function create(payload: CreatePostPayload) {
	try {
		const data = await validate(payload, CreatePostPayloadSchema);
		const res = await pb.collection('posts').create(data);
		return { data: res };
	} catch (error) {
		throw PocketbaseError.posts(error);
	}
}

async function update(id: string, payload: CreatePostPayload) {
	try {
		const data = await validate(payload, CreatePostPayloadSchema);
		const res = await pb.collection('posts').update(id, data);
		return { data: res };
	} catch (error) {
		throw PocketbaseError.posts(error);
	}
}

async function remove(id: string) {
	const res = await pb.collection('posts').delete(id);
	return res;
}

const PostsService = {
	getList,
	getOne,
	getFiltered,
	create,
	update,
	delete: remove,
};

export default PostsService;

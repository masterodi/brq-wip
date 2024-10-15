import getToken from '@/app/(authentication)/(queries)/getToken.query';
import {
	NextFetchEvent,
	NextMiddleware,
	NextRequest,
	NextResponse,
} from 'next/server';
import { isTokenExpired } from 'pocketbase';
import { isPrivateRoute } from './routes';

export default function withAuthMiddleware(middleware: NextMiddleware) {
	return async (request: NextRequest, event: NextFetchEvent) => {
		if (isPrivateRoute(request.nextUrl.pathname)) {
			const token = await getToken();

			if (!token || isTokenExpired(token)) {
				const url = request.nextUrl.clone();
				url.pathname = '/login';
				return NextResponse.redirect(url);
			}
		}

		return middleware(request, event);
	};
}

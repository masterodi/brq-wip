import AuthService from '@/server/auth.service';
import {
	NextFetchEvent,
	NextMiddleware,
	NextRequest,
	NextResponse,
} from 'next/server';
import { isTokenExpired } from 'pocketbase';

const PRIVATE_ROUTES = [] as string[];

const isPrivateRoute = (route: string) =>
	PRIVATE_ROUTES.some((r) => route.startsWith(r));

export default function withAuthMiddleware(middleware: NextMiddleware) {
	return async (request: NextRequest, event: NextFetchEvent) => {
		if (isPrivateRoute(request.nextUrl.pathname)) {
			const token = AuthService.token();

			if (!token || isTokenExpired(token)) {
				const url = request.nextUrl.clone();
				url.pathname = '/login';
				return NextResponse.redirect(url);
			}
		}

		return middleware(request, event);
	};
}

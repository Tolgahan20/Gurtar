import { Injectable, ExecutionContext } from '@nestjs/common';
import { CacheInterceptor as BaseCacheInterceptor } from '@nestjs/cache-manager';
import { HttpAdapterHost } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Reflector } from '@nestjs/core';

@Injectable()
export class HttpCacheInterceptor extends BaseCacheInterceptor {
  private readonly excludePaths = [
    '/auth',
    '/payments',
    '/orders',
    '/packages/reserve',
    '/packages/release',
  ];

  constructor(
    protected readonly httpAdapterHost: HttpAdapterHost,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
    protected readonly reflector: Reflector,
  ) {
    super(httpAdapterHost, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    // Only cache GET requests
    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    if (!isGetRequest) {
      return undefined;
    }

    // Don't cache excluded paths
    const requestUrl = httpAdapter.getRequestUrl(request);
    if (this.excludePaths.some((path) => requestUrl.includes(path))) {
      return undefined;
    }

    // Include query params in cache key
    const queryParams = (request.query || {}) as Record<string, string>;
    const queryString = Object.keys(queryParams)
      .sort()
      .map((key) => `${key}=${queryParams[key]}`)
      .join('&');

    // Include user role in cache key for role-specific responses
    const userRole = request.user?.role || 'anonymous';

    return `${requestUrl}?${queryString}&role=${userRole}`;
  }
}

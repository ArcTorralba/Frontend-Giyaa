'use client';

import * as pagination from '@zag-js/pagination';
import { useMachine, normalizeProps } from '@zag-js/react';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useId } from 'react';
import { z } from 'zod';

interface PageChangeDetails {
  page: number;
  pageSize: number;
}

const pageNumberSchema = z.coerce.number().min(1).catch(1);
const totalItemsSchema = z.coerce.number().catch(0);

export function Pagination({
  id = 'table-pagination',
  currentPage,
  pageSize = 10,
  totalItems,
  onChange: onChangeHandler,
}: {
  id?: string;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  onChange?: (arg: PageChangeDetails) => void;
}) {
  const searchParams = useSearchParams();

  let currentParams = '';

  searchParams.forEach((value, key) => {
    if (key !== 'page') {
      currentParams += `&${key}=${value}`;
    }
  });

  const isControlled = currentPage !== undefined;
  const initialCount = totalItemsSchema.parse(totalItems);

  const context: pagination.Context = {
    id: useId(),
    count: initialCount,
    page:
      currentPage === undefined
        ? pageNumberSchema.parse(searchParams.get('page'))
        : currentPage,
    pageSize,
    onPageChange(details) {
      if (onChangeHandler) {
        onChangeHandler(details);
      }
    },
  };

  const [state, send] = useMachine(pagination.machine(context), { context });
  const api = pagination.connect(state, send, normalizeProps);

  if (api.pages.length <= 1) {
    const count = totalItemsSchema.parse(totalItems);
    if (totalItems === undefined) {
      return null;
    }
    return (
      <div>
        <p className="font-prompt text-sm text-gray-400">
          Showing all <span className="font-medium">{count}</span> item/s
        </p>
      </div>
    );
  }

  return (
    <nav {...api.rootProps}>
      <ul className="inline-flex items-center space-x-2">
        <li>
          <Link
            {...api.prevTriggerProps}
            href={
              isControlled
                ? { hash: '#previous' }
                : {
                    search: `?page=${
                      api.isFirstPage ? 1 : api.previousPage
                    }${currentParams}`,
                  }
            }
            title="Previous Page"
            className="relative text-sm text-gray-400 hover:text-gray-600"
          >
            Previous <span className="sr-only">Page</span>
          </Link>
        </li>
        {api.pages.map((page, i) => {
          if (page.type === 'page')
            return (
              <li key={page.value}>
                <Link
                  {...api.getItemProps(page)}
                  href={
                    isControlled
                      ? { hash: `#${page.value}` }
                      : {
                          search: `?page=${page.value}${currentParams}`,
                        }
                  }
                  className={clsx(
                    'relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-sm hover:border-primary hover:bg-primary hover:text-white focus:z-20',
                    {
                      'z-10 text-white bg-primary': api.page === page.value,
                    },
                  )}
                >
                  {page.value}
                </Link>
              </li>
            );
          else
            return (
              <li key={`ellipsis-${i}`}>
                <span {...api.getEllipsisProps({ index: i })}>&#8230;</span>
              </li>
            );
        })}
        <li>
          <Link
            {...api.nextTriggerProps}
            href={
              isControlled
                ? { hash: '#next' }
                : {
                    search: `?page=${
                      api.isLastPage ? api.totalPages : api.nextPage
                    }${currentParams}`,
                  }
            }
            title="Next Page"
            className="relative text-sm text-gray-400 hover:text-gray-600"
          >
            Next <span className="sr-only">Page</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

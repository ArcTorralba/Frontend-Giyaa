import React, { forwardRef } from 'react';

import { format } from 'date-fns';
import {
  DateRange,
  DayPicker,
  DayPickerProps,
  CaptionProps as BaseCaptionProps,
  CaptionLabelProps,
  MonthChangeEventHandler,
  useDayPicker,
  useNavigation,
  ClassNames,
} from 'react-day-picker';
import add from 'date-fns/add';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const defaultStyles: ClassNames = {
  head_cell:
    'text-primary text-base font-semibold align-middle uppercase text-center h-[var(--rdp-cell-size)] p-0',
  day_selected:
    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
  day_today: 'bg-accent text-accent-foreground',
  day_outside: 'text-muted-foreground opacity-50',
  day_disabled: 'text-muted-foreground opacity-50',
};

export const formatRange = (range: DateRange) => {
  if (!range?.from || !range.to) {
    return;
  }
  const fromMonth = range.from?.getMonth();
  const toMonth = range.to?.getMonth();
  if (fromMonth === toMonth) {
    return `${format(range.from, 'MMMM dd')}-${format(range.to, 'dd, yyyy')}`;
  } else {
    return `${format(range.from, 'MMMM dd')}-${format(
      range.to,
      'MMMM dd, yyyy',
    )}`;
  }
};
export default function DatePicker(props: DayPickerProps) {
  return (
    <DayPicker
      classNames={{}}
      {...props}
      components={{
        Caption: DefaultCaption,
        ...props.components,
      }}
      showOutsideDays
      formatters={{
        formatWeekdayName: (day) => format(day, 'eee')[0],
      }}
    />
  );
}

type CaptionPropsRender = {
  displayMonth: Date;
  locale: Locale;
  handleNavigateNext: () => void;
  handleNavigatePrevious: () => void;
};
type CaptionProps = BaseCaptionProps & {
  children?: ((props: CaptionPropsRender) => React.ReactNode) | React.ReactNode;
};

export const Caption = forwardRef<HTMLDivElement, CaptionProps>(
  function Caption(props, ref) {
    const { displayMonth, children, ...componentProps } = props;

    const context = useDayPicker();
    const { onMonthChange, locale } = context;

    const { goToMonth } = useNavigation();

    const handlePreviousClick = () => {
      handleMonthChange(add(displayMonth, { months: -1 }));
    };

    const handleNextClick = () => {
      handleMonthChange(add(displayMonth, { months: 1 }));
    };

    const handleMonthChange: MonthChangeEventHandler = (newMonth) => {
      goToMonth(newMonth);
      onMonthChange?.(newMonth);
    };

    if (typeof children === 'function') {
      return (
        <div {...componentProps} className="flex items-center">
          {children({
            displayMonth,
            locale,
            handleNavigateNext: handleNextClick,
            handleNavigatePrevious: handlePreviousClick,
          })}
        </div>
      );
    }
    return <>{children}</>;
  },
);

function DefaultCaption(props: CaptionLabelProps): JSX.Element {
  return (
    <Caption {...props}>
      {({
        displayMonth,
        handleNavigateNext,
        handleNavigatePrevious,
        locale,
      }) => (
        <nav
          aria-live="polite"
          className="flex items-center gap-4 justify-between"
        >
          <button
            type="button"
            title="Show to Previous month"
            className="rounded focus:outline-none focus:ring-1 focus:ring-primary"
            onClick={handleNavigatePrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h2
            id={props.id}
            className="text-lg w-28 text-center font-medium text-black"
          >
            {format(props.displayMonth, 'LLLL', { locale })}
          </h2>
          <button
            className="rounded focus:outline-none focus:ring-1 focus:ring-primary"
            type="button"
            title="Show to Next month"
            onClick={handleNavigateNext}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </nav>
      )}
    </Caption>
  );
}

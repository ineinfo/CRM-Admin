import { useMemo } from 'react';
import merge from 'lodash/merge';

import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

// ----------------------------------------------------------------------

export default function useEvent(events, selectEventId, selectedRange, openForm) {
  const currentEvent = events?.find((event) => String(event.id) === String(selectEventId));


  const defaultValues = useMemo(
    () => ({
      id: '',
      title: '',
      description: '',
      color: '',
      allDay: false,
      start: selectedRange ? selectedRange.start : new Date().getTime(),
      end: selectedRange ? selectedRange.end : new Date().getTime(),
    }),
    [selectedRange]
  );

  if (!openForm) {
    return undefined;
  }

  if (currentEvent || selectedRange) {
    return merge({}, defaultValues, currentEvent);
  }

  console.log("CurrentValues2", defaultValues);


  return defaultValues;
}

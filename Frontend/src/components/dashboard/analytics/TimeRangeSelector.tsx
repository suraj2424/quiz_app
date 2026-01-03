import { useState } from 'react';

interface TimeRangeSelectorProps {
  selectedTimeRange: string;
  onTimeRangeChange: (value: string) => void;
}

const timeRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' },
  { value: 'all', label: 'All time' }
];

export function TimeRangeSelector({ selectedTimeRange, onTimeRangeChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="timeRange" className="text-sm font-medium text-gray-700">
        Time Range:
      </label>
      <select
        id="timeRange"
        value={selectedTimeRange}
        onChange={(e) => onTimeRangeChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
      >
        {timeRanges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  );
}

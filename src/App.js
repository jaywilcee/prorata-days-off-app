import React, { useState, useEffect } from 'react';
import { getDaysInMonth, differenceInCalendarDays, parseISO, lastDayOfMonth } from 'date-fns';

export default function ProrataDaysOffCalculator() {
  const currentYear = new Date().getFullYear();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [year, setYear] = useState(localStorage.getItem('year') || currentYear);
  const [month, setMonth] = useState(localStorage.getItem('month') || 'January');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState(localStorage.getItem('daysPerWeek') || '6');
  const [daysWorked, setDaysWorked] = useState(null);
  const [result, setResult] = useState(null);
  const [formula, setFormula] = useState('');

  useEffect(() => {
    localStorage.setItem('year', year);
    localStorage.setItem('month', month);
    localStorage.setItem('daysPerWeek', daysPerWeek);
  }, [year, month, daysPerWeek]);

  useEffect(() => {
    const monthIndex = monthNames.indexOf(month);
    setStartDate(`${year}-${String(monthIndex + 1).padStart(2, '0')}-01`);
    setEndDate(`${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(getDaysInMonth(new Date(year, monthIndex))).padStart(2, '0')}`);
  }, [year, month]);

  const calculateDaysOff = (type) => {
    const monthIndex = monthNames.indexOf(month);
    const daysInMonth = getDaysInMonth(new Date(year, monthIndex));
    let calculatedDaysWorked;

    if (type === 'join') {
      const joinDate = startDate ? parseISO(startDate) : new Date(year, monthIndex, 1);
      calculatedDaysWorked = differenceInCalendarDays(lastDayOfMonth(joinDate), joinDate) + 1;
    } else {
      const termDate = endDate ? parseISO(endDate) : new Date(year, monthIndex, daysInMonth);
      calculatedDaysWorked = differenceInCalendarDays(termDate, new Date(year, monthIndex, 1)) + 1;
    }

    setDaysWorked(calculatedDaysWorked);
    const prorataDaysOff = ((calculatedDaysWorked / daysInMonth) * daysPerWeek).toFixed(2);
    setResult(prorataDaysOff);
    setFormula(`(${calculatedDaysWorked} / ${daysInMonth}) * ${daysPerWeek}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Prorata Days Off Calculator</h1>

        <label className="block">
          Year:
          <input
            type="number"
            className="mt-1 w-full p-2 border rounded-md"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>

        <label className="block">
          Month:
          <select
            className="mt-1 w-full p-2 border rounded-md"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {monthNames.map((monthName) => (
              <option key={monthName} value={monthName}>{monthName}</option>
            ))}
          </select>
        </label>

        <label className="block">
          Working Days per Week:
          <input
            type="number"
            min="1"
            max="7"
            className="mt-1 w-full p-2 border rounded-md"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(e.target.value)}
          />
        </label>

        <label className="block">
          Start Date (for New Joins):
          <input
            type="date"
            className="mt-1 w-full p-2 border rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded-xl"
          onClick={() => calculateDaysOff('join')}
        >
          Calculate for New Joiner
        </button>

        <label className="block">
          End Date (for Terminations):
          <input
            type="date"
            className="mt-1 w-full p-2 border rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <button
          className="w-full bg-red-500 text-white py-2 rounded-xl"
          onClick={() => calculateDaysOff('terminate')}
        >
          Calculate for Termination
        </button>

        {daysWorked !== null && (
          <div className="mt-4 p-4 bg-blue-100 rounded-xl text-center">
            <strong>Days Worked:</strong> {daysWorked} days
          </div>
        )}

        {result !== null && (
          <div className="mt-4 p-4 bg-green-100 rounded-xl text-center">
            <strong>Prorata Days Off:</strong> {result} days
            <div className="text-sm text-gray-700 mt-2">Formula: {formula}</div>
          </div>
        )}
      </div>
    </div>
  );
}

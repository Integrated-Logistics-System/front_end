// date-fns와 react-day-picker 사이의 호환성 문제를 해결하기 위한 유틸리티 함수들
// date-fns v4와 v3/v2 사이의 호환성 레이어 제공

import { format, parseISO, compareAsc } from 'date-fns';

/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 변환
 */
export function formatDate(date: Date | null): string {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
}

/**
 * 문자열을 Date 객체로 파싱
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  return parseISO(dateString);
}

/**
 * 두 날짜가 같은 날짜인지 확인
 */
export function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return compareAsc(date1, date2) === 0;
}

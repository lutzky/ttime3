import {Course} from './common';

/**
 * Gets nicknames or abbreviations for a course
 */
export default function getNicknames(course: Course): string {
  const result = [];

  if (course.name.includes('חשבון דיפרנציאלי ואינטגרלי')) {
    result.push('חדוא', 'חדו"א');
  }
  if (course.name.includes('מדעי המחשב')) {
    result.push('מדמח', 'מדמ"ח');
  }
  if (course.name.includes('פיסיקה')) {
    result.push('פיזיקה');
  }
  if (course.name.includes('אנליזה נומרית')) {
    result.push('נומריזה');
  }

  result.push(course.faculty.name);

  if (course.lecturerInCharge !== '') {
    result.push(course.lecturerInCharge);
  }

  if (course.groups) {
    for (const group of course.groups) {
      result.push(...group.teachers);
    }
  }

  return result.join(' ');
}

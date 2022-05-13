/**
 * Shamelessly stolen from: https://stackoverflow.com/questions/20070158/string-format-not-work-in-typescript. Apparently, TS/JS doesn't have native support for a 'String.Format()' function
 * @param str
 * @param val
 * @returns
 */
export function FormatString(str: string, ...val: string[]) {
  for (let index = 0; index < val.length; index++) {
    str = str.replace(`{${index}}`, val[index]);
  }
  return str;
}

export const nanToZero = (input: number) => (isNaN(input) ? 0 : input);

export function isEmpty(value) {
  return (
    typeof value === 'undefined' ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    value === false ||
    (Array.isArray(value) && value.length === 0)
  );
}

export function isNumber(value) {
  if (isEmpty(value)) return true;

  if ((typeof value === 'boolean' && value === true) || (Array.isArray(value) && value.length !== 0)) {
    return false;
  }

  value = Number(value);

  return typeof value === 'number' && !isNaN(value);
}

const EMAIL_REGEXP =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

export function isEmail(value) {
  if (isEmpty(value)) return true;

  return EMAIL_REGEXP.test(value);
}

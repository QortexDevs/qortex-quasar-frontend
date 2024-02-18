export const NOT_EMPTY = val => ![null, undefined].includes(val) || '* заполните поле'
export const NOT_EMPTY_STRING = val => (val ?? '') !== '' || '* заполните поле'
export const NOT_EMPTY_ARRAY = val => (val ?? []).length !== 0 || '* заполните поле'

// -- RFC 5322 --
// This is a basic helper validation.
const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const IS_EMAIL = val => !val || emailRegexp.test(val) || '* неверный формат почты'

const phoneRegexp = /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/
export const IS_PHONE = val => !val || phoneRegexp.test(val) || '* неверный формат номера'

// date format, parse & validate
export const VALID_DATE = val => !val || !isNaN(val.valueOf()) || '* неверный формат даты'

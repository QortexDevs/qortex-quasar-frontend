import { union, isEqual } from 'lodash'
import { Notify, Dialog, copyToClipboard, date } from 'quasar'
import { ref, toRaw } from 'vue'

export function delay (delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay)
  })
}

export function oneTwoMany (val, [one, two, many]) {
  let count = val % 100
  if (count >= 5 && count <= 20) {
    return many
  } else {
    count = count % 10
    if (count === 1) {
      return one
    } else if (count <= 4 && count > 1) {
      return two
    } else {
      return many
    }
  }
}

export function readFileToDataUrl (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', function () {
      resolve(reader.result)
    }, false)

    if (file) {
      reader.readAsDataURL(file)
    } else {
      resolve('')
    }
  })
}

export async function copy (text) {
  try {
    copyToClipboard(text)
    Notify.create({ type: 'positive', message: 'Copied successfully' })
  } catch (error) {
    notifyError(error)
  }
}

export function notifyError (error) {
  const message = typeof error === 'string' ? error : (error.isAxiosError && error.response?.data?.message) ||
    error.message ||
    'Error'

  Notify.create({ type: 'negative', message })
  console.error(error)
}

/**
 *
 * @param {*} fn
 * @param {{?loading: Ref, ?onCatch: {function}, ?onFinally: function}} options
 */
export async function processWithNotify (fn, options = {}) {
  const { loading = ref(), onCatch = () => {}, onFinally = () => {}, errorMessage = e => e } = options
  try {
    loading.value = true
    await fn()
  } catch (error) {
    notifyError(typeof errorMessage === 'string' ? errorMessage : errorMessage(error))
    await onCatch(error)
  } finally {
    await onFinally()
    loading.value = false
  }
}

const CONFIRM_DIALOG_DEFAULT_OPTIONS = {
  title: 'Подтвердите действие',
  ok: { label: 'Подтвердить' },
  cancel: { label: 'Отмена', flat: true }
}

export async function confirmDialog (messageOrOptions = {}, { ok = true, cancel = false, dismiss = false } = {}) {
  const options = typeof messageOrOptions === 'string'
    ? { ...CONFIRM_DIALOG_DEFAULT_OPTIONS, message: messageOrOptions }
    : { ...CONFIRM_DIALOG_DEFAULT_OPTIONS, ...messageOrOptions }
  return new Promise(resolve => {
    Dialog.create(options)
      .onOk(() => resolve(ok))
      .onCancel(() => resolve(cancel))
      .onDismiss(() => resolve(dismiss))
  })
}

const NOTIFY_DIALOG_DEFAULT_OPTIONS = {
  title: 'Уведомление',
  ok: { label: 'Подтвердить' }
}

export function notifyDialog (messageOrOptions = {}) {
  const options = typeof messageOrOptions === 'string'
    ? { ...NOTIFY_DIALOG_DEFAULT_OPTIONS, message: messageOrOptions }
    : { ...NOTIFY_DIALOG_DEFAULT_OPTIONS, ...messageOrOptions }
  Dialog.create(options)
}

export function moreLess (val1, val2) {
  return val1 === val2 ? 0
    : val1 === undefined ? -1
      : val2 === undefined ? 1
        : val1 > val2 ? 1 : -1
}

export const sortDates = (a = undefined, b = undefined) => {
  const timestampA = (new Date(a)).valueOf() ?? 0
  const timestampB = (new Date(b)).valueOf() ?? 0

  return timestampA - timestampB
}

const locale = 'ru'

const priceFormatters = {}
function getPriceFormatter (currency, cents = false) {
  if (priceFormatters[currency] === undefined) {
    priceFormatters[currency] = {
      priceFormatter: new Intl.NumberFormat(locale, { currency: currency ?? 'RUB', maximumFractionDigits: 0, style: 'currency' }),
      priceFormatterWithCents: new Intl.NumberFormat(locale, { currency: currency ?? 'RUB', maximumFractionDigits: 2, style: 'currency' })
    }
  }

  return priceFormatters[currency][cents ? 'priceFormatterWithCents' : 'priceFormatter']
}

export function formatPrice (value, currency = 'RUB', cents = false) {
  return getPriceFormatter(currency, cents).format(value)
}

const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'short' })
export function formatDate (value) {
  return value && dateFormatter.format(value)
}

const timeFormatter = new Intl.DateTimeFormat(locale, { timeStyle: 'short' })
export function formatTime (value) {
  return timeFormatter.format(value)
}

const dateTimeFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' })
export function formatDateTime (value) {
  return dateTimeFormatter.format(value)
}

export function passedDaysString (fromDate) {
  const now = Date.now()
  const diff = date.getDateDiff(now, fromDate, 'days') + 1
  return `${diff} ${oneTwoMany(diff, ['день', 'дня', 'дней'])}`
}

/**
 *
 * @param {Object} data1
 * @param {Object} data2
 * @param {requiredKeys = [], ignoredKeys = [], debug = false, keys = ('all'|'first'|'second')} options
 * @returns {Object}
 */
export function objectDifference (data1, data2, { requiredKeys = [], ignoredKeys = [], debug = false, keys = 'first' } = {}) {
  data1 = toRaw(data1)
  data2 = toRaw(data2)
  const keyList = keys === 'all'
    ? union(Object.keys(data1), Object.keys(data2))
    : keys === 'first'
      ? Object.keys(data1)
      : keys === 'second'
        ? Object.keys(data2)
        : undefined
  if (keyList === undefined) { throw new Error('wrong params') }

  return Object.fromEntries(keyList
    .filter(key => !ignoredKeys.includes(key))
    .filter(key => {
      const res = !isEqual(data1[key], data2[key]) || requiredKeys.includes(key)
      if (debug) {
        console.log(data1, data2, key, !isEqual(data1[key], data2[key]))
      }
      return res
    })
    .map(key => [key, data1[key]])
  )
}

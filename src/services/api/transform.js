export const dateTransformer = Object.freeze({
  serialize: val => val ? val.toISOString().substring(0, 10) : undefined, parse: val => val ? new Date(val) : null
})
export const dateTimeTransformer = Object.freeze({
  serialize: val => val ? val.toISOString() : val, parse: val => val ? new Date(val) : null
})

const regexPhoneSerialize = /\D/g
const regexPhoneParse = /(\d)(\d{3})(\d{3})(\d{2})(\d{2})/g
export const phoneTransformer = Object.freeze({
  serialize: val => val ? val.replaceAll(regexPhoneSerialize, '') : val,
  parse: val => val ? val.replace(regexPhoneParse, '+$1 ($2) $3-$4-$5') : null
})

export function objectTransformer (rules, options) {
  return { serialize: val => applyRules(val, rules, 'server', options), parse: val => applyRules(val, rules, 'client', options) }
}

export function arrayTransformer (rules, options) {
  return { serialize: val => Array.isArray(val) ? Promise.all(val.map(i => applyRules(i, rules, 'server', options))) : val, parse: val => Array.isArray(val) ? Promise.all(val.map(i => applyRules(i, rules, 'client', options))) : val }
}

/**
 * @param {Object} input Object
 * @param {Array} rules Array
 * @param {('client'|'server')} direction Array
 * @param {Boolean} generateFromNull=false - generate blank object on null input
 */
export async function applyRules (input, rules, direction, { generateFromNull = false, generateFromUndefined = false, generateFields = true, debug = false } = {}) {
  if (input === null) {
    return !generateFromNull ? input
      : direction === 'client' ? blankObjectFromRules(rules) : applyRules(blankObjectFromRules(rules), rules, direction)
  }
  if (input === undefined) {
    return !generateFromUndefined ? input
      : direction === 'client' ? blankObjectFromRules(rules) : applyRules(blankObjectFromRules(rules), rules, direction)
  }
  const result = {}
  const fieldsToDelete = []
  await Promise.all(rules.map(async element => {
    const func = element[direction === 'client' ? 'parse' : 'serialize']
    // if (func instanceof String) { func = context[func] }
    const inField = element.field ?? (direction === 'client' ? element.server : element.client)
    const outField = element.field ?? (direction === 'client' ? element.client : element.server)
    if (inField && inField !== outField) { fieldsToDelete.push(inField) }
    const value = inField && input[inField] !== undefined
      ? input[inField]
      : generateFields || !inField ? (
        element.defaults?.[direction]
          ? (element.defaults?.[direction] instanceof Function
              ? await element.defaults?.[direction](input)
              : element.defaults?.[direction])
          : (element.default instanceof Function
              ? await element.default(input)
              : element.default)
      ) : undefined
    if (debug || element.debug) {
      console.log({ direction, inField, outField, input, 'input[inField]': input[inField], defaults: element.defaults, value, func })
    }
    try {
      if (outField) {
        result[outField] = func instanceof Function ? await func(value, input) : value
      }
    } catch (error) {
      console.debug('ошибка преобразования', inField, outField, input[inField], value)
      throw error
    }
    if (debug || element.debug) {
      console.log({ direction, inField, outField, input, 'input[inField]': input[inField], 'result[outField]': result[outField], defaults: element.defaults })
    }
    return Promise.resolve(true)
  }))

  const addition = Object.fromEntries(Object.entries(input).filter(([key]) => !fieldsToDelete.includes(key)))
  return { ...addition, ...result }
}

export function blankObjectFromRules (rules) {
  const result = {}
  rules.forEach(rule => {
    result[rule.client] = typeof rule.default === 'function' ? rule.default() : rule.default
  })
  return result
}

export const CREATED_UPDATED_RULES = [
  { client: 'created_at', server: 'created_at', ...dateTimeTransformer },
  { client: 'updated_at', server: 'updated_at', ...dateTimeTransformer }
]

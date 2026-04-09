import { ref, watch, type Ref } from "vue"

export interface UseBaseInputNumberOptions {
  modelValue: Ref<number>

  min: Ref<number | undefined>

  max: Ref<number | undefined>

  step: Ref<number>

  disabled: Ref<boolean>

  readonly: Ref<boolean>

  snapOnBlur: Ref<boolean>

  useGrouping: Ref<boolean>

  onCommit: (value: number) => void

  onBlur?: (event: FocusEvent) => void

  onFocus?: (event: FocusEvent) => void
}

export function extractDigits(raw: string): string {
  return raw.replace(/\D/g, "")
}

function clampBigInt(value: bigint, min?: number, max?: number): bigint {
  let v = value

  if (min !== undefined) {
    const bmin = BigInt(min)

    if (v < bmin) {
      v = bmin
    }
  }

  if (max !== undefined) {
    const bmax = BigInt(max)

    if (v > bmax) {
      v = bmax
    }
  }

  return v
}

function snapToIntStepBigInt(
  value: bigint,
  step: number,
  min?: number,
): bigint {
  const s = BigInt(Math.max(1, Math.round(step)))

  if (s === 1n) {
    return value
  }

  const base = BigInt(min ?? 0)

  const rel = value - base

  if (rel < 0n) {
    return base
  }

  const half = s / 2n

  const q = (rel + half) / s

  return base + q * s
}

/** Только цифры; слева направо группы по 3 символа от младших разрядов: «1442» → «1 442» */

export function formatDigitGroups(digitStr: string): string {
  if (digitStr === "") {
    return ""
  }

  let result = ""

  for (let i = digitStr.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3)

    const chunk = digitStr.slice(start, i)

    result = chunk + (result ? ` ${result}` : "")
  }

  return result
}

function countDigitsBeforeIndex(s: string, index: number): number {
  let n = 0

  const end = Math.min(index, s.length)

  for (let i = 0; i < end; i++) {
    if (/\d/.test(s.charAt(i))) {
      n += 1
    }
  }

  return n
}

function caretAfterDigitCount(formatted: string, digitCount: number): number {
  if (digitCount <= 0) {
    return 0
  }

  let seen = 0

  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted.charAt(i))) {
      seen += 1

      if (seen === digitCount) {
        return i + 1
      }
    }
  }

  return formatted.length
}

function modelToDigitString(value: number): string {
  if (!Number.isFinite(value)) {
    return ""
  }

  return String(Math.trunc(value))
}

function digitsToCommittedValue(
  digits: string,

  min: number | undefined,

  max: number | undefined,
): number {
  if (digits === "") {
    return 0
  }

  let v = BigInt(digits)

  v = clampBigInt(v, min, max)

  return Number(v)
}

function applyMinMaxToDigits(
  digits: string,
  min: number | undefined,
  max: number | undefined,
): string {
  if (digits === "") {
    return ""
  }

  let v = BigInt(digits)

  v = clampBigInt(v, min, max)

  return v.toString()
}

export function useBaseInputNumber(options: UseBaseInputNumberOptions) {
  const {
    modelValue,

    min,

    max,

    step,

    disabled,

    readonly,

    snapOnBlur,

    useGrouping,

    onCommit,

    onBlur,

    onFocus,
  } = options

  const draft = ref("")

  const isFocused = ref(false)

  function displayFromDigits(digits: string): string {
    if (digits === "") {
      return ""
    }

    return useGrouping.value ? formatDigitGroups(digits) : digits
  }

  function formatDraftFromModel(value: number): string {
    const digits = modelToDigitString(value)

    if (digits === "") {
      return ""
    }

    return displayFromDigits(digits)
  }

  watch(
    modelValue,

    (v) => {
      if (isFocused.value) {
        return
      }

      draft.value = formatDraftFromModel(v)
    },

    { immediate: true },
  )

  /**
   * Обрабатывает ввод: только цифры, группировка, clamp min/max.
   * @returns позиция курсора после форматирования
   */

  function onInput(event: Event): number {
    const el = event.target as HTMLInputElement

    if (readonly.value || disabled.value) {
      return el.selectionStart ?? 0
    }

    const selectionStart = el.selectionStart ?? 0

    const digitsBeforeCaret = countDigitsBeforeIndex(el.value, selectionStart)

    let digits = extractDigits(el.value)

    digits = applyMinMaxToDigits(digits, min.value, max.value)

    const formatted = displayFromDigits(digits)

    draft.value = formatted

    const committed = digitsToCommittedValue(digits, min.value, max.value)

    onCommit(committed)

    const totalDigits = extractDigits(formatted).length

    const targetCount = Math.min(digitsBeforeCaret, totalDigits)

    return caretAfterDigitCount(formatted, targetCount)
  }

  function onFieldBlurInternal(event: FocusEvent): void {
    isFocused.value = false

    if (disabled.value) {
      onBlur?.(event)

      return
    }

    const digits = extractDigits(draft.value)

    if (digits === "") {
      onCommit(0)

      draft.value = displayFromDigits("0")

      onBlur?.(event)

      return
    }

    let v = BigInt(digits)

    v = clampBigInt(v, min.value, max.value)

    if (snapOnBlur.value) {
      v = snapToIntStepBigInt(v, step.value, min.value)
    }

    onCommit(Number(v))

    draft.value = displayFromDigits(v.toString())

    onBlur?.(event)
  }

  function onFieldFocusInternal(event: FocusEvent): void {
    if (disabled.value) {
      return
    }

    isFocused.value = true

    draft.value = displayFromDigits(modelToDigitString(modelValue.value))

    onFocus?.(event)
  }

  return {
    draft,

    isFocused,

    onInput,

    onFieldBlur: onFieldBlurInternal,

    onFieldFocus: onFieldFocusInternal,
  }
}

<template>
  <div class="base-input-number-root">
    <span class="base-input-number__ruler" aria-hidden="true">{{ rulerText }}</span>
    <input
      :id="fieldId"
      ref="inputRef"
      :value="draft"
      type="text"
      size="1"
      inputmode="numeric"
      pattern="[0-9 ]*"
      class="base-input-number"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      autocomplete="off"
      @input="handleInput"
      @keydown="onKeydown"
      @blur="onFieldBlur"
      @focus="onFieldFocus"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, toRefs, useId } from 'vue'

import type { BaseInputNumberProps } from './base-input-number.types'
import { useBaseInputNumber } from './use-base-input-number'

const props = withDefaults(defineProps<BaseInputNumberProps>(), {
  step: 1,
  snapOnBlur: true,
  useGrouping: true,
  disabled: false,
  readonly: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const { modelValue, min, max, step, disabled, readonly, snapOnBlur, useGrouping } = toRefs(props)

const uid = useId()
const fieldId = computed(() => props.id ?? `${uid}-input`)
const inputRef = ref<HTMLInputElement | null>(null)

const { draft, onInput, onFieldBlur, onFieldFocus } = useBaseInputNumber({
  modelValue,
  min,
  max,
  step,
  disabled,
  readonly,
  snapOnBlur,
  useGrouping,
  onCommit: (value) => emit('update:modelValue', value),
  onBlur: (event) => emit('blur', event),
  onFocus: (event) => emit('focus', event),
})

const rulerText = computed(() => (draft.value !== '' ? draft.value : '\u200b'))

function handleInput(event: Event): void {
  const cursor = onInput(event)
  nextTick(() => {
    const el = inputRef.value
    if (el && document.activeElement === el) {
      el.setSelectionRange(cursor, cursor)
    }
  })
}

function onKeydown(event: KeyboardEvent): void {
  if (props.disabled || props.readonly) {
    return
  }
  if (event.metaKey || event.ctrlKey || event.altKey) {
    return
  }
  const allowedControl = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ]
  if (allowedControl.includes(event.key)) {
    return
  }
  if (event.key.length === 1 && !/\d/.test(event.key)) {
    event.preventDefault()
  }
}
</script>

<style scoped lang="scss">
@use '@/scss/variables' as *;
@use '@/scss/mixins/media' as *;

.base-input-number-root {
  display: inline-grid;
  min-width: $input-min-width;
  max-width: 100%;
  vertical-align: middle;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: $radius-input;
}

.base-input-number__ruler,
.base-input-number {
  grid-area: 1 / 1;
}

.base-input-number__ruler {
  min-width: $input-min-width;
  box-sizing: border-box;
  padding: $padding-input-vertical $padding-input-horizontal-right $padding-input-vertical
    $padding-input-horizontal-left;
  border: 1px solid transparent;
  border-radius: $radius-input;
  font-family: $font-family-input;
  font-size: $font-size-input-mobile;
  font-weight: $font-weight-medium;
  font-style: normal;
  line-height: $line-height-input;
  letter-spacing: $letter-spacing-input;
  white-space: pre;
  visibility: hidden;
  pointer-events: none;
  user-select: none;

  @include media-min-md {
    font-size: $font-size-input-desktop;
  }
}

.base-input-number {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: $control-height-mobile;
  min-height: $control-height-mobile;
  margin: 0;
  padding: $padding-input-vertical $padding-input-horizontal-right $padding-input-vertical
    $padding-input-horizontal-left;
  border: 1px solid $color-input-default-border;
  border-radius: $radius-input;
  appearance: none;
  -webkit-appearance: none;
  background-color: $color-surface;
  font-family: $font-family-input;
  font-size: $font-size-input-mobile;
  font-weight: $font-weight-medium;
  font-style: normal;
  line-height: $line-height-input;
  letter-spacing: $letter-spacing-input;
  color: $color-input-idle-value-text;
  text-align: left;
  outline: none;
  caret-color: $color-input-caret;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;

  @include media-min-md {
    height: $control-height-desktop;
    min-height: $control-height-desktop;
    font-size: $font-size-input-desktop;
  }

  &::placeholder {
    color: $color-input-idle-placeholder;
  }

  &:hover:not(:disabled):not(:focus-visible) {
    border: 1px solid $color-input-hover-border;
  }

  &:focus-visible {
    border-color: $color-input-active-border;
    color: $color-input-active-text;
    box-shadow: 0 0 0 2px $color-focus-ring;
  }

  &:read-only:not(:disabled) {
    cursor: default;
  }

  &:disabled {
    border-color: $color-input-default-border;
    background-color: $color-input-disabled-background;
    color: $color-input-disabled-text;
    cursor: not-allowed;
  }
}
</style>

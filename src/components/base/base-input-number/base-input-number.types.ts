export interface BaseInputNumberProps {
  modelValue: number

  id?: string

  name?: string

  placeholder?: string

  min?: number

  max?: number

  step?: number

  disabled?: boolean

  readonly?: boolean

  snapOnBlur?: boolean

  /** Группы по 3 цифры, разделитель — пробел (например «1 442») */

  useGrouping?: boolean
}

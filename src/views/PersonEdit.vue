<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/store'
import BaseInputNumber from '@/components/base/base-input-number/BaseInputNumber.vue'

const route = useRoute()

const person = computed(() => {
  const id = Number(route.params.id)
  return store.people.find((p) => p.id === id)
})

const ageInHoursModel = computed({
  get(): number {
    return person.value?.ageInHours ?? 0
  },
  set(v: number) {
    if (person.value) {
      person.value.ageInHours = v
    }
  },
})

const isHoursInputFocused = ref(false)
</script>

<template>
  <div v-if="person" class="flex flex-col gap-4">
    <router-link to="/" class="text-violet-600 hover:underline text-sm">&larr; Back</router-link>

    <div class="flex items-center gap-3">
      <div
        class="box-border flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full border border-solid"
        :class="isHoursInputFocused ? 'border-[#3D06D7]' : 'border-transparent'"
      >
        <img
          src="/img.png"
          :alt="person.name"
          class="box-content h-20 w-20 rounded-full border border-solid border-transparent object-cover"
        />
      </div>
      <div class="flex flex-col gap-3">
        <label
          for="hours-input"
          class="block font-['Koulen'] font-normal not-italic text-base leading-[15px] [letter-spacing:2%] [leading-trim:none]"
          :class="isHoursInputFocused ? 'text-[#3D06D7]' : 'text-gray-700'"
        >
          {{ person.name.toUpperCase() }} IS
        </label>
        <div class="flex items-center gap-3">
          <BaseInputNumber
            id="hours-input"
            v-model="ageInHoursModel"
            placeholder="0"
            :min="0"
            @focus="isHoursInputFocused = true"
            @blur="isHoursInputFocused = false"
          />
          <span
            class="font-['Inter'] font-normal not-italic text-[18px] leading-[100%] [letter-spacing:0%] [leading-trim:none] text-gray-600"
          >
            hours old
          </span>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p class="text-gray-600">Person not found</p>
    <router-link to="/" class="text-violet-600 hover:underline text-sm">Back to list</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
</script>

<template>
  <div v-if="person" class="flex flex-col gap-4">
    <router-link to="/" class="text-violet-600 hover:underline text-sm">&larr; Back</router-link>

    <div class="flex items-center gap-3">
      <img
        src="/img.png"
        :alt="person.name"
        class="w-14 h-14 rounded-full border-2 border-violet-500 object-cover"
      />
      <div>
        <label for="hours-input" class="block text-sm font-bold tracking-wide text-gray-700">
          {{ person.name.toUpperCase() }} IS
        </label>
        <div class="flex items-center gap-2">
          <BaseInputNumber
            id="hours-input"
            v-model="ageInHoursModel"
            placeholder="0"
            :min="0"
          />
          <span class="text-gray-600">hours old</span>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p class="text-gray-600">Person not found</p>
    <router-link to="/" class="text-violet-600 hover:underline text-sm">Back to list</router-link>
  </div>
</template>

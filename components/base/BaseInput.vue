<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string;
    modelValue?: string | number;
    type?: string;
    placeholder?: string;
    error?: string | null;
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    error: null
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const inputId = `input-${Math.random().toString(36).slice(2, 8)}`;

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="form-field">
    <label class="form-label" :for="inputId">{{ props.label }}</label>
    <input
      :id="inputId"
      class="form-input"
      :type="props.type"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input="onInput"
    />
    <p v-if="props.error" class="form-error">{{ props.error }}</p>
  </div>
</template>

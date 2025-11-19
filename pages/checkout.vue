<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/useCartStore';

const cartStore = useCartStore();
const router = useRouter();

const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: ''
});

const errors = reactive<Record<string, string>>({});
const orderId = ref<string | null>(null);
const successMessage = ref('');

const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const tax = computed(() => cartStore.tax);
const deliveryFee = computed(() => cartStore.deliveryFee);
const grandTotal = computed(() => cartStore.grandTotal);

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const validate = () => {
  errors.name = form.name ? '' : 'Name is required';
  errors.phone = form.phone ? '' : 'Phone number is required';
  errors.address = form.address ? '' : 'Delivery address is required';
  if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
    errors.email = 'Enter a valid email';
  } else {
    errors.email = '';
  }
  return !errors.name && !errors.phone && !errors.address && !errors.email;
};

const handleSubmit = (event: Event) => {
  event.preventDefault();
  if (!items.value.length) {
    router.push('/');
    return;
  }

  if (!validate()) return;

  orderId.value = `PH-${Date.now()}`;
  successMessage.value = 'Thank you for your order at pizzaHunt!';
  cartStore.clearCart();
};
</script>

<template>
  <section>
    <header class="mb-3">
      <h1>Checkout</h1>
      <p>Almost there—confirm your details and place the order.</p>
    </header>

    <div v-if="!items.length" class="empty-state">
      <p>Your cart is empty. Add some pizzas before checking out.</p>
      <BaseButton variant="primary" @click="router.push('/')">Back to Home</BaseButton>
    </div>

    <div v-else class="checkout-grid">
      <form class="base-card" @submit="handleSubmit">
        <h3>Contact & Delivery</h3>
        <BaseInput v-model="form.name" label="Full Name" placeholder="John Doe" :error="errors.name" />
        <BaseInput v-model="form.email" label="Email" placeholder="you@example.com" type="email" :error="errors.email" />
        <BaseInput v-model="form.phone" label="Phone Number" placeholder="+62 812 3456 7890" :error="errors.phone" />

        <div class="form-field">
          <label class="form-label" for="address">Delivery Address</label>
          <textarea
            id="address"
            v-model="form.address"
            class="form-textarea"
            placeholder="Street, building, unit number"
          ></textarea>
          <p v-if="errors.address" class="form-error">{{ errors.address }}</p>
        </div>

        <div class="form-field">
          <label class="form-label" for="notes">Additional Notes (optional)</label>
          <textarea
            id="notes"
            v-model="form.notes"
            class="form-textarea"
            placeholder="Any preferences or delivery notes"
          ></textarea>
        </div>

        <BaseButton variant="primary" type="submit" fullWidth>Place Order</BaseButton>

        <div v-if="successMessage" class="success-banner">
          {{ successMessage }} Your order ID is {{ orderId }}.
        </div>
      </form>

      <aside class="summary">
        <h3>Order Summary</h3>
        <div class="order-list">
          <div v-for="item in items" :key="item.id" class="order-line">
            <span>{{ item.name }} × {{ item.quantity }}</span>
            <span>{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
        </div>
        <hr style="border: none; border-top: 1px solid rgba(0,0,0,0.08); margin: 1rem 0;" />
        <div class="summary-row muted">
          <span>Subtotal</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="summary-row muted">
          <span>Tax (10%)</span>
          <span>{{ formatPrice(tax) }}</span>
        </div>
        <div class="summary-row muted">
          <span>Delivery</span>
          <span>{{ formatPrice(deliveryFee) }}</span>
        </div>
        <div class="summary-row summary-total">
          <span>Total</span>
          <span>{{ formatPrice(grandTotal) }}</span>
        </div>
      </aside>
    </div>
  </section>
</template>

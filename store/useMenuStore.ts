import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu-store', {
  state: () => ({
    loading: false,
    searchQuery: '',
    selectedCategory: 'All',
    pizzas: [
      {
        id: 1,
        name: 'Margherita Classico',
        description: 'Fresh basil, mozzarella, and ripe tomatoes on a crisp crust.',
        category: 'Classic',
        price: 85000,
        image: 'https://images.unsplash.com/photo-1548365328-9f5475c5b1fc?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 2,
        name: 'Pepperoni Burst',
        description: 'Loaded with premium pepperoni, mozzarella, and oregano.',
        category: 'Meat Lover',
        price: 95000,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 3,
        name: 'Truffle Funghi',
        description: 'Portobello mushrooms, white sauce, and a drizzle of truffle oil.',
        category: 'Premium',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1601924582971-d77c5c9f77a3?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 4,
        name: 'Veggie Garden',
        description: 'Bell peppers, olives, sweet corn, and cherry tomatoes.',
        category: 'Vegetarian',
        price: 88000,
        image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 5,
        name: 'Spicy Calabrese',
        description: 'Spicy calabrese salami, chili flakes, and roasted garlic.',
        category: 'Spicy',
        price: 99000,
        image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=80&sat=-20'
      },
      {
        id: 6,
        name: 'Four Cheese Melt',
        description: 'Mozzarella, gorgonzola, parmesan, and provolone blend.',
        category: 'Cheese',
        price: 105000,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 7,
        name: 'BBQ Smokehouse',
        description: 'Smoky BBQ chicken, red onions, and fresh cilantro.',
        category: 'Meat Lover',
        price: 112000,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80&sat=-30'
      },
      {
        id: 8,
        name: 'Pesto Primavera',
        description: 'Basil pesto base, zucchini, cherry tomatoes, and ricotta.',
        category: 'Vegetarian',
        price: 98000,
        image: 'https://images.unsplash.com/photo-1548365328-9f5475c5b1fc?auto=format&fit=crop&w=800&q=80&sat=-25'
      }
    ]
  }),
  getters: {
    categories: (state) => ['All', ...new Set(state.pizzas.map((pizza) => pizza.category))],
    filteredItems: (state) => {
      const query = state.searchQuery.toLowerCase();
      return state.pizzas.filter((pizza) => {
        const matchesQuery =
          !query ||
          pizza.name.toLowerCase().includes(query) ||
          pizza.description.toLowerCase().includes(query);
        const matchesCategory = state.selectedCategory === 'All' || pizza.category === state.selectedCategory;
        return matchesQuery && matchesCategory;
      });
    }
  },
  actions: {
    setSearch(query: string) {
      this.searchQuery = query;
    },
    setCategory(category: string) {
      this.selectedCategory = category;
    },
    setLoading(value: boolean) {
      this.loading = value;
    }
  }
});

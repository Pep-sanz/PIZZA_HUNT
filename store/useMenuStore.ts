import { useRuntimeConfig } from '#imports';
import { defineStore } from 'pinia';

type SpoonacularRecipe = {
  id: number;
  title: string;
  summary?: string;
  image: string;
  readyInMinutes?: number;
  vegetarian?: boolean;
  veryPopular?: boolean;
  instructions?: string;
};

export type PizzaItem = {
  id: number;
  title: string;
  image: string;
  description: string;
  category: string;
  price: number;
  readyInMinutes: number;
  instructions: string;
};

const stripHtml = (value?: string) => {
  if (!value) return '';
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

const deriveCategory = (recipe: SpoonacularRecipe): string => {
  const title = recipe.title.toLowerCase();
  if (recipe.vegetarian) return 'Vegetarian';
  if (/pepperoni|sausage|meat|bacon|bbq|prosciutto|ham/.test(title)) return 'Meat Lover';
  if (/truffle|funghi|mushroom|pesto|gourmet|tartufo/.test(title)) return 'Gourmet';
  if (/cheese|margherita|classic|napo/.test(title)) return 'Classic';
  if (recipe.veryPopular) return 'Chef Special';
  return 'Signature';
};

const calculatePrice = (category: string, readyInMinutes?: number): number => {
  const categoryBase: Record<string, number> = {
    Vegetarian: 78000,
    'Meat Lover': 105000,
    Gourmet: 120000,
    Classic: 89000,
    'Chef Special': 110000,
    Signature: 95000
  };

  const base = categoryBase[category] ?? 90000;
  const prepMinutes = readyInMinutes ?? 20;
  const premium = Math.min(Math.max(prepMinutes - 10, 0), 40) * 800;
  return base + premium;
};

const mapRecipeToPizza = (recipe: SpoonacularRecipe): PizzaItem => {
  const category = deriveCategory(recipe);
  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    description: stripHtml(recipe.summary) || 'Freshly baked pizza straight from the oven.',
    category,
    price: calculatePrice(category, recipe.readyInMinutes),
    readyInMinutes: recipe.readyInMinutes ?? 0,
    instructions: stripHtml(recipe.instructions) || ''
  };
};

const fallbackPizzas: PizzaItem[] = [
  {
    id: 1001,
    title: 'Margherita Classico',
    image: 'https://images.unsplash.com/photo-1548365328-9f5475c5b1fc?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh basil, mozzarella, and ripe tomatoes on a crisp crust.',
    category: 'Classic',
    price: 89000,
    readyInMinutes: 20,
    instructions: 'Preheat oven to 250°C. Spread sauce over dough, add mozzarella and basil, drizzle olive oil, bake 10 minutes.'
  },
  {
    id: 1002,
    title: 'Pepperoni Burst',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description: 'Loaded with premium pepperoni, mozzarella, and oregano.',
    category: 'Meat Lover',
    price: 105000,
    readyInMinutes: 25,
    instructions: 'Layer marinara, mozzarella, and pepperoni slices. Finish with oregano and bake until crispy edges form.'
  },
  {
    id: 1003,
    title: 'Truffle Funghi',
    image: 'https://images.unsplash.com/photo-1601924582971-d77c5c9f77a3?auto=format&fit=crop&w=800&q=80',
    description: 'Portobello mushrooms, white sauce, and a drizzle of truffle oil.',
    category: 'Gourmet',
    price: 120000,
    readyInMinutes: 28,
    instructions: 'Saute mushrooms with garlic, spread béchamel on dough, top with cheese, bake, then drizzle truffle oil.'
  },
  {
    id: 1004,
    title: 'Veggie Garden',
    image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=80',
    description: 'Bell peppers, olives, sweet corn, and cherry tomatoes.',
    category: 'Vegetarian',
    price: 88000,
    readyInMinutes: 22,
    instructions: 'Spread tomato sauce, add veggies and mozzarella, season with herbs, bake until crust is golden.'
  },
  {
    id: 1005,
    title: 'Four Cheese Melt',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    description: 'Mozzarella, gorgonzola, parmesan, and provolone blend.',
    category: 'Classic',
    price: 112000,
    readyInMinutes: 18,
    instructions: 'Brush dough with garlic butter, sprinkle cheese blend evenly, bake until bubbly and golden.'
  },
  {
    id: 1006,
    title: 'Spicy Calabrese',
    image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=80&sat=-20',
    description: 'Spicy calabrese salami, chili flakes, and roasted garlic.',
    category: 'Meat Lover',
    price: 109000,
    readyInMinutes: 24,
    instructions: 'Top sauced dough with mozzarella, salami, chili flakes, and roasted garlic, bake until crisp.'
  }
];

export const useMenuStore = defineStore('menu-store', {
  state: () => ({
    items: fallbackPizzas as PizzaItem[],
    loading: false,
    error: null as string | null,
    searchQuery: '',
    selectedCategory: 'All'
  }),
  getters: {
    categories: (state) => ['All', ...new Set(state.items.map((pizza) => pizza.category))],
    filteredItems: (state) => {
      const query = state.searchQuery.trim().toLowerCase();
      return state.items.filter((pizza) => {
        const matchesQuery =
          !query ||
          pizza.title.toLowerCase().includes(query) ||
          pizza.description.toLowerCase().includes(query);
        const matchesCategory = state.selectedCategory === 'All' || pizza.category === state.selectedCategory;
        return matchesQuery && matchesCategory;
      });
    }
  },
  actions: {
    async fetchPizzas() {
      this.loading = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const apiKey = config.public.spoonacularKey;

        if (!apiKey) {
          throw new Error('Missing Spoonacular API key');
        }

        const response = await $fetch<{ results?: SpoonacularRecipe[] }>(
          'https://api.spoonacular.com/recipes/complexSearch',
          {
            params: {
              query: 'pizza',
              number: 24,
              addRecipeInformation: true,
              apiKey
            }
          }
        );

        const recipes = response?.results ?? [];
        this.items = recipes.length ? recipes.map(mapRecipeToPizza) : fallbackPizzas;
        return this.items;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to load pizzas from Spoonacular.';
        this.error = message;
        this.items = fallbackPizzas;
        return this.items;
      } finally {
        this.loading = false;
      }
    },
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },
    setCategory(category: string) {
      this.selectedCategory = category;
    }
  }
});

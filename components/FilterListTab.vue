<template>
  <div class="tabs pt-24">
    <div class="tab-list items-end max-w-screen-2xl mx-auto px-4 sm:px-8">
      <button
        v-for="(item, index) in items"
        :key="index"
        @click="selectedTab = index"
        :class="[
          'tab space-x-2 items-center text-2xl rounded-t-3xl border-t border-black border-x px-5 py-5 transition-all duration-200 block',
          { 'active-tab -mb-1 pb-12': selectedTab === index, 'pt-5 pb-5': selectedTab !== index },
          item.backgroundColor
        ]"
      >
        {{ item.label }}
      </button>
    </div>
    <div class="tab-content" :class="items[selectedTab].backgroundColor">
      <div v-if="selectedTab === 0">
        <div>
          <Filter @updateSelectedTags="handleTagUpdate" />

          <!-- Display loading state -->
          <div v-if="loading">Loading...</div>

          <!-- Display films or message if no films -->
          <div v-else class="container max-w-screen-2xl mx-auto px-4 sm:px-8 pt-8">
            <div v-if="filteredFilms.length === 0">No films available.</div>
            <div v-else class="md:grid md:grid-cols-3 md:gap-8 xl:gap-12 space-y-6 md:space-y-0">
              <FilmCard v-for="film in filteredFilms" :key="film.id" :film="film" />
              <div class="col-span-full flex justify-center">
                <button v-if="hasMore && !loading" @click="loadMore" class="film-card-btn mx-auto">Load More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="selectedTab === 1">
        <!-- Content for Tab 2 -->
        <p>{{ items[1].content }}</p>
      </div>

      <div v-else-if="selectedTab === 2">
        <!-- Content for Tab 3 -->
        <p>{{ items[2].content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useFilmData } from '../composables/useFilmData';
import type { IFilm } from '../types/filmType';

const selectedTab = ref(0);
const filteredFilms = ref<IFilm[]>([]);

// Fetch film data using the composable function
const { films, loadMore, loading, setSelectedTags, hasMore } = useFilmData();

// Watch the films and update filteredFilms when films change
watch(films, (newFilms) => {
  console.log('Films updated:', newFilms); // Debugging: Check if films are being fetched
  filteredFilms.value = newFilms;
});

// Handle tag updates and fetch new films based on selected tags
const handleTagUpdate = (newSelectedTags: number[]) => {
  console.log("Selected Tags Updated:", newSelectedTags);
  setSelectedTags(newSelectedTags); // Update tags and fetch new films
};

// Tab items
const items = ref([
  { label: 'FILMS A-Z', content: [], backgroundColor: 'bg-bsf13orange' }, 
  { label: 'Tab 2', content: 'Content for Tab 2', backgroundColor: 'bg-bsf13purple' }, 
  { label: 'Tab 3', content: 'Content for Tab 3', backgroundColor: 'bg-bsf13green' },
]);

// Load films initially when the component is mounted

onMounted(() => {
  console.log('Component mounted, triggering initial load'); // Debugging: Check if mounted is called
  if (films.value.length === 0) {
    filteredFilms.value = films.value;
    loadMore(); // Trigger the initial load of films
  }
});
</script>

<style scoped>
.tab-list {
  display: flex;
}

.tab {
  border-top: 1px solid #000000;
  border-right: 1px solid #000000;
  border-left: 1px solid #000000;
  cursor: pointer;
}

.active-tab {
  margin-bottom: -2px;
}

.tab-content {
  padding: 16px 0;
  border: 1px solid #000000;
}

.film-card {
  border: 1px solid #000000;
}

.film-card-btn {
  border-radius: 9999px;
  border: 1px solid #000000;
  line-height: 1.5;
  padding: 0.375rem 1.75rem;
  transition-duration: 0.2s;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

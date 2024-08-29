<template>
  <div>
    <div class="flex justify-between items-center border-b border-black p-5">
      <h1>FILMS A-Z</h1>
      <div @click="toggleFilter" class="flex items-center justify-center w-10 h-10 border border-black rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-7 7V21a1 1 0 01-1.447.894l-4-2A1 1 0 0110 19v-5.586l-7-7A1 1 0 013 6V4z"/>
        </svg>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showFilter" class="p-4 bg-purple-200 rounded-lg">
        <div class="flex justify-between items-center p-2">
          <h3 class="text-lg font-semibold">Filter by</h3>
          <div @click="closeFilter">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
        </div>
        <div class="mb-4 md:grid md:grid-cols-3 md:gap-8 xl:gap-12 space-y-6 md:space-y-0">
          <div>
            <div class="flex justify-between items-center border-b border-black p-2">
              <p class="text-lg font-semibold">Category / Tag</p>
              <div @click="toggleCategory">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path :d="showCategory ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
              </div>
            </div>
            <div v-if="showCategory" class="mt-4">
              <ul v-if="tags.length">
  <li v-for="tag in tags" :key="tag.id" class="flex mt-2 items-center">
    <div class="relative">
      <input
        type="checkbox"
        :value="tag.id"
        :checked="selectedTags.includes(tag.id)"
        @change="handleTagChange(tag.id, $event)"
        class="peer absolute opacity-0 w-5 h-5"
        :id="`${tag.id}`"
      />
      <div
        class="w-5 h-5 border rounded-full border-black  peer-checked:transparent flex items-center justify-center"
      >
      <svg
            v-if="selectedTags.includes(tag.id)"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="w-3 h-3 text-black"
          >
            <circle cx="12" cy="12" r="8" fill="currentColor"/>
          </svg>

      </div>
    </div>
    <label :for="`${tag.id}`" class="ms-2 text-sm font-medium">
      {{ tag.name }}
    </label>
  </li>
</ul>

            </div>
          </div>
          <!-- Add more filter options as needed -->
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFetch } from '#app';
import { useTags } from '../composables/useTags';
import type { IFilm } from '../types/filmType';

const emit = defineEmits<{
  (e: 'updateFilms', newFilms: IFilm[], isLoading: boolean, hasMore: boolean): void;
}>();

const { tags, loading: tagsLoading, error: tagsError } = useTags();
console.log('Tags:', tags.value);
const showFilter = ref(false);
const showCategory = ref(false);
const selectedTags = ref<number[]>([]);
const page = ref(1);
const allFilms = ref<IFilm[]>([]);
const hasMore = ref(true);

const toggleCategory = () => {
  showCategory.value = !showCategory.value;
};

const toggleFilter = () => {
  showFilter.value = true;
};

const closeFilter = () => {
  showFilter.value = false;
};

const fetchFilms = async (reset = false) => {
  if (reset) {
    page.value = 1;
    allFilms.value = [];
    hasMore.value = true;
  }

  if (!hasMore.value) {
    return; // No more films to load
  }

  const baseUrl = 'https://wp.blackstarfest.org/wp-json/wp/v2/festival-film';
  const perPage = 9;
  const queryParams = new URLSearchParams({
    per_page: perPage.toString(),
    page: page.value.toString(),
    _year: '2024',
    rich: '1',
    not_hidden: '1',
  });


  if (selectedTags.value.length > 0) {
    queryParams.append('eventive-tag', selectedTags.value.join(','));
  }

  const url = `${baseUrl}?${queryParams.toString()}`;

  try {
    const filmsData = await $fetch<IFilm[]>(url);
  


    allFilms.value = reset ? filmsData : [...allFilms.value, ...filmsData];

    // Determine if there are more films to load
    hasMore.value = filmsData.length === perPage;
    // Emit the updated films data to the parent
    emit('updateFilms', allFilms.value, false, hasMore.value);

    // Increment the page number for the next load more
    page.value += 1;

  } catch (error) {
    console.error('Error fetching films:', error);
    hasMore.value = false; // No more data can be loaded on error
    if (reset) {
      emit('updateFilms', [], false, false); // Emit an empty array in case of error when resetting
    }
  }
};

const handleTagChange = (id: number, event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked;

  if (isChecked) {
    selectedTags.value.push(id);
  } else {
    selectedTags.value = selectedTags.value.filter(tagId => tagId !== id);
  }

  console.log('Updated Selected Tags (Array):', [...selectedTags.value]);


  fetchFilms(true);
};
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

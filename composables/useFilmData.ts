import { ref } from 'vue';
import type { IFilm } from '../types/filmType';
import { useNuxtApp, useAsyncData } from 'nuxt/app';

export function useFilmData() {
  const films = ref<IFilm[]>([]);
  const hasMore = ref(true);
 const loading = ref(true);
  const page = ref(1);
  const selectedTags = ref<number[]>([]);

  const fetchFilms = async (reset = false) => {
    if (reset) {
      page.value = 1; // Reset to the first page
      films.value = []; // Clear the current films
      hasMore.value = true; // Reset the hasMore flag
      loading.value = true;
    }



    try {
      const baseUrl = 'https://wp.blackstarfest.org/wp-json/wp/v2/festival-film';
      const perPage = 9;
      const queryParams = new URLSearchParams({
        per_page: perPage.toString(),
        page: page.value.toString(), // Use the current page value
        _year: '2024',
        rich: '1',
        not_hidden: '1',
      });

      if (selectedTags.value.length > 0) {
        queryParams.append('eventive-tag', selectedTags.value.join(','));
      }

      const url = `${baseUrl}?${queryParams.toString()}`;
      console.log("Fetching URL:", url);

   const data = await $fetch<IFilm[]>(url);
     

    console.log("Fetching data:", data);

      if (data && data && data.length > 0) {
       const filmIds = new Set(films.value.map(film => film.id));
        const uniqueFilms = data.filter(film => !filmIds.has(film.id));
        films.value = [...films.value, ...uniqueFilms]
      
        hasMore.value = data.length === perPage; 
        if (hasMore.value) {
          page.value += 1; 
        }
      } else {
        hasMore.value = false; 
      }
    } catch (error) {
      console.error("Error fetching films:", error);
      hasMore.value = false;
    } finally {
    loading.value = false;
    }
  };

  const loadMore = async () => {

    if (hasMore.value ){
      await fetchFilms(); // Fetch films before incrementing the page number

    }
  };

  const setSelectedTags = (tags: number[]) => {
    selectedTags.value = tags;
    fetchFilms(true); // Reset and fetch new films with the selected tags
  };

  return {
    films,
    hasMore,
    loadMore,
    loading,
    setSelectedTags, // Expose the setSelectedTags function
  };
}

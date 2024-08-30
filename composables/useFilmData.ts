import { ref } from 'vue';
import type { IFilm } from '../types/filmType';

export function useFilmData() {
  const films = ref<IFilm[]>([]);
  const hasMore = ref(true);
  const loading = ref(false);
  const page = ref(1);
  const selectedTags = ref<number[]>([]);

  const fetchFilms = async (reset = false) => {
    if (reset) {
      page.value = 1; // Reset to the first page when new tags are selected
      films.value = []; // Clear the current films
      hasMore.value = true; // Reset the hasMore flag
      console.log('Resetting films and page due to new filters');
    }

    if (!hasMore.value || loading.value) {
      return; // Prevent further loading if there are no more items or if already loading
    }

    loading.value = true;
    console.log('Fetching films, loading:', loading.value);

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
      console.log("Fetched data:", data);

      if (data && data.length > 0) {
        films.value.push(...data); // Add the fetched films to the current array
        hasMore.value = data.length === perPage; // If fewer than perPage items are returned, stop loading more
        console.log('Films after fetching:', films.value);
        page.value += 1; // Increment the page only after a successful fetch
      } else {
        hasMore.value = false; // No more films to load
      }
    } catch (error) {
      console.error("Error fetching films:", error);
      hasMore.value = false;
    } finally {
      loading.value = false;
      console.log('Loading complete, loading:', loading.value);
    }
  };

  const loadMore = async () => {
    if (hasMore.value && !loading.value) {
      await fetchFilms(); // Fetch the next set of films
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

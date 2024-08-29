import { ref } from 'vue';
import type { IFilm } from '../types/filmType';

export function useFilmData() {
  const films = ref<IFilm[]>([]);
  const hasMore = ref(true);
  const loading = ref(false);
  const page = ref(1);

  const fetchFilms = async  (pageNum: number) => {
    loading.value = true;

    try {
      const url = `https://wp.blackstarfest.org/wp-json/wp/v2/festival-film?per_page=9&page=${pageNum}&_year=2024&rich=1&not_hidden=1`;
      const data =   await $fetch<IFilm[]>(url);

      if (data && data.length > 0) {
        films.value.push(...data);
        hasMore.value = data.length > 0;
      } else {
        hasMore.value = false;
      }
    } catch (error) {
      hasMore.value = false;
    } finally {
      loading.value = false;
    }
  };

  const loadMore = () => {
    if (hasMore.value && !loading.value) {
      page.value += 1;
      fetchFilms(page.value);
    }
  };

  // Initial fetch
  fetchFilms(page.value);

  return {
    films,
    hasMore,
    loadMore,
    loading,
  };
}

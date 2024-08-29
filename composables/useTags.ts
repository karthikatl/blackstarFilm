import { ref } from 'vue';
import { useFetch } from '#app'; // Ensure correct import path
import type { ITags } from '../types/filmType';

export function useTags() {
  const tags = ref<ITags[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTags = async () => {
    loading.value = true;
    try {
      // Define the parameters
      const params = {
        per_page: 99,
        _year: 2024
      };

      // Construct the URL with parameters
      const url = new URL('https://wp.blackstarfest.org/wp-json/wp/v2/eventive-tag');
      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value.toString()));

      // Fetch data tags
      const { data, status, error } = await useFetch(url.toString());
      console.log("d", data.value[0]);
      if (data.value && Array.isArray(data.value)) {
       tags.value.push(...data.value as ITags[]);
      } else {
        error.value = 'Failed to fetch tags.';
      }
    } catch (err) {
      error.value = 'An error occurred while fetching tags.';
      console.error('Error fetching tags:', err);
    } finally {
      loading.value = false;
    }
  };

  // Initial fetch
  fetchTags();

  return {
    tags,
    loading,
    error,
  };
}

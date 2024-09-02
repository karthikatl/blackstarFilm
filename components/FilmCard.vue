<template>
  <div class="film-card-container">
    <div class="film-card relative border-inherit border  border-black rounded-3xl explainer p-3 md:p-6 lg:p-8 flex flex-col justify-between h-full">
      <pre class="film-image rounded-3xl  border-black" v-html="film.featured_image_rendered.card"></pre>
      <h3 class="text-2xl lg:text-3xl 2xl:text-4xl font-sans font-normal mt-6 mb-3">{{ film.title.rendered }}</h3>
      <p class="bsf13-prose md:pr-4 my-4 flex-grow">{{ film.short_documentary }} </p>
      <p v-if="directors.length">Director: 
        <span v-for="(director, index) in directors" :key="index">
          {{ director }}
        </span>
      </p>
      <p>Runtime: {{ film.acf.runtime }} minutes</p>
      <div class="mt-auto mb-0 w-full align-self-start">
        <div class="flex flex-wrap gap-y-1 mt-4">
          <button class="film-card-btn">Read more</button>
          <button class="film-card-btn mx-4">Watch Trailer</button>
        </div>
        <div class="flex flex-wrap gap-y-1 mt-4">
          <button class="border border-black rounded-[40px] p-1">CC</button>
          <button class="border border-black rounded-[40px] p-1 mx-4">AD</button>

          <button class="border border-black rounded-[40px] px-3 pt-1">!</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFilm } from '../types/filmType'
import {  computed } from 'vue';

// Define props to receive the film data
const props = defineProps<{ film: IFilm }>();
const directors = computed(() => {
  return props.film.acf.credits.filter(credit => credit.type === 'Director')
    .map(credit => credit.name);
});
</script>

<style scoped >
.film-card{
  border: 1px solid #000000;
}
.film-image img {
  border: 1px solid #000000;
  border-radius: 1.5rem !important;
}
.film-card-btn {
    border-radius: 9999px;
    border: 1px solid #000000;
    line-height: 1.5;
    padding: .375rem 1.75rem;
    transition-duration: .2s;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
}
</style>
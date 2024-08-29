export interface IFilm {
    id: number;
    featured_image_rendered: {
        card: string;
    },
    title: {
        rendered: string;
    };
    short_documentary: string;
    acf: {
        runtime: string;
        credits: ICredit[]
    },
    featured_media_url: string;
  }

  export interface ICredit {
    type: string;
    name: string;
  }

  export interface ITags {
    id: number;
    name: string;
  }
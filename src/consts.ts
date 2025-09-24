// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Coppermill's Rain Garden";
export const SITE_DESCRIPTION = "A little corner of paradise";
export const S3 = import.meta.env.PROD
  ? "https://coppermill-zen-garden.s3.eu-west-2.amazonaws.com"
  : "/video";

<script>
  import 'tailwindcss/tailwind.css';
  import '../app.scss';
  import config from '../config';
</script>

<svelte:head>
  <title>{config.title}</title>
  <meta content={config.subtitle} name="description" />
  <link rel="icon" href={config.favicon} />

  <meta property="og:type" content="website" />
  <meta property="og:title" content={config.title} />
  <meta property="og:site_name" content={config.title} />
  <meta property="og:url" content="https://{config.domain}" />
  <meta property="og:description" content={config.subtitle} />
  <meta property="og:image" content={config.social_img} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@vercel" />
  <meta name="twitter:title" content={config.title} />
  <meta name="twitter:description" content={config.subtitle} />
  <meta name="twitter:image" content={config.social_img} />
</svelte:head>

<slot />

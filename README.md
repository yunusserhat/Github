# Yunus Serhat Bıçakçı

[![Netlify Status](https://api.netlify.com/api/v1/badges/3783cebf-50d2-4957-9df6-43f94a06dedc/deploy-status)](https://app.netlify.com/sites/yunusserhat/deploys)

Personal academic website built with Hugo and the Wowchemy Academic theme.

## Local development

Install the extended [Hugo](https://gohugo.io/installation/) release listed in `netlify.toml` (currently `0.166.0`), then run:

```sh
hugo server --disableFastRender --i18n-warnings
```

## Production build

```sh
hugo --gc --minify -b https://www.yunusserhat.com/
```

The Netlify build also deploys the office-hours Netlify Functions. Run the JavaScript checks locally with:

```sh
npm test
```

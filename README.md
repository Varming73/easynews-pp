<div align="center"><img src="https://i.imgur.com/1adWebT.png" alt="Easynews++ Logo"></div>
<h1 align="center" id="title">Easynews++</h1>
<div align="center">

![Easynews++ Logo](https://img.shields.io/badge/Easynews%2B%2B-Addon-blue?style=for-the-badge)
![Version](https://img.shields.io/github/v/release/Varming73/easynews-plus-plus?style=for-the-badge&label=Version)
![Checks](https://img.shields.io/github/check-runs/Varming73/easynews-plus-plus/main?style=for-the-badge&label=Checks)

</div>

**Easynews++** is an open-source addon that turns your Easynews account into a streaming source for Stremio and compatible apps like Omni, Vidi, Fusion and Nuvio. Plug in your Easynews credentials and it searches Easynews for whatever you're trying to watch, then filters and sorts the results by quality, size and language so the best stream sits right at the top.

Built upon the foundation of Easynews+, it implements a different authentication approach to ensure seamless operation across various platforms — including Stremio, Omni, Vidi, Fusion and Nuvio.

> [!NOTE]
> This is an **actively maintained fork** of [Easynews++](https://github.com/panteLx/easynews-plus-plus). Upstream development by panteLx was discontinued in June 2025; this fork continues maintenance with ongoing bug fixes and improvements. It is community-maintained and is not affiliated with the original author or with Easynews.

**Public instance:** none — this fork doesn't host one. [Self-host it](#-self-hosting) in a few minutes using the guide below.

---

## ✨ Features

- 🔍 **Smart title matching** — handles multi-word titles, odd naming and special characters, with an optional strict mode (on by default)
- 🌍 **Custom titles & TMDB translations** — so foreign and alternate titles still resolve to the right content
- 🎚️ **Sort your way** — by quality, language, size or date
- 🧹 **Clean results** — samples, spam and broken files are filtered out automatically
- ⭐ **Preferred audio language** is prioritized and flagged in the results
- 🎛️ **Filters** for resolution, max file size and results-per-quality
- ⚡ **In-memory caching** with a configurable TTL keeps repeat lookups fast
- 🌐 **13-language UI** with seamless switching
- 🏠 **Self-hostable** via Docker, Node or Cloudflare Workers

Adding alternate or translated titles to [`custom-titles.json`](./custom-titles.json) is the easiest way to improve matching for content the metadata providers get wrong.

---

## 🏠 Self-Hosting

There's no public instance, so you run your own. A prebuilt multi-arch (amd64/arm64) Docker image is published to GitHub Container Registry on every release, so you don't have to build anything.

**Docker Compose** (recommended — pulls the prebuilt image and wires up your `.env` and `custom-titles.json`):

```bash
git clone https://github.com/Varming73/easynews-plus-plus.git && cd easynews-plus-plus
cp .env.example .env
docker-compose up -d
```

**Plain Docker** (just the image, nothing to clone):

```bash
docker run -d -p 1337:1337 ghcr.io/varming73/easynews-plus-plus:latest
```

Then open `http://localhost:1337/` and configure the addon. Available tags are on the [GitHub Packages page](https://github.com/Varming73/easynews-plus-plus/pkgs/container/easynews-plus-plus).

Prefer to run it from source, deploy to a Cloudflare Worker, or set it up for development? See **[docs/CONFIGURATION.md](./docs/CONFIGURATION.md)**.

---

## ⚙️ Configuration

Most settings — credentials, preferred language, sorting, quality filters — are configured on the addon's own **configuration page** when you install it. No server config needed for everyday use.

For self-hosters, behavior can be tuned with environment variables (port, log level, cache sizes, `TMDB_API_KEY` for translated-title search, and the `/resolve` streaming proxy). The full reference lives in **[docs/CONFIGURATION.md](./docs/CONFIGURATION.md)**.

> [!NOTE]
> As of recent versions the addon no longer embeds your Easynews credentials in stream URLs by default — streams are routed through a `/resolve` proxy instead. If an existing install shows a "reconfigure" message, re-install it from the configuration page. See [docs/CONFIGURATION.md](./docs/CONFIGURATION.md#streaming--security) for details.

---

## ❓ FAQ

### What is Easynews?

Easynews is a premium Usenet provider with a web-based browser that lets you search, preview and download files from Usenet without a separate newsreader. It works as an alternative to debrid services (Real-Debrid, Premiumize, AllDebrid, etc.). **An active Easynews subscription is required to use this addon.**

**More questions?** Why a title shows no streams (or only a 1-minute clip), plus caching, title matching, sorting, language filtering and platform compatibility — all answered in **[docs/FAQ.md](./docs/FAQ.md)**.

---

## 🤝 Contributing

Issues, fixes and custom-title additions are welcome on [GitHub](https://github.com/Varming73/easynews-plus-plus). For local setup and the release process, see [docs/CONFIGURATION.md](./docs/CONFIGURATION.md#development).

## 🙏 Credits

- [panteLx/easynews-plus-plus](https://github.com/panteLx/easynews-plus-plus) — Easynews++, the upstream project this fork is based on
- [sleeyax/stremio-easynews-addon](https://github.com/Sleeyax/stremio-easynews-addon) — repository structure, base code and inspiration
- [Viren070/AIOStreams](https://github.com/Viren070/AIOStreams) — issue templates
- Everyone who has contributed through code, testing and ideas

## 📄 License

[MIT](./LICENSE)

> [!NOTE]
> This is an independent, fan-made addon for Easynews. An active Easynews subscription is required for use. This project is not affiliated with Easynews.

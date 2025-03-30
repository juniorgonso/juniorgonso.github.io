---
permalink: /assets/js/search-data.js
---
// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [
  {%- for page in site.pages -%}
    {%- if page.permalink == '/' -%}{%- assign about_title = page.title | strip -%}{%- endif -%}
  {%- endfor -%}
  {
    id: "nav-{{ about_title | slugify }}",
    title: "{{ about_title | truncatewords: 13 }}",
    section: "Navigation",
    handler: () => {
      window.location.href = "{{ '/' | relative_url }}";
    },
  },
  {%- assign sorted_pages = site.pages | sort: "nav_order" -%}
  {%- for p in sorted_pages -%}
    {%- if p.nav and p.autogen == null -%}
      {%- if p.dropdown -%}
        {%- for child in p.children -%}
          {%- unless child.title == 'divider' -%}
            {
              {%- assign title = child.title | escape | strip -%}
              {%- if child.permalink contains "/blog/" -%}{%- assign url = "/blog/" -%} {%- else -%}{%- assign url = child.permalink -%}{%- endif -%}
              id: "dropdown-{{ title | slugify }}",
              title: "{{ title | truncatewords: 13 }}",
              description: "{{ child.description | strip_html | strip_newlines | escape | strip }}",
              section: "Dropdown",
              handler: () => {
                window.location.href = "{{ url | relative_url }}";
              },
            },
          {%- endunless -%}
        {%- endfor -%}

      {%- else -%}
        {
          {%- assign title = p.title | escape | strip -%}
          {%- if p.permalink contains "/blog/" -%}{%- assign url = "/blog/" -%} {%- else -%}{%- assign url = p.url -%}{%- endif -%}
          id: "nav-{{ title | slugify }}",
          title: "{{ title | truncatewords: 13 }}",
          description: "{{ p.description | strip_html | strip_newlines | escape | strip }}",
          section: "Navigation",
          handler: () => {
            window.location.href = "{{ url | relative_url }}";
          },
        },
      {%- endif -%}
    {%- endif -%}
  {%- endfor -%}
  {%- if site.posts_in_search -%}
    {%- for post in site.posts -%}
      {
        {%- assign title = post.title | escape | strip -%}
        id: "post-{{ title | slugify }}",
        {% if post.redirect == blank %}
          title: "{{ title | truncatewords: 13 }}",
        {% elsif post.redirect contains '://' %}
          title: "{{ title | truncatewords: 13 }} <svg width=\"1.2rem\" height=\"1.2rem\" top=\".5rem\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9\" class=\"icon_svg-stroke\" stroke=\"#999\" stroke-width=\"1.5\" fill=\"none\" fill-rule=\"evenodd\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>",
        {% else %}
          title: "{{ title | truncatewords: 13 }}",
        {% endif %}
        description: "{{ post.description | strip_html | strip_newlines | escape | strip }}",
        section: "Posts",
        handler: () => {
          {% if post.redirect == blank %}
            window.location.href = "{{ post.url | relative_url }}";
          {% elsif post.redirect contains '://' %}
            window.open("{{ post.redirect }}", "_blank");
          {% else %}
            window.location.href = "{{ post.redirect | relative_url }}";
          {% endif %}
        },
      },
    {%- endfor -%}
  {%- endif -%}
  {%- for collection in site.collections -%}
    {%- if collection.label != 'posts' -%}
      {%- for item in collection.docs -%}
        {
          {%- if item.inline -%}
            {%- assign title = item.content | newline_to_br | replace: "&lt;br /&gt;", " " | replace: "&lt;br/&gt;", " " | strip_html | strip_newlines | escape | strip -%}
          {%- else -%}
            {%- assign title = item.title | newline_to_br | replace: "&lt;br /&gt;", " " | replace: "&lt;br/&gt;", " " | strip_html | strip_newlines | escape | strip -%}
          {%- endif -%}
          id: "{{ collection.label }}-{{ title | slugify }}",
          title: '{{ title | escape | emojify | truncatewords: 13 }}',
          description: "{{ item.description | strip_html | strip_newlines | escape | strip }}",
          section: "{{ collection.label | capitalize }}",
          {%- unless item.inline -%}
            handler: () => {
              window.location.href = "{{ item.url | relative_url }}";
            },
          {%- endunless -%}
        },
      {%- endfor -%}
    {%- endif -%}
  {%- endfor -%}
  {%- if site.socials_in_search -%}
    {%- assign socials_data = {
        "acm_id": { "title": "ACM DL", "url_template": "https://dl.acm.org/profile/{{ id }}/" },
        "blogger_url": { "title": "Blogger", "url_template": "{{ url }}" },
        "bluesky_url": { "title": "Bluesky", "url_template": "{{ url }}" },
        "dblp_url": { "title": "DBLP", "url_template": "{{ url }}" },
        "discord_id": { "title": "Discord", "url_template": "https://discord.com/users/{{ id }}" },
        "email": { "title": "email", "url_template": "mailto:{{ id | encode_email }}" },
        "facebook_id": { "title": "Facebook", "url_template": "https://facebook.com/{{ id }}" },
        "flickr_id": { "title": "Flickr", "url_template": "https://www.flickr.com/{{ id }}" },
        "github_username": { "title": "GitHub", "url_template": "https://github.com/{{ id }}" },
        "gitlab_username": { "title": "GitLab", "url_template": "https://gitlab.com/{{ id }}" },
        "ieee_id": { "title": "IEEE Xplore", "url_template": "https://ieeexplore.ieee.org/author/{{ id }}/" },
        "inspirehep_id": { "title": "Inspire HEP", "url_template": "https://inspirehep.net/authors/{{ id }}" },
        "instagram_id": { "title": "Instagram", "url_template": "https://instagram.com/{{ id }}" },
        "kaggle_id": { "title": "Kaggle", "url_template": "https://www.kaggle.com/{{ id }}" },
        "keybase_username": { "title": "Keybase", "url_template": "https://keybase.io/{{ id }}" },
        "lastfm_id": { "title": "Last FM", "url_template": "https://www.last.fm/user/{{ id }}" },
        "lattes_id": { "title": "Lattes", "url_template": "http://lattes.cnpq.br/{{ id }}" },
        "leetcode_id": { "title": "LeetCode", "url_template": "https://leetcode.com/u/{{ id }}/" },
        "linkedin_username": { "title": "LinkedIn", "url_template": "https://www.linkedin.com/in/{{ id }}" },
        "mastodon_username": { "title": "Mastodon", "url_template": "https://{{ id }}" },
        "medium_username": { "title": "Medium", "url_template": "https://medium.com/@{{ id }}" },
        "orcid_id": { "title": "ORCID", "url_template": "https://orcid.org/{{ id }}" },
        "osf_id": { "title": "Open Science Framework", "url_template": "https://osf.io/{{ id }}/" },
        "pinterest_id": { "title": "Pinterest", "url_template": "https://www.pinterest.com/{{ id }}" },
        "publons_id": { "title": "Publons", "url_template": "https://publons.com/a/{{ id }}/" },
        "quora_username": { "title": "Quora", "url_template": "https://www.quora.com/profile/{{ id }}" },
        "research_gate_profile": { "title": "ResearchGate", "url_template": "https://www.researchgate.net/profile/{{ id }}/" },
        "rss_icon": { "title": "RSS Feed", "url_template": "{{ site.baseurl }}/feed.xml" },
        "scholar_userid": { "title": "Google Scholar", "url_template": "https://scholar.google.com/citations?user={{ id }}" },
        "scopus_id": { "title": "Scopus", "url_template": "https://www.scopus.com/authid/detail.uri?authorId={{ id }}" },
        "semanticscholar_id": { "title": "Semantic Scholar", "url_template": "https://www.semanticscholar.org/author/{{ id }}" },
        "spotify_id": { "title": "Spotify", "url_template": "https://open.spotify.com/user/{{ id }}" },
        "stackoverflow_id": { "title": "Stackoverflow", "url_template": "https://stackoverflow.com/users/{{ id }}" },
        "strava_userid": { "title": "Strava", "url_template": "https://www.strava.com/athletes/{{ id }}" },
        "telegram_username": { "title": "telegram", "url_template": "https://telegram.me/{{ id }}" },
        "unsplash_id": { "title": "Unsplash", "url_template": "https://unsplash.com/@{{ id }}" },
        "whatsapp_number": { "title": "whatsapp", "url_template": "https://wa.me/{{ id }}" },
        "wikidata_id": { "title": "Wikidata", "url_template": "https://www.wikidata.org/wiki/{{ id }}" },
        "wikipedia_id": { "title": "Wikipedia", "url_template": "https://wikipedia.org/wiki/User:{{ id }}" },
        "work_url": { "title": "Work", "url_template": "{{ url }}" },
        "x_username": { "title": "X", "url_template": "https://twitter.com/{{ id }}" },
        "youtube_id": { "title": "YouTube", "url_template": "https://youtube.com/@{{ id }}" },
        "zotero_username": { "title": "Zotero", "url_template": "https://www.zotero.org/{{ id }}" }
    } -%}

    {%- for social in site.data.socials -%}
        {%- assign social_key = social[0] -%}
        {%- if socials_data[social_key] -%}
            {%- assign social_info = socials_data[social_key] -%}
            {%- assign social_id = "social-" | append: social_key -%}
            {%- assign social_title = social_info.title -%}
            {%- capture social_url -%}
                {%- if social_info.url_template contains "{{" -%}
                    {{ social_info.url_template | replace: "{{ id }}", social[1] | replace: "{{ url }}", social[1] }}
                {%- else -%}
                    {{ social_info.url_template }}
                {%- endif -%}
            {%- endcapture -%}
            {
                id: '{{ social_id }}',
                title: '{{ social_title }}',
                section: 'Socials',
                handler: () => {
                    window.open({{ social_url }}, "_blank");
                },
            },
        {%- else -%}
            {%- assign social_id = "social-" | append: social_key -%}
            {%- assign social_title = social_key | capitalize -%}
            {%- capture social_url %}{{ social[1].url }}{% endcapture -%}
            {
                id: '{{ social_id }}',
                title: '{{ social_title }}',
                section: 'Socials',
                handler: () => {
                    window.open({{ social_url }}, "_blank");
                },
            },
        {%- endif -%}
    {%- endfor -%}
  {%- endif -%}
  {%- if site.enable_darkmode -%}
    {
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },
  {%- endif -%}
];

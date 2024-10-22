import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { formatNavbarItem, formatFooterItem } from './utils';
import docusaurusData from './config/docusaurus/index.json';

const brandName = 'Brand Name';

const logoTheme: Preset.ThemeConfig['navbar']['logo'] = {
  alt: docusaurusData?.logo?.alt || `${brandName} Logo`,
  src: docusaurusData?.logo?.src || 'img/logo.svg',
  srcDark: docusaurusData?.logo?.srcDark || 'img/logo-dark.svg',
};

const config: Config = {
  title: docusaurusData.title || 'My Site',
  tagline: docusaurusData.tagline || 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: docusaurusData.url || 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: docusaurusData.url + '/admin/#/collections/doc',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: docusaurusData.url + '/admin/#/collections/post',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: docusaurusData.title || brandName,
      logo: logoTheme,
      items: docusaurusData.navbar.map((item) => {
        return formatNavbarItem(item);
      }),
    },
    footer: {
      style: docusaurusData.footer?.style || 'dark',
      links: docusaurusData.footer?.links.map((item) => {
        return formatFooterItem(item);
      }),
      copyright:
        `Copyright © ${new Date().getFullYear()} ` +
        (docusaurusData.footer?.copyright || docusaurusData.title || brandName),
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

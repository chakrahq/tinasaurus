import title from 'title';
import type * as Preset from '@docusaurus/preset-classic';
import type { SidebarItemConfig } from '@docusaurus/plugin-content-docs/src/sidebars/types.ts';

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
    .replace(/[\s_-]+/g, "_") // swap any length of whitespace, underscore, hyphen characters with a single _
    .replace(/^-+|-+$/g, ""); // remove leading, trailing -
};

export const docusaurusDate = (val) => {
  let ye = new Intl.DateTimeFormat("en", {
    year: "numeric",
  }).format(val);
  let mo = new Intl.DateTimeFormat("en", {
    month: "2-digit",
  }).format(val);
  let da = new Intl.DateTimeFormat("en", {
    day: "2-digit",
  }).format(val);
  return `${ye}-${mo}-${da}`;
};

export const titleFromSlug = (slug) => {
  const titleString = slug
    .split("/")
    .slice(1)
    .join(" – ")
    .replace(/-/g, " ")
    .replace(/\.[^/.]+$/, "");
  return title(titleString);
};

type ThemeNavbarItem = Preset.ThemeConfig['navbar']['items'][number];
type ThemeFooterLink = Preset.ThemeConfig['footer']['links'][number];
type ThemeSidebarItem = SidebarItemConfig;

type TinaNavbarItem = {
  label: string;

  position?: ThemeNavbarItem['position'];

  link?: 'external' | 'blog' | 'page' | 'doc';
  externalLink?: string; // populated when link === 'external'
  pageLink?: string; // populated when link === 'page'
  docLink?: string; // populated when link === 'doc'

  items?: TinaNavbarItem[];
};
type TinaFooterItem = {
  label?: string;
  to?: string;
  href?: string;

  // [start] when item is a group
  title?: string;
  items?: TinaFooterItem[];
  // [end] when item is a group
};
type TinaSidebarItem = {
  label?: string;
  title?: string;
  _template: 'doc' | 'category' | 'link';

  // when _template === 'doc'
  document?: string;

  // when _template === 'category'
  link?: 'none' | 'doc' | 'generated';
  docLink?: string;

  // when _template === 'link'
  href?: string;

  items?: TinaSidebarItem[];
};

export const getDocId = (doc: TinaNavbarItem['docLink']) => {
  return doc
    .replace(/\.mdx?$/, '')
    .split('/')
    .slice(1)
    .join('/');
};

export const getDocPath = (doc: string) => {
  return doc.replace(/\.mdx?$/, '');
};

export const getPageRoute = (page: TinaNavbarItem['pageLink']) => {
  return page
    .replace(/\.mdx?$/, '')
    .split('/')
    .slice(2)
    .join('/');
};

export const getPath = (page: string) => {
  return page.replace(/\.mdx?$/, '');
};

export const formatNavbarItem = (
  item: TinaNavbarItem,
  subnav = false
): ThemeNavbarItem => {
  let navItem: ThemeNavbarItem = {
    label: item.label,
  };

  if (!subnav) {
    navItem.position = item.position;
  }

  if (item.link === 'external' && item.externalLink) {
    navItem.href = item.externalLink;
  }

  if (item.link === 'blog') {
    navItem.to = '/blog';
  }

  if (item.link === 'page' && item.pageLink) {
    navItem.to = getPageRoute(item.pageLink);
  }

  if (item.link === 'doc' && item.docLink) {
    navItem.type = 'doc';
    navItem.docId = getDocId(item.docLink);
  }

  if (item.items) {
    navItem.type = 'dropdown';
    navItem.items = item.items.map((subItem) => {
      return formatNavbarItem(subItem, true);
    });
  }

  return navItem;
};

export const formatFooterItem = (item: TinaFooterItem): ThemeFooterLink => {
  if (item.title) {
    return {
      title: item.title,
      items: item.items.map((subItem) => {
        return formatFooterItem(subItem);
      }),
    };
  } else {
    let linkObject: ThemeFooterLink = {
      label: item.label,
    };

    if (item.to) {
      linkObject.to = getPath(item.to);
    } else if (item.href) {
      linkObject.href = item.href;
    } else {
      linkObject.to = '/blog';
    }

    return linkObject;
  }
};

export const formatSidebarItem = (item: TinaSidebarItem): ThemeSidebarItem[] => {
  const type = item['_template'];

  let itemProps: Record<string, any> = {
    type: type,
  };

  if (type === 'doc') {
    if (!item.document) {
      return [];
    }

    itemProps.id = getDocId(item.document);

    if (item.label) {
      itemProps.label = item.label;
    }
  }

  if (type === 'category') {
    if (item.title) {
      itemProps.label = item.title;
    }

    if (item.link && item.link !== 'none') {
      if (item.link === 'doc' && item.docLink) {
        itemProps.link = {
          type: 'doc',
          id: getDocId(item.docLink),
        };
      } else if (item.link === 'generated') {
        itemProps.link = {
          type: 'generated-index',
        };
      } else {
        return [];
      }
    }

    itemProps.items = item.items.flatMap((item) => {
      return formatSidebarItem(item);
    });
  }

  if (type === 'link') {
    if (item.href && item.title) {
      itemProps.label = item.title;
      itemProps.href = item.href;
    } else {
      return [];
    }
  }

  return [itemProps];
};

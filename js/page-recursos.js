import { trackEvent } from './tracking.js';

const isArticle = window.location.pathname.startsWith('/recursos/') && window.location.pathname !== '/recursos/';

trackEvent(isArticle ? 'view_article' : 'view_resources', isArticle
  ? { content_type: 'article', article_path: window.location.pathname }
  : { content_type: 'resource_hub' });

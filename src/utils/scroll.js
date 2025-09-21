export const getScrollContainer = () => {
  if (typeof document === 'undefined') {
    return null;
  }

  return document.getElementById('main-content');
};

const getScrollPaddingTop = (container) => {
  if (!container || typeof window === 'undefined') {
    return 0;
  }

  try {
    const computed = window.getComputedStyle(container);
    const value = computed?.scrollPaddingTop || computed?.scrollPadding || '0';
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch (error) {
    return 0;
  }
};

export const scrollToTop = (behavior = 'smooth') => {
  if (typeof window === 'undefined') {
    return false;
  }

  const container = getScrollContainer();

  if (container) {
    container.scrollTo({ top: 0, behavior });
    return true;
  }

  window.scrollTo({ top: 0, behavior });
  return true;
};

export const scrollElementIntoView = (element, { behavior = 'smooth' } = {}) => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (!element) {
    return false;
  }

  const container = getScrollContainer();

  if (container) {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const scrollPaddingTop = getScrollPaddingTop(container);
    const targetTop = container.scrollTop + (elementRect.top - containerRect.top) - scrollPaddingTop;
    container.scrollTo({ top: Math.max(targetTop, 0), behavior });
    return true;
  }

  const offset = window.innerWidth < 900 ? 120 : 160;
  const targetTop = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: Math.max(targetTop, 0), behavior });
  return true;
};

export const scrollToHash = (hash, options) => {
  if (typeof document === 'undefined') {
    return false;
  }

  if (!hash) {
    return false;
  }

  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!id) {
    return false;
  }

  const element = document.getElementById(id);
  if (!element) {
    return false;
  }

  return scrollElementIntoView(element, options);
};

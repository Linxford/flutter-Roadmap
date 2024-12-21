const FALLBACK_ICON = '/assets/icons/default.png';
const IMAGE_CACHE = new Map();

export const imageUrls = {
  dashboard: '/assets/icons/dashboard.png',
  feedback: '/assets/icons/feedback.png',
  resources: '/assets/icons/resources.png',
  analytics: '/assets/icons/analytics.png',
  users: '/assets/icons/users.png',
  profile: '/assets/icons/profile.png',
  logout: '/assets/icons/logout.png',
  search: '/assets/icons/search.png',
  upload: '/assets/icons/upload.png',
  edit: '/assets/icons/edit.png',
  delete: '/assets/icons/delete.png',
  add: '/assets/icons/add.png'
};

export const getIcon = (name) => {
  return imageUrls[name] || FALLBACK_ICON;
};

export const preloadImages = () => {
  Object.values(imageUrls).forEach(url => {
    if (!IMAGE_CACHE.has(url)) {
      const img = new Image();
      img.src = url;
      IMAGE_CACHE.set(url, img);
    }
  });
};

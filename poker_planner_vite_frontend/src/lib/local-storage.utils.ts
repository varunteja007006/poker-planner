export const clearLocalStorage = (): void => {
  localStorage.clear();
};

export const performReset = (): void => {
  clearLocalStorage();
  window.location.href = "/";
};

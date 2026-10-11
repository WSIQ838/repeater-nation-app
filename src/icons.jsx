// Line icons (24 px grid), shared by the tab bar, lists and tools.
const P = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  tower: '<path d="M12 12v9M8 21l4-9 4 9M9 8a4 4 0 0 1 6 0M6.5 5.5a8 8 0 0 1 11 0"/><circle cx="12" cy="10.5" r="1"/>',
  cal: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-4-6.3"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  nav: '<path d="M3 11l19-9-9 19-2-8z"/>',
  mount: '<path d="M2 20l7-13 4 7 3-4 6 10z"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  bag: '<path d="M5 8h14l-1 13H6zM9 8a3 3 0 0 1 6 0"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5L3 17.6 6.4 21l6.3-6.3a4 4 0 0 0 5-5.4l-2.5 2.5-2.7-.7-.7-2.7z"/>',
  route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H16a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h7.5"/>',
  wave: '<path d="M2 12h3l2-6 4 12 3-9 2 3h6"/>',
  book: '<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4zM4 16a4 4 0 0 1 4-4h12"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  alert: '<path d="M12 3L2 21h20zM12 10v5M12 18v.5"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  logout: '<path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H9"/>',
  music: '<path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM21 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z"/>',
  ruler: '<path d="M3 17L17 3l4 4L7 21zM8 12l2 2M11 9l2 2M14 6l2 2"/>',
  zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  pin: '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  binary: '<path d="M4 4h3v6H4zM12 4h4v6h-4zM4 14h5v6H4zM13 14h2v6h-2z"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
};
export function Icon({ name, size = 22 }) {
  return (
    <svg className="i" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: P[name] || "" }} />
  );
}

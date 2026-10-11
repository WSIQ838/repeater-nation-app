use tauri::{WebviewUrl, WebviewWindowBuilder};

// The app opens the real Repeater Nation site. The site refuses to be shown inside another
// page (X-Frame-Options: DENY), so shell.js is injected into every page of the window to add
// the app's tab bar and More menu on top of it.
const START_URL: &str = "https://repeaternation.com/dashboard";
const SHELL_JS: &str = include_str!("../shell.js");

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let url = START_URL.parse().expect("the start address is valid");
            #[allow(unused_mut)]
            let mut window = WebviewWindowBuilder::new(app, "main", WebviewUrl::External(url))
                .initialization_script(SHELL_JS);
            #[cfg(desktop)]
            {
                window = window.title("Repeater Nation").inner_size(1180.0, 760.0);
            }
            window.build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Repeater Nation");
}

// The app's screens are the bundled front end in ../dist (built from src/). The window is
// described in tauri.conf.json. The opener plugin sends links to the system browser; the deep-link plugin
// brings the app back to the front after a Google, Facebook, Apple or Microsoft sign-in.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .run(tauri::generate_context!())
        .expect("error while running Repeater Nation");
}

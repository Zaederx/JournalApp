export function activateLoader(loader:HTMLDivElement) {
    loader.className = 'loader'
}

export function deactivateLoader(loader:HTMLDivElement) {
    loader.className = ''
}
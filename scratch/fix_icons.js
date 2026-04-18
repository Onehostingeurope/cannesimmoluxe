import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedFiles = 0;

walkDir('./src', function(filePath) {
    if(filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let initial = content;
        
        // 1: Add notranslate to material-symbols class
        content = content.replace(/className="([^"]*)material-symbols-outlined([^"]*)"/g, (match, prefix, suffix) => {
             // Avoid adding it twice if it miraculously has it
             if (match.includes('notranslate')) return match;
             return `className="${prefix}material-symbols-outlined notranslate${suffix}"`;
        });

        // 2: Force translate="no" onto the spans that have material-symbols
        // A simple regex might be tricky if attributes are spread out, but we can target the opening span:
        content = content.replace(/(<span[^>]*class(?:Name)?="[^"]*material-symbols-outlined[^"]*"[^>]*)>/g, (match) => {
             if (match.includes('translate="no"')) return match;
             // Inject it right before the closing >
             return match.slice(0, -1) + ' translate="no">';
        });

        if (content !== initial) {
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedFiles++;
            console.log(`Patched: ${filePath}`);
        }
    }
});

console.log(`\nOperation Complete. Total files patched: ${modifiedFiles}`);

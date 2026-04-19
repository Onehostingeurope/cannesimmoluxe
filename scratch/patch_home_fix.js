import fs from 'fs';

const file = 'src/pages/Home.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { useTranslation } from 'react-i18next';", "");
content = content.replace("const { i18n } = useTranslation();", "const [currentLang, setCurrentLang] = useState('en');\n  useEffect(() => {\n    const match = document.cookie.match(/googtrans=\\/[a-zA-Z]{2}\\/([a-zA-Z]{2})/);\n    if (match && match[1]) setCurrentLang(match[1]);\n  }, []);");
content = content.replace("i18n.language === 'fr'", "currentLang === 'fr'");

fs.writeFileSync(file, content);
console.log("Successfully patched Home to use native cookies instead of i18next!");

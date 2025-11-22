import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
];

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-2 py-1 mb-1">
                {t('language.select')}
              </div>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
                    i18n.language === language.code ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-xs text-gray-500">{language.name}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

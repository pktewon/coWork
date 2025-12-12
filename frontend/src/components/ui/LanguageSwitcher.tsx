import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('ko') ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="font-medium min-w-[3rem]"
    >
      {i18n.language.startsWith('ko') ? 'KR' : 'EN'}
    </Button>
  );
}

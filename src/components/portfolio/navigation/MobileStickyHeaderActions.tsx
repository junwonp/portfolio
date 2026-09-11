'use client';

import { Check, Ellipsis, Printer, Share2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import IconLink from '@/components/ui/IconLink';
import Github from '@/components/ui/icon/Github';
import Linkedin from '@/components/ui/icon/Linkedin';
import { circleButton, pillButton } from '@/components/ui/surface.css';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useLocale } from '@/lib/contexts/LocaleContext';

import * as styles from './MobileStickyHeader.css';

const MORE_MENU_ID = 'more-actions-menu';

interface Props {
  githubLink?: string;
  linkedinLink?: string;
  name: string;
}

export default function MobileStickyHeaderActions({ githubLink, linkedinLink, name }: Props) {
  const { locale, labels, setLocale } = useLocale();
  // The theme toggle is a home-page-only control (`/`, `/en`, `/ko`)
  const pathname = usePathname();
  const isHome = pathname === '/' || /^\/[a-z]{2}$/.test(pathname);

  const [errorMessage, setErrorMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMenu = () => menuRef.current?.hidePopover();

  // Positioned from the button rect because Firefox mis-resolves anchor positioning.
  const positionMenu = () => {
    const menu = menuRef.current;
    const anchor = menuButtonRef.current;
    if (!menu || !anchor) return;
    const rect = anchor.getBoundingClientRect();
    menu.style.setProperty('--menu-top', `${rect.bottom + 8}px`);
    menu.style.setProperty('--menu-right', `${window.innerWidth - rect.right}px`);
  };

  const toggleLanguage = () => {
    setErrorMessage('');
    try {
      const newLang = locale === 'ko' ? 'en' : 'ko';
      setLocale(newLang);
    } catch {
      setErrorMessage(labels.languageToggleError);
    }
  };

  async function sharePage(): Promise<void> {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const title = `${name} | ${labels.resumeTitle}`;

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ text: '', title, url: shareUrl });
        closeMenu();
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }

  return (
    <div className={styles.actions}>
      <div className={`${styles.langToggleWrapper} ${styles.pcOnly}`}>
        <button
          className={`${styles.langToggle} ${pillButton} glass-effect`}
          type="button"
          onClick={toggleLanguage}
          title={labels.toggleLanguage}
        >
          {locale === 'ko' ? 'English' : '한국어'}
        </button>
      </div>

      <div className={`${styles.actionGroup} glass-effect`}>
        <button
          className={`${styles.langToggleBtn} ${circleButton} ${styles.mobileOnly}`}
          type="button"
          onClick={toggleLanguage}
          aria-label={labels.toggleLanguage}
          title={labels.toggleLanguage}
        >
          {locale === 'ko' ? 'EN' : 'KO'}
        </button>

        {githubLink && (
          <IconLink href={githubLink} title={labels.goToGithubPage} type="github">
            <Github width={20} height={20} />
          </IconLink>
        )}

        <div className={styles.moreMenuContainer}>
          <button
            ref={menuButtonRef}
            className={`${styles.moreButton} ${circleButton}`}
            type="button"
            onClick={positionMenu}
            popoverTarget={MORE_MENU_ID}
            aria-label="More actions"
            aria-controls={MORE_MENU_ID}
            aria-expanded={isMenuOpen}
          >
            <Ellipsis size={20} />
          </button>

          <div
            id={MORE_MENU_ID}
            ref={menuRef}
            popover="auto"
            className={styles.dropdownMenu}
            onToggle={(event) => {
              setIsMenuOpen(event.newState === 'open');
            }}
          >
            {isHome && (
              <>
                <ThemeToggle
                  autoLabel={labels.themeAuto}
                  lightLabel={labels.themeLight}
                  darkLabel={labels.themeDark}
                  className={styles.dropdownItem}
                  iconSize={16}
                  onToggle={closeMenu}
                />
                <hr className={styles.menuDivider} />
              </>
            )}

            <button className={styles.dropdownItem} type="button" onClick={sharePage}>
              {isCopied ? (
                <>
                  <Check size={16} />
                  <span>{labels.linkCopied}</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span>{labels.sharePage}</span>
                </>
              )}
            </button>

            <hr className={styles.menuDivider} />

            <button
              className={styles.dropdownItem}
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.print();
                closeMenu();
              }}
            >
              <Printer size={16} />
              <span>{labels.printPage}</span>
            </button>

            {linkedinLink && (
              <>
                <hr className={styles.menuDivider} />
                <a
                  className={styles.dropdownItem}
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                >
                  <Linkedin width={16} height={16} />
                  <span>{labels.goToLinkedinPage}</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      {errorMessage && (
        <span className={styles.error} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
}

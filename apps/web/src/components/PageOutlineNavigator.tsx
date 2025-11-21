import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Navigation24Regular, Dismiss24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  outlineList: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '4px',
  },
  outlineItem: {
    padding: '8px 12px',
    borderRadius: tokens.borderRadiusSmall,
    cursor: 'pointer',
    fontSize: tokens.fontSizeBase300,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  activeItem: {
    backgroundColor: tokens.colorBrandBackground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  h1: {
    paddingLeft: '0px',
    fontWeight: tokens.fontWeightSemibold,
  },
  h2: {
    paddingLeft: '16px',
  },
  h3: {
    paddingLeft: '32px',
  },
  h4: {
    paddingLeft: '48px',
  },
  h5: {
    paddingLeft: '64px',
  },
  h6: {
    paddingLeft: '80px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 16px',
    color: tokens.colorNeutralForeground3,
  },
});

interface HeadingItem {
  id: string;
  level: number;
  text: string;
  element: HTMLElement;
}

interface PageOutlineNavigatorProps {
  open: boolean;
  onClose: () => void;
  contentSelector?: string;
}

export function PageOutlineNavigator({
  open,
  onClose,
  contentSelector = '.editor-content',
}: PageOutlineNavigatorProps) {
  const styles = useStyles();
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) return;

    const headingElements = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingItems: HeadingItem[] = [];

    headingElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      const level = parseInt(element.tagName.substring(1));
      const text = htmlElement.textContent || '';
      const id = htmlElement.id || `heading-${index}`;

      if (!htmlElement.id) {
        htmlElement.id = id;
      }

      headingItems.push({
        id,
        level,
        text,
        element: htmlElement,
      });
    });

    setHeadings(headingItems);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
      }
    );

    headingElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [open, contentSelector]);

  const scrollToHeading = (heading: HeadingItem) => {
    heading.element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setActiveId(heading.id);
  };

  const getLevelClass = (level: number) => {
    switch (level) {
      case 1:
        return styles.h1;
      case 2:
        return styles.h2;
      case 3:
        return styles.h3;
      case 4:
        return styles.h4;
      case 5:
        return styles.h5;
      case 6:
        return styles.h6;
      default:
        return styles.h1;
    }
  };

  return (
    <Drawer open={open} onOpenChange={(_, { open }) => !open && onClose()} position="end">
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              icon={<Dismiss24Regular />}
              onClick={onClose}
            />
          }
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation24Regular />
            Page Outline
          </div>
        </DrawerHeaderTitle>
      </DrawerHeader>

      <DrawerBody>
        {headings.length === 0 ? (
          <div className={styles.emptyState}>
            <Navigation24Regular style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>No headings found</div>
            <div style={{ fontSize: tokens.fontSizeBase200, marginTop: '8px' }}>
              Add headings to your page to see the outline
            </div>
          </div>
        ) : (
          <div className={styles.outlineList}>
            {headings.map((heading) => (
              <div
                key={heading.id}
                className={`${styles.outlineItem} ${getLevelClass(heading.level)} ${
                  activeId === heading.id ? styles.activeItem : ''
                }`}
                onClick={() => scrollToHeading(heading)}
              >
                {heading.text}
              </div>
            ))}
          </div>
        )}
      </DrawerBody>
    </Drawer>
  );
}

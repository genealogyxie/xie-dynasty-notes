import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Home24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    padding: '8px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

interface BreadcrumbItem {
  id: string;
  label: string;
  type: 'workspace' | 'notebook' | 'section' | 'page';
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (item: BreadcrumbItem) => void;
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  const styles = useStyles();

  const handleNavigate = (item: BreadcrumbItem) => {
    if (onNavigate) {
      onNavigate(item);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbButton icon={<Home24Regular />} onClick={() => handleNavigate(items[0])}>
            Home
          </BreadcrumbButton>
        </BreadcrumbItem>
        {items.map((item, index) => (
          <BreadcrumbItem key={item.id}>
            <BreadcrumbDivider />
            <BreadcrumbButton
              onClick={() => handleNavigate(item)}
              current={index === items.length - 1}
            >
              {item.label}
            </BreadcrumbButton>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </div>
  );
}

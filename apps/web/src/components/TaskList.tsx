import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Checkbox,
  Input,
  Button,
} from '@fluentui/react-components';
import { Add24Regular, Delete24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    padding: '16px',
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    borderRadius: tokens.borderRadiusSmall,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  taskText: {
    flex: 1,
  },
  completedTask: {
    textDecoration: 'line-through',
    color: tokens.colorNeutralForeground3,
  },
  addTaskContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  progressBar: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  progressText: {
    fontSize: tokens.fontSizeBase200,
    marginBottom: '8px',
  },
  progressBarTrack: {
    height: '8px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusLarge,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: tokens.colorBrandBackground,
    transition: 'width 0.3s ease',
  },
});

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskListProps {
  tasks?: Task[];
  onTasksChange?: (tasks: Task[]) => void;
  showProgress?: boolean;
}

export function TaskList({ tasks: initialTasks = [], onTasksChange, showProgress = true }: TaskListProps) {
  const styles = useStyles();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskText, setNewTaskText] = useState('');

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    if (onTasksChange) {
      onTasksChange(updatedTasks);
    }
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setNewTaskText('');
      if (onTasksChange) {
        onTasksChange(updatedTasks);
      }
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    if (onTasksChange) {
      onTasksChange(updatedTasks);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={styles.container}>
      {tasks.map((task) => (
        <div key={task.id} className={styles.taskItem}>
          <Checkbox
            checked={task.completed}
            onChange={() => handleToggleTask(task.id)}
          />
          <span className={task.completed ? styles.completedTask : styles.taskText}>
            {task.text}
          </span>
          <Button
            appearance="subtle"
            icon={<Delete24Regular />}
            onClick={() => handleDeleteTask(task.id)}
            size="small"
          />
        </div>
      ))}

      <div className={styles.addTaskContainer}>
        <Input
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(_, data) => setNewTaskText(data.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1 }}
        />
        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={handleAddTask}
        >
          Add
        </Button>
      </div>

      {showProgress && totalCount > 0 && (
        <div className={styles.progressBar}>
          <div className={styles.progressText}>
            {completedCount} of {totalCount} tasks completed ({Math.round(progressPercentage)}%)
          </div>
          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

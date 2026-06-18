import { Dashboard } from './components/Dashboard.tsx';
import { WelcomeScreen } from './components/WelcomeScreen.tsx';
import { useTasks } from './hooks/useTasks.ts';
import { useTheme } from './hooks/useTheme.ts';
import { useAuth } from './hooks/useAuth.ts';

function App() {
  const auth = useAuth();
  const { tasks, routines, addTask, updateTask, deleteTask, addRoutine, updateRoutine, deleteRoutine } =
    useTasks(auth.user?.id);
  const { theme, toggleTheme } = useTheme();

  if (!auth.ready) {
    return <div className="av-boot" />;
  }

  if (!auth.user) {
    return <WelcomeScreen theme={theme} onToggleTheme={toggleTheme} auth={auth} />;
  }

  return (
    <Dashboard
      tasks={tasks}
      routines={routines}
      theme={theme}
      onToggleTheme={toggleTheme}
      onAddTask={addTask}
      onUpdateTask={updateTask}
      onDeleteTask={deleteTask}
      onAddRoutine={addRoutine}
      onUpdateRoutine={updateRoutine}
      onDeleteRoutine={deleteRoutine}
    />
  );
}

export default App;

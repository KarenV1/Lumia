import { useEffect } from 'react';
import { Dashboard } from './components/Dashboard.tsx';
import { WelcomeScreen } from './components/WelcomeScreen.tsx';
import { useTasks } from './hooks/useTasks.ts';
import { useTheme } from './hooks/useTheme.ts';
import { useAuth } from './hooks/useAuth.ts';
import { storage } from './utils/storage.ts';
import { timeHelper } from './utils/timeHelper.ts';

function App() {
  const { tasks, routines, addTask, updateTask, deleteTask, addRoutine, updateRoutine, deleteRoutine } =
    useTasks();
  const { theme, toggleTheme } = useTheme();
  const auth = useAuth();

  useEffect(() => {
    const storedTasks = storage.getTasks();
    const storedRoutines = storage.getRoutines();

    if (storedTasks.length === 0 && storedRoutines.length === 0) {
      initializeSampleData();
    }
  }, []);

  const initializeSampleData = () => {
    const today = timeHelper.getDateString();
    const tomorrow = timeHelper.getDateString(new Date(Date.now() + 24 * 60 * 60 * 1000));

    const sampleRoutines = [
      {
        id: '1',
        name: 'Dormir',
        startTime: '23:00',
        endTime: '07:00',
        daysOfWeek: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] as const,
        color: 'var(--lavanda)',
        active: true,
        icon: 'moon',
        frequency: { type: 'daily' as const },
      },
      {
        id: '2',
        name: 'Tomar agua',
        startTime: '08:00',
        endTime: '22:00',
        daysOfWeek: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] as const,
        color: 'var(--azul)',
        active: true,
        icon: 'droplet',
        frequency: { type: 'interval' as const, everyMinutes: 180, from: '08:00', to: '22:00' },
      },
      {
        id: '3',
        name: 'Clases',
        startTime: '10:00',
        endTime: '12:00',
        daysOfWeek: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'] as const,
        color: 'var(--beige)',
        active: true,
        icon: 'book',
        frequency: {
          type: 'weekly' as const,
          days: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'] as const,
        },
      },
    ];

    const sampleTasks = [
      {
        id: '101',
        title: 'Trabajo creativo',
        description: 'Diseño de presentación',
        date: today,
        startTime: '09:00',
        endTime: '11:00',
        urgency: 'media' as const,
        status: 'pendiente' as const,
        hasReminder: true,
      },
      {
        id: '102',
        title: 'Proyecto urgente',
        description: 'Completar presentación del proyecto',
        date: today,
        startTime: '14:00',
        endTime: '16:00',
        urgency: 'alta' as const,
        status: 'pendiente' as const,
        hasReminder: true,
      },
      {
        id: '103',
        title: 'Leer documentación',
        description: 'Revisar los documentos del curso',
        date: today,
        startTime: '18:30',
        endTime: '19:30',
        urgency: 'baja' as const,
        status: 'pendiente' as const,
        hasReminder: true,
      },
      {
        id: '104',
        title: 'Entrega de proyecto',
        description: 'Entregar el informe final',
        date: tomorrow,
        startTime: '09:00',
        endTime: '11:00',
        urgency: 'urgente' as const,
        status: 'pendiente' as const,
        hasReminder: true,
      },
    ];

    storage.saveRoutines(sampleRoutines as any);
    storage.saveTasks(sampleTasks);
    window.location.reload();
  };

  // Esperamos a saber si hay sesión para no parpadear entre pantallas
  if (!auth.ready) {
    return <div className="av-boot" />;
  }

  // Sin sesión: pantalla de bienvenida con acceso integrado.
  // Al autenticarse, auth.user cambia y entramos a la app.
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

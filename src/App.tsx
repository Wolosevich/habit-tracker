import { useState, useRef } from "react";
import "@mantine/core/styles.css";
import {
  MantineProvider,
  createTheme,
  Title,
  Text,
  Container,
  Stack,
  Paper,
  Divider,
  Modal,
  Button,
  Group,
} from "@mantine/core";
import { IconDownload, IconUpload } from "@tabler/icons-react";
import { downloadHabits, readHabitsFromFile } from "./lib/backup";
import { useHabits } from "./hooks/useHabits";
import { HabitForm } from "./components/HabitForm";
import { HabitCard } from "./components/HabitCard";
import type { Habit, NewHabit } from "./types/habit";

const theme = createTheme({});

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <AppContent />
    </MantineProvider>
  );
}

function AppContent() {
  const {
    habits,
    addHabit,
    removeHabit,
    toggleToday,
    updateHabit,
    importHabits,
  } = useHabits();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Состояния для модалок
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  const handleUpdate = (data: NewHabit) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, data);
      setEditingHabit(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingHabit) {
      removeHabit(deletingHabit.id);
      setDeletingHabit(null);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imported = await readHabitsFromFile(file);
      importHabits(imported);
      alert("Данные успешно загружены!");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Container size="sm" py="xl">
      {/* Группа с заголовком и кнопками экспорта/импорта */}
      <Group justify="space-between" align="flex-end" mt="sm" mb="lg">
        <div>
          <Title order={1}>Трекер привычек</Title>
          <Text c="dimmed" mt="sm">
            Отслеживайте свои ежедневные привычки.
          </Text>
        </div>
        <Group gap="xs">
          <Button
            variant="light"
            size="xs"
            leftSection={<IconDownload size={16} />}
            onClick={() => downloadHabits(habits)}
          >
            Экспорт
          </Button>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconUpload size={16} />}
            onClick={() => fileInputRef.current?.click()}
          >
            Импорт
          </Button>
          {/* Скрытый инпут для выбора файла */}
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImport}
          />
        </Group>
      </Group>

      <Paper withBorder p="md" mt="lg" radius="md">
        <HabitForm onSubmit={addHabit} />
      </Paper>

      <Divider my="xl" />

      <Stack>
        {habits.length === 0 ? (
          <Text c="dimmed" ta="center">
            Пока нет привычек. Добавьте первую!
          </Text>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggleToday={toggleToday}
              onEdit={setEditingHabit}
              onRemove={() => setDeletingHabit(habit)}
            />
          ))
        )}
      </Stack>

      {/* Модалка редактирования */}
      <Modal
        opened={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        title="Редактировать привычку"
      >
        {editingHabit && (
          <HabitForm
            initialValues={editingHabit}
            submitLabel="Сохранить изменения"
            onSubmit={handleUpdate}
          />
        )}
      </Modal>

      {/* Модалка подтверждения удаления */}
      <Modal
        opened={!!deletingHabit}
        onClose={() => setDeletingHabit(null)}
        title="Удалить привычку?"
        size="sm"
      >
        <Text mb="lg">
          Вы уверены, что хотите удалить <b>{deletingHabit?.name}</b>? Вся
          история отметок будет потеряна.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setDeletingHabit(null)}>
            Отмена
          </Button>
          <Button color="red" onClick={handleConfirmDelete}>
            Удалить
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}

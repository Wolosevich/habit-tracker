import { useState } from "react";
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
  const { habits, addHabit, removeHabit, toggleToday, updateHabit } =
    useHabits();

  // Состояния для модалок
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  const handleUpdate = (data: NewHabit) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, data);
      setEditingHabit(null); // Закрываем модалку
    }
  };

  const handleConfirmDelete = () => {
    if (deletingHabit) {
      removeHabit(deletingHabit.id);
      setDeletingHabit(null); // Закрываем модалку
    }
  };

  return (
    <Container size="sm" py="xl">
      <Title order={1}>Трекер привычек</Title>
      <Text c="dimmed" mt="sm">
        Отслеживайте свои ежедневные привычки.
      </Text>

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
              onEdit={setEditingHabit} // Открываем модалку редактирования
              onRemove={() => setDeletingHabit(habit)} // Открываем модалку удаления
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

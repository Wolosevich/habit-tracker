import '@mantine/core/styles.css';
import { MantineProvider, createTheme, Title, Text, Container } from '@mantine/core';

const theme = createTheme({});

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Container size="sm" py="xl">
        <Title order={1}>Трекер привычек</Title>
        <Text c="dimmed" mt="sm">
          Каркас приложения готов. Скоро здесь появятся привычки.
        </Text>
      </Container>
    </MantineProvider>
  );
}
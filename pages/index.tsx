import { Container, Stack } from "@mantine/core";
import type { NextPage } from "next";
import { Content } from "../src/components/content";
import { Footer } from "../src/components/footer";
import { Header } from "../src/components/header";

const Home: NextPage = () => {
  return (
    <Container size="lg" py="lg">
      <Stack spacing="lg">
        <Header />
        <Content />
        <Footer />
      </Stack>
    </Container>
  );
};

export default Home;

import { Anchor, Stack, Text, Title } from "@mantine/core";
import { useAnalytics } from "../contexts/analytics";

export const Header = () => {
  const analytics = useAnalytics();

  return (
    <Stack spacing="lg">
      <Title order={1} align="center">
        Generador de figuritas del mundial Qatar 2022
      </Title>
      <Text align="center">
        Hecho por{" "}
        <Anchor
          href="https://twitter.com/DuranCristhian"
          target="_blank"
          onClick={() => {
            analytics.track("twitter-click");
          }}
        >
          @durancristhian
        </Anchor>
      </Text>
    </Stack>
  );
};

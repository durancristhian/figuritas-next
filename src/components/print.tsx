import { Box, Button, FileInput, Stack, Text, Title } from "@mantine/core";
import { IconDownload } from "@tabler/icons";
import chunk from "lodash.chunk";
import { MouseEvent, useMemo, useState } from "react";
import { useAnalytics } from "../contexts/analytics";

export const Print = () => {
  const analytics = useAnalytics();
  const [inProgress, setInProgress] = useState(false);
  const [images, onImagesChange] = useState<File[]>();

  const pages = useMemo(() => chunk(images, 16), [images]);

  const generatePdfFromImages = async (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    try {
      event.preventDefault();

      if (!images || !images.length) {
        analytics.track("generate-pdf-error", {
          message: "No images",
        });

        return;
      }

      setInProgress(true);

      analytics.track("generate-pdf-click");

      /* TODO: */

      analytics.track("generate-pdf-success", {
        pages: pages.length,
        stickers: images.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        analytics.track("generate-pdf-error", {
          message: error.message,
        });
      }
    } finally {
      setInProgress(false);
    }
  };

  return (
    <Stack spacing="lg">
      <Title order={3} align="center">
        Seleccioná las figuritas que descargaste para generar un PDF
      </Title>
      <FileInput
        label="Figuritas"
        description="Entran 16 por página."
        placeholder="Elige las figuritas"
        multiple
        value={images}
        onChange={(payload) => {
          if (payload) {
            onImagesChange(payload);
          }
        }}
        disabled={inProgress}
      />
      <Text>
        Este archivo que podés bajar te permite ir a una gráfica a imprimir tus
        figuritas en papel autoadhesivo.
      </Text>
      <Box sx={{ textAlign: "center" }}>
        <Button
          onClick={generatePdfFromImages}
          disabled={!images || !images.length || inProgress}
          color="green"
          leftIcon={<IconDownload />}
        >
          {inProgress ? "Laburanding..." : "Bajar PDF"}
        </Button>
      </Box>
    </Stack>
  );
};

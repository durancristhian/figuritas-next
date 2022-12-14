import { Box, Button, FileInput, Stack, Text, Title } from "@mantine/core";
import { IconDownload } from "@tabler/icons";
import download from "downloadjs";
import chunk from "lodash.chunk";
import { MouseEvent, useMemo, useState } from "react";
import { useAnalytics } from "../contexts/analytics";

export const Print = () => {
  const analytics = useAnalytics();
  const [inProgress, setInProgress] = useState(false);
  const [images, onImagesChange] = useState<File[]>();

  const pages = useMemo(() => chunk(images, 16), [images]);

  const onResetForm = () => {
    onImagesChange([]);
  };

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

      const formData = new FormData();

      images.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch("/api/print", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Response is not ok");
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();

      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        chunks.push(value);
      }

      const blob = new Blob(chunks);

      download(blob, "print.pdf");

      onResetForm();

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
        Seleccion?? las figuritas que descargaste para generar un PDF
      </Title>
      <FileInput
        label="Figuritas"
        description="Entran 16 por p??gina."
        placeholder="Elige las figuritas"
        multiple
        value={images}
        onChange={onImagesChange}
        disabled={inProgress}
      />
      <Text>
        Este archivo que pod??s bajar te permite ir a una gr??fica a imprimir tus
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

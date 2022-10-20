import {
  Anchor,
  Box,
  Button,
  Card,
  FileInput,
  Grid,
  NativeSelect,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconDownload } from "@tabler/icons";
import dayjs from "dayjs";
import download from "downloadjs";
import filenamify from "filenamify";
import { MouseEvent, useState } from "react";
import { Person } from "../../types/person";
import { COUNTRIES } from "../constants/countries";
import { useAnalytics } from "../contexts/analytics";
import { Sticker } from "./sticker";

const DEFAULT_COUNTRY: Person["country"] = "arg";
const DEFAULT_BIRTHDAY = new Date(1997, 5, 4);
const DEFAULT_POSITION: Person["position"] = "goalkeeper";

export const Generator = () => {
  const analytics = useAnalytics();
  const [name, onNameChange] = useState("");
  const [country, onCountryChange] = useState(DEFAULT_COUNTRY);
  const [birthday, onBirthdayChange] = useState<Date | null>(DEFAULT_BIRTHDAY);
  const [position, onPositionChange] =
    useState<Person["position"]>(DEFAULT_POSITION);
  const [image, onImageChange] = useState<File | null>();
  const [inProgress, setInProgress] = useState(false);

  const onResetForm = () => {
    onNameChange("");
    onCountryChange(DEFAULT_COUNTRY);
    onBirthdayChange(DEFAULT_BIRTHDAY);
    onPositionChange(DEFAULT_POSITION);
    onImageChange(null);
  };

  const disableActions = !name || !birthday || !image;

  const cardId = filenamify(name).toLocaleLowerCase();

  const onDownloadClick = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();

      setInProgress(true);

      analytics.track("download-card-click", { id: cardId });

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", image || "");
      cloudinaryFormData.append("upload_preset", "figuritas");

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/cristhianjavierduran/image/upload",
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      );

      const cloudinaryImage = await cloudinaryResponse.json();

      const response = await fetch("/api/sticker", {
        method: "POST",
        body: JSON.stringify({
          birthday: dayjs(birthday).format("D/MMM"),
          country,
          id: cardId,
          image: cloudinaryImage.secure_url,
          name,
          position,
        }),
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

      download(blob, `${cardId}.png`);

      onResetForm();

      analytics.track("download-card-success", { id: cardId });
    } catch (error) {
      if (error instanceof Error) {
        analytics.track("download-card-error", {
          id: cardId,
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
        Completá la siguiente información para poder descargar tu figurita
      </Title>
      <Grid>
        <Grid.Col md="auto">
          <Stack spacing="lg">
            <TextInput
              label="Nombre"
              description="Recomendado que no supere los 14 carácteres."
              placeholder="Agustin Cruz"
              value={name}
              onChange={(event) => {
                onNameChange(event.target.value);
              }}
            />
            <NativeSelect
              data={COUNTRIES}
              description="Aparecen todos los países del mundial + los de Conmebol."
              placeholder="Argentina"
              label="País"
              value={country}
              onChange={(event) => {
                onCountryChange(event.target.value);
              }}
            />
            <DatePicker
              label="Fecha de nacimiento"
              description="No te preocupes si naciste antes del 90, el año no se muestra."
              value={birthday}
              onChange={onBirthdayChange}
            />
            <Radio.Group
              label="Posición"
              description="En la cancha ;)"
              value={position}
              onChange={(nextPosition: Person["position"]) => {
                onPositionChange(nextPosition);
              }}
              orientation="vertical"
            >
              <Radio
                value="goalkeeper"
                label="Voy al arco y tengo el buzo de Goico."
              />
              <Radio
                value="defender"
                label="Yo defiendo y de pedo que paso al ataque."
              />
              <Radio
                value="midfielder"
                label="A mi me gusta el medio porque no defiendo bien y tampoco hago goles."
              />
              <Radio value="forward" label={`Me dicen "rompe redes" weee.`} />
            </Radio.Group>
            <FileInput
              label="Foto"
              description={
                <>
                  <Text>
                    Una que se te vea la caripela bien. Si necesitás sacarle el
                    fondo te recomiendo usar{" "}
                    <Anchor
                      href="https://www.remove.bg/upload"
                      target="_blank"
                      onClick={() => {
                        analytics.track("remove-bg-click");
                      }}
                    >
                      está página
                    </Anchor>
                    .
                  </Text>
                </>
              }
              placeholder="Elige una foto"
              value={image}
              onChange={onImageChange}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col md="content">
          <Card p="lg" withBorder>
            <Stack spacing="lg">
              <Title order={2} align="center">
                Previsualización
              </Title>
              <Sticker
                birthday={birthday ? dayjs(birthday).format("D/MMM") : ""}
                country={country}
                id={cardId}
                image={image ? URL.createObjectURL(image) : ""}
                name={name}
                position={position}
              />
              <Box sx={{ textAlign: "center" }}>
                <Button
                  onClick={onDownloadClick}
                  disabled={disableActions || inProgress}
                  color="green"
                  leftIcon={<IconDownload />}
                >
                  Bajar figu
                </Button>
              </Box>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

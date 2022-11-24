import { Box } from "@mantine/core";
import { Person } from "../../types/person";
import styles from "./sticker.module.css";

export const Sticker = ({
  birthday,
  country,
  id,
  image,
  name,
  position,
}: Person) => {
  return (
    <Box
      sx={(theme) => ({
        borderRadius: theme.radius.sm,
        overflow: "hidden",
      })}
    >
      <Box
        id={id}
        className={styles.card}
        style={{
          // @ts-ignore
          "--card-height": "9.8cm",
          "--card-width": "7cm",
          "--name-size": "0.5cm",
          "--birthday-size": "0.25cm",
          "--name-bottom": "0.8cm",
          "--birthday-bottom": "0.38cm",
          "--card-bg": `url('/sticker-template/background.jpg')`,
          "--card-information": `url('/sticker-template/pos-${position}.png')`,
          "--flag": `url('/sticker-template/flag-${country}.png')`,
          "--player-image": `url('${image}')`,
        }}
      >
        <div className={styles.background} />
        <div className={styles.playerImage} />
        <div className={styles.information} />
        <div className={styles.flag} />
        <div className={styles.name}>{name}</div>
        <div className={styles.birthday}>{birthday}</div>
      </Box>
    </Box>
  );
};

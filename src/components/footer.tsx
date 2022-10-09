import { Button, Divider, Group, Stack, Text } from "@mantine/core";
import { IconBrandPaypal, IconCoffee } from "@tabler/icons";
import { MouseEvent } from "react";
import { useAnalytics } from "../contexts/analytics";

export const Footer = () => {
  const analytics = useAnalytics();

  const onDonateCafecitoClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    analytics.track("cafecito-click");

    window.open("https://cafecito.app/durancristhian", "_blank");
  };

  const onDonatePaypalClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    analytics.track("paypal-click");

    window.open(
      "https://www.paypal.com/donate/?hosted_button_id=RS5C2FEUA9KEU ",
      "_blank"
    );
  };

  return (
    <Stack spacing="lg">
      <Divider />
      <Group position="center">
        <Text>Si te gustó este proyecto, te invito a</Text>
        <Button leftIcon={<IconCoffee />} onClick={onDonateCafecitoClick}>
          Donarme un cafecito
        </Button>
        <Text>o</Text>
        <Button leftIcon={<IconBrandPaypal />} onClick={onDonatePaypalClick}>
          Donarme en Paypal
        </Button>
      </Group>
    </Stack>
  );
};

import { Tabs } from "@mantine/core";
import { IconPlayCard, IconPrinter } from "@tabler/icons";
import { Generator } from "./generator";
import { Print } from "./print";

export const Content = () => {
  return (
    <Tabs defaultValue="create">
      <Tabs.List>
        <Tabs.Tab value="create" icon={<IconPlayCard />}>
          Crear
        </Tabs.Tab>
        <Tabs.Tab value="print" icon={<IconPrinter />}>
          Imprimir
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="create" pt="lg">
        <Generator />
      </Tabs.Panel>
      <Tabs.Panel value="print" pt="lg">
        <Print />
      </Tabs.Panel>
    </Tabs>
  );
};

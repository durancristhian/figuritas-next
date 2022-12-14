export const COUNTRIES = [
  { value: "arg", label: "Argentina" },
  { value: "aus", label: "Australia" },
  { value: "bel", label: "Bélgica" },
  { value: "bol", label: "Bolivia" },
  { value: "bra", label: "Brazil" },
  { value: "can", label: "Canada" },
  { value: "chi", label: "Chile" },
  { value: "cmr", label: "Camerún" },
  { value: "col", label: "Colombia" },
  { value: "crc", label: "Costa Rica" },
  { value: "cro", label: "Croacia" },
  { value: "den", label: "Dinamarca" },
  { value: "ecu", label: "Ecuador" },
  { value: "eng", label: "Inglaterra" },
  { value: "esp", label: "España" },
  { value: "fra", label: "Francia" },
  { value: "ger", label: "Alemania" },
  { value: "gha", label: "Ghana" },
  { value: "irn", label: "Irán" },
  { value: "jpn", label: "Japón" },
  { value: "kor", label: "Corea del Sur" },
  { value: "ksa", label: "Arabia Saudita" },
  { value: "mar", label: "Marruecos" },
  { value: "mex", label: "México" },
  { value: "ned", label: "Países Bajos" },
  { value: "par", label: "Paraguay" },
  { value: "per", label: "Perú" },
  { value: "pol", label: "Polonia" },
  { value: "por", label: "Portugal" },
  { value: "qat", label: "Qatar" },
  { value: "sen", label: "Senegal" },
  { value: "srb", label: "Serbia" },
  { value: "sui", label: "Suiza" },
  { value: "tun", label: "Túnez" },
  { value: "uru", label: "Uruguay" },
  { value: "usa", label: "Estados Unidos" },
  { value: "ven", label: "Venezuela" },
  { value: "wal", label: "Gales" },
].sort((c1, c2) =>
  c1.label.toLowerCase().localeCompare(c2.label.toLowerCase())
);

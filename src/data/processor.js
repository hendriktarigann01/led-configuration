export const processor = [
  // VX Series 
  {
    id: 1,
    name: "VX400",
    series: "VX",
    maxResolution: {
      LAN: 2600000,
    },
    maxWidth: 10240,
    maxHeight: 8192,
    LAN: "4x",
    layers: "MAIN x 1 + PIP x 1",
    input: "SDI x 1, HDMI x 1 + Loop x 1, DVI x 1, OPT x 1",
    output: "HDMI x 1 + Loop x 1, DVI x 1, SDI x 1, OPT x 2",
  },
  {
    id: 2,
    name: "VX600",
    series: "VX",
    maxResolution: {
      LAN: 3900000,
    },
    maxWidth: 10240,
    maxHeight: 8192,
    LAN: "6x",
    layers: "MAIN x 1 + PIP x 2",
    input: "SDI x 1, HDMI x 2, DVI x 1, OPT x 1",
    output: "HDMI x 1 + Loop x 1, DVI Loop x 1, SDI x 1 Loop, OPT x 2",
  },
  {
    id: 3,
    name: "VX1000",
    series: "VX",
    maxResolution: {
      LAN: 6500000,
    },
    maxWidth: 10240,
    maxHeight: 8192,
    LAN: "10x",
    layers: "MAIN x 1 + PIP x 2",
    input: "SDI x 1, HDMI x 2, DVI x 1, OPT x 1",
    output: "HDMI x 1 + Loop x 1, DVI Loop x 1, SDI x 1 Loop, OPT x 2",
  },

  // H Series 
  {
    id: 4,
    name: "H2",
    series: "H",
    maxResolution: {
      LAN: 26000000,
      Fiber: 41600000,
    },
  },
  {
    id: 5,
    name: "H5",
    series: "H",
    maxResolution: {
      LAN: 39000000,
      Fiber: 62400000,
    },
  },
  {
    id: 6,
    name: "H9",
    series: "H",
    maxResolution: {
      LAN: 65000000,
      Fiber: 104000000,
      enhanced: 208000000,
    },
  },

  // TB Series 
  {
    id: 7,
    name: "TB30",
    series: "TB",
    maxResolution: {
      LAN: 650000,
    },
    maxWidth: 4096,
    maxHeight: 4096,
    LAN: "1 Main + 1 Backup",
    storage: "1GB + 32GB",
    os: "Android 11",
  },
  {
    id: 8,
    name: "TB60",
    series: "TB",
    maxResolution: {
      LAN: 2300000,
    },
    maxWidth: 4096,
    maxHeight: 4096,
    LAN: "4 Main",
    storage: "1GB + 32GB",
    os: "Android 11",
    input: "HDMI x 1",
    output: "HDMI x 1",
  },
];

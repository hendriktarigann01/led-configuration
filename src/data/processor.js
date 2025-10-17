export const processor = [
  // VX Series - Basic Processors
  {
    id: 1,
    name: "VX400",
    series: "VX",
    maxResolution: {
      lan: 2600000,
    },
  },
  {
    id: 2,
    name: "VX600",
    series: "VX",
    maxResolution: {
      lan: 3900000,
    },
  },
  {
    id: 3,
    name: "VX1000",
    series: "VX",
    maxResolution: {
      lan: 6500000,
    },
  },

  // H Series - Advanced Processors with Multiple Connection Types
  {
    id: 4,
    name: "H2",
    series: "H",
    maxResolution: {
      lan: 26000000,
      fiber: 41600000,
    },
  },
  {
    id: 5,
    name: "H5",
    series: "H",
    maxResolution: {
      lan: 39000000,
      fiber: 62400000,
    },
  },
  {
    id: 6,
    name: "H9",
    series: "H",
    maxResolution: {
      lan: 65000000,
      fiber: 104000000,
      enhanced: 208000000,
    },
  },

  // TB Series - Entry Level Processors
  {
    id: 7,
    name: "TB30",
    series: "TB",
    maxResolution: {
      lan: 650000,
    },
  },
  {
    id: 8,
    name: "TB60",
    series: "TB",
    maxResolution: {
      lan: 2300000,
    },
  },
];

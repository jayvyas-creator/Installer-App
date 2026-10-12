export interface Site {
  id: string;
  name: string;
  address: string;
  areaIds: string[];
}

export const MOCK_SITES: Site[] = [
  {
    id: "site-hq",
    name: "Riverside HQ",
    address: "480 Riverside Ave, Portland, OR",
    areaIds: ["area-garage", "area-loading-dock"],
  },
  {
    id: "site-retail",
    name: "Hawthorne Retail Center",
    address: "2110 SE Hawthorne Blvd, Portland, OR",
    areaIds: ["area-visitor-lot"],
  },
];

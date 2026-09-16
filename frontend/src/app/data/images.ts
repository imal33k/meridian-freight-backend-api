// Centralized image abstraction. Swapping these for a DAM/CMS later only
// requires editing this file.

function unsplash(id: string, w = 1600) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export const images = {
  heroCargoShip: unsplash('photo-1576423596782-8c5478efd11f'),
  warehouseForklift: unsplash('photo-1645736315000-6f788915923b'),
  freightTruck: unsplash('photo-1778103617525-76877c583fa5'),
  stackedContainers: unsplash('photo-1703227373720-cff89520dd31'),
  handshakeNairobi: unsplash('photo-1521791136064-7986c2920216'),
};

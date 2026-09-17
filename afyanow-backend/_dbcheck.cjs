const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  try {
    const h = await p.hospital.count();
    const u = await p.user.count();
    const d = await p.doctor.count();
    const s = await p.service.count();
    console.log(JSON.stringify({ hospitals: h, users: u, doctors: d, services: s }));
  } catch (e) {
    console.error("ERR", e.message);
  } finally {
    await p.$disconnect();
  }
})();
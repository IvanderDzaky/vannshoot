import { prisma } from '../src/lib/prisma';
import { auth } from '../src/lib/auth';

async function main() {
  console.log('🚀 Start seeding...');

  // 1. Seed Permissions
  const permissions = [
    { name: 'permission.read', description: 'Melihat daftar hak akses' },
    { name: 'permission.create', description: 'Membuat hak akses baru' },
    { name: 'permission.update', description: 'Mengubah data hak akses' },
    { name: 'permission.delete', description: 'Menghapus hak akses' },
    { name: 'role.read', description: 'Melihat daftar jabatan' },
    { name: 'role.create', description: 'Membuat jabatan baru' },
    { name: 'role.update', description: 'Mengubah data jabatan' },
    { name: 'role.delete', description: 'Menghapus jabatan' },
    { name: 'user.read', description: 'Melihat daftar pengguna' },
    { name: 'user.create', description: 'Membuat pengguna baru' },
    { name: 'user.update', description: 'Mengubah data pengguna' },
    { name: 'user.delete', description: 'Menghapus pengguna' },
    { name: 'client.read', description: 'Melihat daftar klien' },
    { name: 'client.create', description: 'Membuat klien baru' },
    { name: 'client.update', description: 'Mengubah data klien' },
    { name: 'client.delete', description: 'Menghapus klien' },
    { name: 'client.category.read', description: 'Melihat daftar kategori klien' },
    { name: 'client.category.create', description: 'Membuat kategori klien baru' },
    { name: 'client.category.update', description: 'Mengubah data kategori klien' },
    { name: 'client.category.delete', description: 'Menghapus kategori klien' },
    { name: 'portfolio.category.read', description: 'Melihat daftar kategori portofolio' },
    { name: 'portfolio.category.create', description: 'Membuat kategori portofolio baru' },
    { name: 'portfolio.category.update', description: 'Mengubah data kategori portofolio' },
    { name: 'portfolio.category.delete', description: 'Menghapus kategori portofolio' },
    { name: 'portfolio.read', description: 'Melihat daftar portofolio' },
    { name: 'portfolio.create', description: 'Membuat portofolio baru' },
    { name: 'portfolio.update', description: 'Mengubah data portofolio' },
    { name: 'portfolio.delete', description: 'Menghapus portofolio' },
    { name: 'testimonial.read', description: 'Melihat daftar testimoni' },
    { name: 'testimonial.create', description: 'Membuat testimoni baru' },
    { name: 'testimonial.update', description: 'Mengubah data testimoni' },
    { name: 'testimonial.delete', description: 'Menghapus testimoni' },
    { name: 'order.read', description: 'Melihat daftar order' },
    { name: 'order.create', description: 'Membuat order baru' },
    { name: 'order.update', description: 'Mengubah data order' },
    { name: 'order.delete', description: 'Menghapus order' },
    { name: 'admin.access', description: 'Mengakses dashboard admin' },
  ];

  console.log('  - Seeding permissions...');
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: permission,
    });
  }

  // 2. Seed Roles
  console.log('  - Seeding roles...');
  const allPermissionNames = permissions.map((p) => p.name);

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'superadmin' },
    update: {
      description: 'Super Administrator dengan akses penuh ke seluruh sistem',
    },
    create: {
      name: 'superadmin',
      description: 'Super Administrator dengan akses penuh ke seluruh sistem',
      permissions: {
        connect: allPermissionNames.map((name) => ({ name })),
      },
    },
  });

  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {
      description: 'Administrator dengan akses manajemen terbatas',
    },
    create: {
      name: 'admin',
      description: 'Administrator dengan akses manajemen terbatas',
      permissions: {
        connect: [
          { name: 'user.read' },
          { name: 'user.create' },
          { name: 'user.update' },
          { name: 'admin.access' },
        ],
      },
    },
  });

  // 3. Seed Admin User
  console.log('  - Seeding admin user...');
  const adminEmail = 'admin@gmail.com';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Create user with password using Better Auth API
    let result;
    try {
      // @ts-ignore
      result = await auth.api.createUser({
        body: {
          email: adminEmail,
          password: 'password',
          name: 'Super Admin',
        },
      });
    } catch (err: any) {
      console.error('❌ Error creating user via Better Auth:', JSON.stringify(err, null, 2));
      throw err;
    }

    if (result && result.user) {
      // Connect to superadmin role and mark as verified
      await prisma.user.update({
        where: { id: result.user.id },
        data: {
          emailVerified: true,
          roles: {
            connect: { id: superAdminRole.id },
          },
        },
      });
    }
  } else {
    // Check if account already exists
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: existingAdmin.id,
        providerId: 'credential',
      },
    });

    if (!existingAccount) {
      console.log(
        '  - Admin exists but no credential account found. Re-creating to ensure password...'
      );
      await prisma.user.delete({ where: { id: existingAdmin.id } });
      return main(); // Re-run to create fresh
    }

    // Ensure existing admin has the super admin role
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        roles: {
          connect: { id: superAdminRole.id },
        },
      },
    });
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

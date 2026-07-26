import { authenticate } from '../src/lib/auth';

async function testLogin(email: string, password?: string) {
  try {
    const user = await authenticate({ email, password: password || 'testpass123' });
    console.log(`[SUCCESS] Login for ${email}:`, user);
  } catch (error: any) {
    console.log(`[FAILED] Login for ${email}:`, error.message);
  }
}

async function runTests() {
  console.log("=== Menjalankan 5 Skenario Auth (Sprint 2) ===");
  
  // 1. Akun Active
  console.log("\nSkenario 1: Akun Active (Login Berhasil)");
  await testLogin('active@example.com', 'password123');

  // 2. Akun Pending
  console.log("\nSkenario 2: Akun Pending (Login Gagal)");
  await testLogin('pending@example.com', 'password123');

  // 3. Akun Rejected
  console.log("\nSkenario 3: Akun Rejected (Login Gagal)");
  await testLogin('rejected@example.com', 'password123');

  // 4. Salah Password
  console.log("\nSkenario 4: Akun Active dengan Salah Password (Login Gagal)");
  await testLogin('active@example.com', 'wrongpassword');

  // 5. Akun Tidak Terdaftar
  console.log("\nSkenario 5: Akun Tidak Terdaftar (Login Gagal)");
  await testLogin('unknown@example.com', 'password123');
  
  console.log("\nSemua skenario regresi selesai dijalankan.");
}

runTests();

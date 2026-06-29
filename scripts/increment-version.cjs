const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('Error: package.json tidak ditemukan di root direktori.');
  process.exit(1);
}

// Membaca package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Argumen: tipe increment (patch, minor, major, release)
const type = process.argv[2] || 'patch';

// Cek apakah ada flag --dev atau dev dalam argument list
const isDevRequested = process.argv.includes('--dev') || process.argv.includes('dev');

// Regex SemVer dengan opsional tag pre-release "-dev.X"
const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-dev\.(\d+))?$/;
const match = currentVersion.match(semverRegex);

if (!match) {
  console.error(`Error: Versi saat ini "${currentVersion}" tidak valid sesuai format SemVer.`);
  process.exit(1);
}

let major = parseInt(match[1], 10);
let minor = parseInt(match[2], 10);
let patch = parseInt(match[3], 10);
const currentDevVal = match[4] !== undefined ? parseInt(match[4], 10) : null;

// Menentukan status phase saat ini berdasarkan isi versi package.json
const isInDevPhase = currentDevVal !== null;

let newVersion = '';

if (type === 'release') {
  // Keluar dari fase development, rilis versi produksi
  if (!isInDevPhase) {
    console.warn('Peringatan: Versi saat ini bukan versi development (tidak ada tag -dev.X).');
    newVersion = `${major}.${minor}.${patch}`;
  } else {
    newVersion = `${major}.${minor}.${patch}`;
    console.log(`\n📦 Merilis versi produksi: stripping -dev.${currentDevVal}`);
  }
} else if (type === 'major') {
  if (isDevRequested || isInDevPhase) {
    newVersion = `${major + 1}.0.0-dev.0`;
  } else {
    newVersion = `${major + 1}.0.0`;
  }
} else if (type === 'minor') {
  if (isDevRequested || isInDevPhase) {
    newVersion = `${major}.${minor + 1}.0-dev.0`;
  } else {
    newVersion = `${major}.${minor + 1}.0`;
  }
} else if (type === 'patch') {
  if (isInDevPhase) {
    // Jika sedang dalam fase development, increment dev counter bukan patch number
    newVersion = `${major}.${minor}.${patch}-dev.${currentDevVal + 1}`;
  } else if (isDevRequested) {
    newVersion = `${major}.${minor}.${patch + 1}-dev.0`;
  } else {
    newVersion = `${major}.${minor}.${patch + 1}`;
  }
} else {
  console.error(
    'Error: Tipe increment tidak dikenal. Gunakan "major", "minor", "patch", atau "release".'
  );
  console.log('Contoh penggunaan:');
  console.log('  node scripts/increment-version.cjs patch          # Increment patch');
  console.log(
    '  node scripts/increment-version.cjs minor --dev    # Mulai fase dev baru untuk minor'
  );
  console.log(
    '  node scripts/increment-version.cjs patch          # Increment dev counter (jika versi saat ini memiliki -dev.X)'
  );
  console.log(
    '  node scripts/increment-version.cjs release        # Menghapus tag -dev.X untuk rilis'
  );
  process.exit(1);
}

packageJson.version = newVersion;

// Menyimpan kembali perubahan ke package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');

console.log(`\n🚀 Versi berhasil dinaikkan dari ${currentVersion} menjadi ${newVersion} (${type})`);

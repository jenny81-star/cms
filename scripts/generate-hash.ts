/**
 * Script to generate bcrypt hash for admin password
 * Usage: npx tsx scripts/generate-hash.ts
 */

import bcryptjs from 'bcryptjs'

async function generateHash() {
  // Default password for development
  const password = process.argv[2] || 'admin123'

  console.log('🔐 비밀번호 해시 생성 중...\n')
  console.log(`입력한 비밀번호: ${password}\n`)

  try {
    const hash = await bcryptjs.hash(password, 10)

    console.log('✅ 해시 생성 완료!\n')
    console.log('다음을 .env.local 파일에 추가하세요:\n')
    console.log('--------------------------------------')
    console.log(`ADMIN_PASSWORD_HASH=${hash}`)
    console.log('--------------------------------------\n')

    console.log('📝 참고:')
    console.log('- 해시값을 안전하게 보관하세요')
    console.log('- .env.local 파일을 버전 관리에서 제외하세요')
    console.log('- 프로덕션에서는 강력한 비밀번호를 사용하세요\n')
  } catch (error) {
    console.error('❌ 해시 생성 중 오류 발생:', error)
    process.exit(1)
  }
}

generateHash()

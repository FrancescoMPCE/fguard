
interface PasswordEntry {
  id: string;
  website: string;
  username: string;
  password: string;
  createdAt: Date;
}

interface SecurityAnalysis {
  score: number;
  level: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Excellent';
  weakPasswords: number;
  reusedPasswords: number;
  strongPasswords: number;
}

export const analyzePasswordSecurity = (passwords: PasswordEntry[]): SecurityAnalysis => {
  if (passwords.length === 0) {
    return {
      score: 100,
      level: 'Excellent',
      weakPasswords: 0,
      reusedPasswords: 0,
      strongPasswords: 0
    };
  }

  let weakCount = 0;
  let strongCount = 0;
  const passwordCounts = new Map<string, number>();

  // Analyze each password
  passwords.forEach(entry => {
    const password = entry.password;
    
    // Count password reuse
    passwordCounts.set(password, (passwordCounts.get(password) || 0) + 1);
    
    // Check password strength
    const isStrong = isPasswordStrong(password);
    if (isStrong) {
      strongCount++;
    } else {
      weakCount++;
    }
  });

  // Count reused passwords
  const reusedCount = Array.from(passwordCounts.values())
    .filter(count => count > 1)
    .reduce((sum, count) => sum + count, 0);

  // Calculate score (0-100)
  const totalPasswords = passwords.length;
  const strongRatio = strongCount / totalPasswords;
  const reusedRatio = reusedCount / totalPasswords;
  
  let score = Math.round((strongRatio * 100) - (reusedRatio * 30));
  score = Math.max(0, Math.min(100, score));

  // Determine level
  let level: SecurityAnalysis['level'];
  if (score >= 90) level = 'Excellent';
  else if (score >= 75) level = 'Strong';
  else if (score >= 50) level = 'Good';
  else if (score >= 25) level = 'Fair';
  else level = 'Weak';

  return {
    score,
    level,
    weakPasswords: weakCount,
    reusedPasswords: reusedCount,
    strongPasswords: strongCount
  };
};

const isPasswordStrong = (password: string): boolean => {
  if (password.length < 8) return false;
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const criteriaCount = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChars]
    .filter(Boolean).length;
    
  return criteriaCount >= 3 && password.length >= 12;
};

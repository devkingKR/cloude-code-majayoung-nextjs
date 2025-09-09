'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { cashBalances } from '@/lib/data';

export default function Navigation() {
  const pathname = usePathname();
  
  // 현재 사용자의 캐시 잔액 (샘플: 김마케팅)
  const currentUserCash = cashBalances[0];

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <Logo size="md" showText={true} />
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link href="/projects" className={isActive('/projects')}>
                프로젝트 목록
              </Link>
              <Link href="/experts" className={isActive('/experts')}>
                전문가 목록
              </Link>
              <Link href="/cash" className={isActive('/cash')}>
                캐시충전
              </Link>
              <Link href="/status" className={isActive('/status')}>
                현황
              </Link>
              <Link href="/mypage" className={isActive('/mypage')}>
                마이페이지
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 캐시 잔액 표시 */}
            <Link 
              href="/cash"
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm font-semibold">💰</span>
              <span className="text-sm font-semibold">
                {new Intl.NumberFormat('ko-KR').format(currentUserCash.balance)}
              </span>
            </Link>
            
            <Link 
              href="/signup" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              회원가입
            </Link>
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-md border hover:border-blue-600 transition-colors"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
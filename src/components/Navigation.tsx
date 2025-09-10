'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Logo from './Logo';
import { cashBalances } from '@/lib/data';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 현재 사용자의 캐시 잔액 (샘플: 김마케팅)
  const currentUserCash = cashBalances[0];

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <Logo size="md" showText={true} />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
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
          
          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
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

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Cash Balance */}
            <Link 
              href="/cash"
              className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs"
            >
              <span>💰</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('ko-KR').format(currentUserCash.balance)}
              </span>
            </Link>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded={isMenuOpen}
              aria-label="메뉴 토글"
            >
              <span className="sr-only">{isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <Link
                href="/projects"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === '/projects' 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                📋 프로젝트 목록
              </Link>
              <Link
                href="/experts"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === '/experts' 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                👨‍💼 전문가 목록
              </Link>
              <Link
                href="/cash"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === '/cash' 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                💰 캐시충전
              </Link>
              <Link
                href="/status"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === '/status' 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                📊 현황
              </Link>
              <Link
                href="/mypage"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === '/mypage' 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                👤 마이페이지
              </Link>
              
              {/* Mobile Auth Links */}
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/signup"
                  className="block px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-center hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🚀 회원가입
                </Link>
                <Link
                  href="/login"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 border border-gray-300 text-center hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🔐 로그인
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
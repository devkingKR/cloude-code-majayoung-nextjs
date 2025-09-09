'use client';

import { useState } from 'react';
import Link from 'next/link';
import { projects, experts, applications, businessOwners, quotes, cashBalances, cashTransactions } from '@/lib/data';

export default function MyPage() {
  const [userType, setUserType] = useState<'expert' | 'business'>('expert');
  const [selectedExpert] = useState(experts[0]);
  const [selectedBusiness] = useState(businessOwners[0]);

  const myProjects = userType === 'business' 
    ? projects.filter(p => p.businessOwnerId === selectedBusiness.id)
    : projects.filter(p => p.expertId === selectedExpert.id);

  const myApplications = userType === 'expert'
    ? applications.filter(a => a.expertId === selectedExpert.id)
    : [];

  const receivedApplications = userType === 'business'
    ? applications.filter(a => myProjects.some(p => p.id === a.projectId))
    : [];

  const myQuotes = userType === 'expert'
    ? quotes.filter(q => q.expertId === selectedExpert.id)
    : [];

  const receivedQuotes = userType === 'business'
    ? quotes.filter(q => myProjects.some(p => p.id === q.projectId))
    : [];

  const currentUserCash = cashBalances.find(c => c.userId === (userType === 'expert' ? selectedExpert.id : selectedBusiness.id));
  const userCashTransactions = cashTransactions.filter(t => t.userId === (userType === 'expert' ? selectedExpert.id : selectedBusiness.id)).slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { text: string; color: string } } = {
      open: { text: '모집중', color: 'bg-green-100 text-green-800' },
      in_progress: { text: '진행중', color: 'bg-blue-100 text-blue-800' },
      completed: { text: '완료', color: 'bg-gray-100 text-gray-800' },
      pending: { text: '대기중', color: 'bg-yellow-100 text-yellow-800' },
      accepted: { text: '승인됨', color: 'bg-green-100 text-green-800' },
      rejected: { text: '거절됨', color: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'charge': return '💰';
      case 'spend': return '💸';
      case 'bonus': return '🎁';
      case 'refund': return '💚';
      default: return '💳';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'charge': return 'text-blue-600';
      case 'spend': return 'text-red-600';
      case 'bonus': return 'text-green-600';
      case 'refund': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">마이페이지</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setUserType('expert')}
            className={`px-4 py-2 rounded-md ${
              userType === 'expert'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            전문가 보기
          </button>
          <button
            onClick={() => setUserType('business')}
            className={`px-4 py-2 rounded-md ${
              userType === 'business'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            사업자 보기
          </button>
        </div>
      </div>

      {userType === 'expert' ? (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  {selectedExpert.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedExpert.name}</h2>
                <p className="text-gray-600 mb-3">{selectedExpert.email}</p>
                <div className="flex items-center space-x-4 mb-3">
                  <span className="text-yellow-500">★ {selectedExpert.rating}</span>
                  <span className="text-gray-600">{selectedExpert.experience}년 경력</span>
                  <span className="text-gray-600">{selectedExpert.completedProjects}개 완료</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedExpert.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600">{selectedExpert.bio}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-blue-600">
                  {formatNumber(selectedExpert.hourlyRate)}원/시간
                </p>
                <button className="mt-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  프로필 편집
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">발송한 견적</h3>
                <div className="flex items-center space-x-2">
                  <div className="text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-semibold">
                    💰 {formatNumber(currentUserCash?.balance || 0)}원
                  </div>
                  <Link 
                    href="/cash"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    충전 →
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                {myQuotes.map((quote) => {
                  const project = projects.find(p => p.id === quote.projectId);
                  const daysLeft = Math.ceil((new Date(quote.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={quote.id} className="border-l-4 border-purple-200 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{project?.title}</h4>
                        {getStatusBadge(quote.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{project?.businessName}</p>
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-semibold text-blue-600">{formatNumber(quote.totalPrice)}원</span>
                        <span className="ml-4">{quote.estimatedDuration}</span>
                      </div>
                      <div className="text-xs text-orange-600">
                        {daysLeft > 0 ? `${daysLeft}일 남음` : '기한 만료'}
                      </div>
                    </div>
                  );
                })}
                {myQuotes.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-2">발송한 견적이 없습니다.</p>
                    <button className="text-blue-600 text-sm hover:underline">
                      프로젝트 둘러보기 →
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">진행 중인 프로젝트</h3>
              <div className="space-y-4">
                {myProjects.map((project) => (
                  <div key={project.id} className="border-l-4 border-green-200 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{project.title}</h4>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{project.businessName}</p>
                    <div className="text-sm text-gray-500">
                      <span>예산: {formatNumber(project.budget)}원</span>
                      <span className="ml-4">기간: {project.duration}</span>
                    </div>
                  </div>
                ))}
                {myProjects.length === 0 && (
                  <p className="text-gray-500 text-center py-4">진행 중인 프로젝트가 없습니다.</p>
                )}
              </div>
            </div>
          </div>

          {/* 견적 성과 요약 */}
          {myQuotes.length > 0 && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                견적 성과 요약
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{myQuotes.length}</p>
                  <p className="text-sm text-gray-600">발송한 견적</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {myQuotes.filter(q => q.status === 'accepted').length}
                  </p>
                  <p className="text-sm text-gray-600">수락된 견적</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {myQuotes.filter(q => q.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">검토 대기</p>
                </div>
              </div>
            </div>
          )}

          {/* 캐시 거래 내역 (전문가만) */}
          {userType === 'expert' && userCashTransactions.length > 0 && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">최근 캐시 사용 내역</h3>
                <Link href="/cash" className="text-blue-600 text-sm hover:underline">
                  전체 보기 →
                </Link>
              </div>
              <div className="space-y-3">
                {userCashTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatNumber(transaction.amount)}원
                      </p>
                      <p className="text-xs text-gray-500">
                        잔액: {formatNumber(transaction.balanceAfter)}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-green-600">
                  {selectedBusiness.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedBusiness.name}</h2>
                <p className="text-gray-600 mb-3">{selectedBusiness.email}</p>
                <div className="space-y-2">
                  <p><span className="font-medium">사업체명:</span> {selectedBusiness.businessName}</p>
                  <p><span className="font-medium">업종:</span> {selectedBusiness.businessType}</p>
                  <p><span className="font-medium">위치:</span> {selectedBusiness.location}</p>
                  <p><span className="font-medium">연락처:</span> {selectedBusiness.phone}</p>
                </div>
              </div>
              <div>
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  정보 편집
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">내 프로젝트</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                  새 프로젝트 등록
                </button>
              </div>
              <div className="space-y-4">
                {myProjects.map((project) => (
                  <div key={project.id} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{project.title}</h4>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                    <div className="text-sm text-gray-500">
                      <span>예산: {formatNumber(project.budget)}원</span>
                      <span className="ml-4">등록일: {formatDate(project.createdAt)}</span>
                    </div>
                    {project.expertName && (
                      <p className="text-sm text-blue-600 mt-1">담당: {project.expertName}</p>
                    )}
                  </div>
                ))}
                {myProjects.length === 0 && (
                  <p className="text-gray-500 text-center py-4">등록한 프로젝트가 없습니다.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">받은 견적</h3>
              <div className="space-y-4">
                {receivedQuotes.map((quote) => {
                  const project = projects.find(p => p.id === quote.projectId);
                  const daysLeft = Math.ceil((new Date(quote.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={quote.id} className="border-l-4 border-yellow-200 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{quote.expertName}</h4>
                          <p className="text-sm text-gray-600">{project?.title}</p>
                        </div>
                        {getStatusBadge(quote.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{quote.message}</p>
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-semibold text-blue-600">{formatNumber(quote.totalPrice)}원</span>
                        <span className="ml-4">{quote.estimatedDuration}</span>
                        <span className="ml-4">★{quote.expertRating}</span>
                      </div>
                      <div className="text-xs text-orange-600 mb-2">
                        {daysLeft > 0 ? `${daysLeft}일 남음` : '기한 만료'}
                      </div>
                      {quote.status === 'pending' && daysLeft > 0 && (
                        <div className="flex space-x-2">
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                            견적 수락
                          </button>
                          <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-50">
                            상세보기
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {receivedQuotes.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-2">받은 견적이 없습니다.</p>
                    <button className="text-blue-600 text-sm hover:underline">
                      프로젝트 등록하기 →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
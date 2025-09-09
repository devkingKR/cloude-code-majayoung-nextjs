'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { projects, quotes, experts, businessOwners } from '@/lib/data';
import { Project, Quote } from '@/types';
import { rankQuotesByRecommendation } from '@/lib/recommendation';

export default function QuotesComparisonPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [projectQuotes, setProjectQuotes] = useState<Quote[]>([]);
  const [sortBy, setSortBy] = useState<'recommendation' | 'price' | 'rating' | 'experience' | 'date'>('recommendation');
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [rankedQuotes, setRankedQuotes] = useState<any[]>([]);

  useEffect(() => {
    const projectId = params.id as string;
    const foundProject = projects.find(p => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
      const relatedQuotes = quotes.filter(q => q.projectId === projectId);
      setProjectQuotes(relatedQuotes);
      
      // AI 추천 시스템으로 견적 순위 매기기
      const businessOwner = businessOwners.find(b => b.id === foundProject.businessOwnerId);
      const rankedWithRecommendation = rankQuotesByRecommendation(
        relatedQuotes, 
        experts, 
        foundProject, 
        businessOwner?.businessType
      );
      setRankedQuotes(rankedWithRecommendation);
    }
  }, [params.id]);

  const sortedQuotes = (() => {
    if (sortBy === 'recommendation') {
      return rankedQuotes;
    }
    
    return [...projectQuotes].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.totalPrice - b.totalPrice;
        case 'rating':
          return b.expertRating - a.expertRating;
        case 'experience':
          return b.expertExperience - a.expertExperience;
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  })();

  const handleAcceptQuote = (quoteId: string, expertName: string) => {
    if (window.confirm(`${expertName}님의 견적을 수락하시겠습니까?`)) {
      alert('견적이 수락되었습니다! 전문가와 연락이 시작됩니다.');
      // 여기서 실제로는 견적 상태를 업데이트하고 프로젝트 상태를 변경해야 합니다
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const getDaysLeft = (expiresAt: string) => {
    const days = Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">프로젝트를 찾을 수 없습니다.</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:underline"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => router.back()}
        className="mb-6 text-blue-600 hover:underline flex items-center"
      >
        ← 프로젝트로 돌아가기
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {project.title} - 견적 비교
        </h1>
        <p className="text-gray-600">
          총 {projectQuotes.length}개의 견적을 받았습니다. 최적의 파트너를 선택해보세요!
        </p>
      </div>

      {projectQuotes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500 mb-4">아직 받은 견적이 없습니다.</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            견적 요청하러 가기
          </button>
        </div>
      ) : (
        <>
          {/* 정렬 옵션 */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="recommendation">🤖 마자영 AI 추천순</option>
                <option value="price">가격 낮은순</option>
                <option value="rating">평점 높은순</option>
                <option value="experience">경력 많은순</option>
                <option value="date">최신순</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              {selectedQuote && `선택된 견적: 1개`}
            </div>
          </div>

          {/* 견적 카드들 */}
          <div className="space-y-6">
            {sortedQuotes.map((quote, index) => {
              const isLowestPrice = quote.totalPrice === Math.min(...projectQuotes.map(q => q.totalPrice));
              const isHighestRating = quote.expertRating === Math.max(...projectQuotes.map(q => q.expertRating));
              const daysLeft = getDaysLeft(quote.expiresAt);
              
              // AI 추천 정보 가져오기
              const recommendationScore = quote.recommendationScore;
              const isAIRecommended = sortBy === 'recommendation' && recommendationScore;
              const isTopRecommendation = index === 0 && sortBy === 'recommendation';
              
              return (
                <div 
                  key={quote.id} 
                  className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-2 relative ${
                    selectedQuote === quote.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isTopRecommendation ? 'ring-2 ring-gradient-to-r ring-blue-400 ring-opacity-60' : ''}`}
                >
                  {/* AI 추천 뱃지들 */}
                  <div className="absolute -top-3 left-6 flex space-x-2">
                    {isTopRecommendation && (
                      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <span>🤖</span>
                        <span>마자영 AI 추천</span>
                      </div>
                    )}
                    {isAIRecommended && recommendationScore?.recommendationLevel === 'high' && index > 0 && (
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        높은 매칭
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-start mb-4 relative">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold">{quote.expertName}</h3>
                        <span className="text-yellow-500 text-sm">
                          {getRatingStars(quote.expertRating)} ({quote.expertRating})
                        </span>
                        <span className="text-gray-600 text-sm">
                          {quote.expertExperience}년 경력
                        </span>
                        {isLowestPrice && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            최저가
                          </span>
                        )}
                        {isHighestRating && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                            최고평점
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{quote.message}</p>
                    </div>
                    
                    <div className="text-right ml-6">
                      <p className="text-3xl font-bold text-blue-600 mb-1">
                        {formatPrice(quote.totalPrice)}원
                      </p>
                      <p className="text-gray-600 text-sm mb-1">{quote.estimatedDuration}</p>
                      <p className="text-orange-600 text-xs">
                        {daysLeft > 0 ? `${daysLeft}일 남음` : '기한 만료'}
                      </p>
                    </div>
                  </div>

                  {/* 작업 범위 */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">포함 서비스</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {quote.workScope.map((scope, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-700">
                          <span className="text-green-500 mr-2">✓</span>
                          {scope}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 납품물 */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">납품물</h4>
                    <div className="flex flex-wrap gap-2">
                      {quote.deliverables.map((deliverable, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded"
                        >
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 일정 */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">작업 일정</h4>
                    <div className="space-y-2">
                      {quote.timeline.map((phase, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <div className="w-4 h-4 bg-blue-200 rounded-full mr-3 flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{phase.phase}</span>
                            <span className="text-gray-600 ml-2">({phase.duration})</span>
                            <p className="text-gray-600 text-xs mt-1">{phase.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI 추천 이유 */}
                  {isAIRecommended && recommendationScore && recommendationScore.reasons.length > 0 && (
                    <div className="mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">🤖</span>
                        <h4 className="font-medium text-blue-900">마자영 AI가 추천하는 이유</h4>
                        <span className="ml-auto text-sm bg-blue-600 text-white px-2 py-1 rounded-full">
                          {recommendationScore.matchPercentage}% 매칭
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {recommendationScore.reasons.slice(0, 3).map((reason, idx) => (
                          <li key={idx} className="text-sm text-blue-800 flex items-start">
                            <span className="text-blue-600 mr-2 mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                      {recommendationScore.recommendationLevel === 'high' && (
                        <div className="mt-2 text-xs text-blue-700 font-medium">
                          ⭐ 이 전문가는 귀하의 프로젝트에 매우 적합합니다!
                        </div>
                      )}
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      {formatDate(quote.createdAt)} 제출
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedQuote(selectedQuote === quote.id ? null : quote.id)}
                        className={`px-4 py-2 rounded-md border transition-colors ${
                          selectedQuote === quote.id
                            ? 'border-blue-600 text-blue-600 bg-blue-50'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {selectedQuote === quote.id ? '선택됨' : '선택'}
                      </button>
                      <button
                        onClick={() => handleAcceptQuote(quote.id, quote.expertName)}
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-2 rounded-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        disabled={daysLeft <= 0}
                      >
                        {daysLeft <= 0 ? '기한 만료' : '견적 수락'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 견적 비교 요약 */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              견적 비교 요약
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">가격 범위</p>
                <p className="text-blue-600 font-semibold">
                  {formatPrice(Math.min(...projectQuotes.map(q => q.totalPrice)))}원 
                  ~ {formatPrice(Math.max(...projectQuotes.map(q => q.totalPrice)))}원
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">평균 기간</p>
                <p className="text-purple-600 font-semibold">
                  {Math.round(projectQuotes.reduce((sum, q) => {
                    const weeks = parseInt(q.estimatedDuration.replace(/[^0-9]/g, ''));
                    return sum + weeks;
                  }, 0) / projectQuotes.length)}주
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">평균 평점</p>
                <p className="text-pink-600 font-semibold">
                  {(projectQuotes.reduce((sum, q) => sum + q.expertRating, 0) / projectQuotes.length).toFixed(1)}점
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
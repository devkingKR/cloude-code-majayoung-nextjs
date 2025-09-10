'use client';

import { useState } from 'react';
import { experts, projects, cashBalances, businessOwners } from '@/lib/data';
import { getRecommendedExpertsForIndustry, calculateOverallRecommendation, ExpertScore } from '@/lib/recommendation';

export default function ExpertsPage() {
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'rate' | 'projects' | 'recommendation'>('recommendation');
  const [filterExpertise, setFilterExpertise] = useState<string>('');
  const [filterIndustry, setFilterIndustry] = useState<string>('');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [expertScores, setExpertScores] = useState<Map<string, ExpertScore>>(new Map());

  const allExpertise = Array.from(
    new Set(experts.flatMap(expert => expert.expertise))
  ).sort();

  const industries = [
    '카페/음료',
    '음식점', 
    '미용/뷰티',
    '패션/의류',
    '헬스/피트니스',
    '기타'
  ];

  // 현재 사업자 정보 (샘플)
  const currentBusinessOwner = businessOwners[0];
  
  // 샘플 프로젝트 생성 (업종별 추천을 위한)
  const sampleProject = {
    id: 'sample',
    title: '마케팅 전략 컨설팅',
    businessName: currentBusinessOwner.businessName,
    businessOwnerId: currentBusinessOwner.id,
    description: '효과적인 마케팅 전략 수립',
    requirements: ['SNS 마케팅', '브랜드 전략', 'ROI 분석'],
    budget: 1000000,
    duration: '4주',
    status: 'open',
    createdAt: new Date().toISOString()
  };

  // 업종 필터링 로직
  let filteredExperts = experts.filter(expert => {
    if (filterExpertise && !expert.expertise.includes(filterExpertise)) {
      return false;
    }
    
    if (filterIndustry) {
      // 업종별 키워드 매칭
      const industryKeywords = {
        '카페/음료': ['sns', 'instagram', '인스타그램', '소셜', '브랜딩'],
        '음식점': ['sns', '리뷰', 'seo', '검색', '블로그'],
        '미용/뷰티': ['instagram', '인스타그램', '틱톡', '인플루언서'],
        '패션/의류': ['instagram', '인스타그램', '쇼핑몰', '온라인'],
        '헬스/피트니스': ['sns', '로컬', '이벤트', '커뮤니티'],
      };
      
      const keywords = industryKeywords[filterIndustry as keyof typeof industryKeywords];
      if (keywords) {
        const expertSkills = expert.expertise.map(skill => skill.toLowerCase());
        const hasMatch = keywords.some(keyword => 
          expertSkills.some(skill => skill.includes(keyword))
        );
        if (!hasMatch) return false;
      }
    }
    
    return true;
  });

  // AI 추천 점수 계산 (업종이 선택된 경우)
  if (filterIndustry && filterIndustry !== '기타') {
    const scores = new Map<string, ExpertScore>();
    filteredExperts.forEach(expert => {
      const score = calculateOverallRecommendation(
        expert, 
        sampleProject as any, 
        filterIndustry
      );
      scores.set(expert.id, score);
    });
    if (expertScores.size === 0) {
      setExpertScores(scores);
    }
  }

  const sortedExperts = [...filteredExperts].sort((a, b) => {
    switch (sortBy) {
      case 'recommendation':
        const scoreA = expertScores.get(a.id)?.score || 0;
        const scoreB = expertScores.get(b.id)?.score || 0;
        if (Math.abs(scoreA - scoreB) < 5) {
          return b.rating - a.rating; // 점수가 비슷하면 평점순
        }
        return scoreB - scoreA;
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return b.experience - a.experience;
      case 'rate':
        return a.hourlyRate - b.hourlyRate;
      case 'projects':
        return b.completedProjects - a.completedProjects;
      default:
        return 0;
    }
  });

  const formatHourlyRate = (rate: number) => {
    return new Intl.NumberFormat('ko-KR').format(rate);
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const handleSendQuote = (expert: any) => {
    setSelectedExpert(expert);
    setShowQuoteModal(true);
  };

  const openProjects = projects.filter(p => p.status === 'open');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            마케팅 전문가
          </h1>
          <div className="text-sm text-gray-600">
            총 {filteredExperts.length}명의 전문가
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            value={filterIndustry}
            onChange={(e) => {
              setFilterIndustry(e.target.value);
              if (e.target.value) {
                setSortBy('recommendation');
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="">전체 업종</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          
          <select
            value={filterExpertise}
            onChange={(e) => setFilterExpertise(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="">전체 분야</option>
            {allExpertise.map((expertise) => (
              <option key={expertise} value={expertise}>
                {expertise}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:col-span-2 lg:col-span-1"
          >
            <option value="recommendation">🤖 마자영 AI 추천순</option>
            <option value="rating">평점순</option>
            <option value="experience">경력순</option>
            <option value="rate">요금순</option>
            <option value="projects">완료 프로젝트순</option>
          </select>
        </div>
        
        {filterIndustry && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">🤖</span>
                <h3 className="font-medium text-blue-900">
                  {filterIndustry} 업종에 최적화된 전문가 추천
                </h3>
              </div>
              <p className="text-sm text-blue-800">
                마자영 AI가 {currentBusinessOwner.businessName}과 유사한 "{filterIndustry}" 업종의 성공 사례를 분석하여 가장 적합한 전문가를 추천합니다.
              </p>
            </div>
            
            {/* 랭킹 요약 통계 */}
            {sortBy === 'recommendation' && expertScores.size > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">📊</span>
                  AI 추천 점수 분포
                </h3>
                
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div className="bg-green-50 p-2 sm:p-3 rounded-lg border border-green-200">
                    <div className="text-lg sm:text-2xl font-bold text-green-700">
                      {Array.from(expertScores.values()).filter(s => s.recommendationLevel === 'high').length}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600 font-medium">최적 매칭</div>
                    <div className="text-xs text-green-500">(80점 이상)</div>
                  </div>
                  
                  <div className="bg-orange-50 p-2 sm:p-3 rounded-lg border border-orange-200">
                    <div className="text-lg sm:text-2xl font-bold text-orange-700">
                      {Array.from(expertScores.values()).filter(s => s.recommendationLevel === 'medium').length}
                    </div>
                    <div className="text-xs sm:text-sm text-orange-600 font-medium">적합</div>
                    <div className="text-xs text-orange-500">(60-79점)</div>
                  </div>
                  
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
                    <div className="text-lg sm:text-2xl font-bold text-gray-700">
                      {Array.from(expertScores.values()).filter(s => s.recommendationLevel === 'low').length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">기본</div>
                    <div className="text-xs text-gray-500">(59점 이하)</div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-600">
                    평균 매칭 점수: <span className="font-semibold text-blue-600">
                      {Math.round(Array.from(expertScores.values()).reduce((sum, s) => sum + s.matchPercentage, 0) / expertScores.size)}점
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {sortedExperts.map((expert, index) => {
          const expertScore = expertScores.get(expert.id);
          const isAIRecommended = filterIndustry && expertScore;
          const isTopRecommendation = index === 0 && sortBy === 'recommendation' && isAIRecommended;
          
          return (
          <div key={expert.id} className={`bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 relative ${
            isTopRecommendation ? 'ring-2 ring-blue-400 ring-opacity-60 transform scale-[1.02]' : ''
          }`}>
            {/* AI 추천 배지 */}
            {isAIRecommended && (
              <div className="absolute -top-3 left-2 sm:left-4 flex space-x-1 sm:space-x-2">
                {isTopRecommendation && (
                  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center space-x-1">
                    <span>🤖</span>
                    <span className="hidden sm:inline">마자영 AI 추천</span>
                    <span className="sm:hidden">AI 추천</span>
                  </div>
                )}
                {expertScore && expertScore.recommendationLevel === 'high' && index > 0 && (
                  <div className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    높은 매칭
                  </div>
                )}
              </div>
            )}
            <div className="text-center mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">
                  {expert.name.charAt(0)}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-1">{expert.name}</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center mb-2 space-y-1 sm:space-y-0">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1 text-sm">{getRatingStars(expert.rating)}</span>
                  <span className="text-gray-600 text-sm">({expert.rating})</span>
                </div>
                {isAIRecommended && expertScore && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full sm:ml-2">
                    {expertScore.matchPercentage}% 매칭
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">전문 분야</h3>
                <div className="flex flex-wrap gap-1">
                  {expert.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div>
                  <span className="text-gray-500 text-xs sm:text-sm">경력</span>
                  <p className="font-medium">{expert.experience}년</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs sm:text-sm">완료 프로젝트</span>
                  <p className="font-medium">{expert.completedProjects}개</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">시간당 요금</h3>
                <p className="text-base sm:text-lg font-semibold text-blue-600">
                  {formatHourlyRate(expert.hourlyRate)}원
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">소개</h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">{expert.bio}</p>
              </div>

              {expert.portfolio.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">주요 포트폴리오</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {expert.portfolio.slice(0, 2).map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                    {expert.portfolio.length > 2 && (
                      <li className="text-blue-600 text-xs">+{expert.portfolio.length - 2}개 더보기</li>
                    )}
                  </ul>
                </div>
              )}
              
              {/* AI 추천 이유 및 점수 상세 */}
              {isAIRecommended && expertScore && expertScore.reasons.length > 0 && (
                <div className="mt-4 space-y-3">
                  {/* 추천 점수 시각화 */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">🎯 AI 매칭 점수</h4>
                      <span className="text-lg font-bold text-blue-600">{expertScore.matchPercentage}점</span>
                    </div>
                    
                    {/* 점수 막대 그래프 */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          expertScore.recommendationLevel === 'high' 
                            ? 'bg-gradient-to-r from-green-400 to-blue-500'
                            : expertScore.recommendationLevel === 'medium'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}
                        style={{ width: `${expertScore.matchPercentage}%` }}
                      ></div>
                    </div>
                    
                    {/* 점수 레벨 표시 */}
                    <div className="flex justify-between text-xs text-gray-600">
                      <span className={expertScore.recommendationLevel === 'low' ? 'font-semibold text-gray-800' : ''}>
                        기본 (0-59)
                      </span>
                      <span className={expertScore.recommendationLevel === 'medium' ? 'font-semibold text-orange-800' : ''}>
                        적합 (60-79)
                      </span>
                      <span className={expertScore.recommendationLevel === 'high' ? 'font-semibold text-blue-800' : ''}>
                        최적 (80-100)
                      </span>
                    </div>
                  </div>
                  
                  {/* 추천 이유 */}
                  <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-sm mr-1">🤖</span>
                      <h4 className="text-sm font-medium text-blue-900">마자영 AI 추천 이유</h4>
                      <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        {expertScore.recommendationLevel === 'high' ? '매우 추천' : 
                         expertScore.recommendationLevel === 'medium' ? '추천' : '보통'}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {expertScore.reasons.slice(0, 3).map((reason, idx) => (
                        <li key={idx} className="text-xs text-blue-800 flex items-start">
                          <span className="text-blue-600 mr-1 mt-0.5">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {expertScore.reasons.length > 3 && (
                      <button 
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={() => alert(expertScore.reasons.join('\\n\\n'))}
                      >
                        +{expertScore.reasons.length - 3}개 이유 더보기
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <div className="text-xs text-gray-500">
                  가입일: {new Date(expert.createdAt).toLocaleDateString('ko-KR')}
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button 
                    onClick={() => handleSendQuote(expert)}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-3 py-2 rounded-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm w-full sm:w-auto"
                  >
                    견적 발송
                  </button>
                  <button className="border border-gray-300 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm w-full sm:w-auto">
                    연락하기
                  </button>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {sortedExperts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">해당 조건의 전문가가 없습니다.</p>
        </div>
      )}

      <div className="mt-12 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-lg border border-gradient">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          마케팅 전문가로 등록하고 싶으신가요?
        </h2>
        <p className="text-gray-700 mb-4">
          마자영에서 다양한 프로젝트에 참여하고 전문성을 발휘할 기회를 만나보세요.
        </p>
        <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-2 rounded-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
          전문가 등록하기
        </button>
      </div>

      {/* 견적 발송 모달 */}
      {showQuoteModal && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto mx-4">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {selectedExpert.name}님의 견적 발송
                </h3>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>

              <QuoteForm 
                expert={selectedExpert} 
                projects={openProjects}
                onClose={() => setShowQuoteModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 견적 발송 폼 컴포넌트
function QuoteForm({ expert, projects, onClose }: { expert: any, projects: any[], onClose: () => void }) {
  const [formData, setFormData] = useState({
    projectId: '',
    totalPrice: '',
    estimatedDuration: '',
    message: '',
    workScope: [''],
    deliverables: [''],
    timeline: [{ phase: '', duration: '', description: '' }]
  });

  const QUOTE_COST = 2000; // 견적 발송 비용
  const currentUserCash = cashBalances.find(c => c.userId === expert.id);
  const hasEnoughCash = (currentUserCash?.balance || 0) >= QUOTE_COST;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field: 'workScope' | 'deliverables', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'workScope' | 'deliverables') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'workScope' | 'deliverables', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleTimelineChange = (index: number, field: 'phase' | 'duration' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      timeline: prev.timeline.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addTimelineItem = () => {
    setFormData(prev => ({
      ...prev,
      timeline: [...prev.timeline, { phase: '', duration: '', description: '' }]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectId || !formData.totalPrice || !formData.estimatedDuration) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!hasEnoughCash) {
      if (window.confirm('캐시가 부족합니다. 충전 페이지로 이동하시겠습니까?')) {
        window.location.href = '/cash';
      }
      return;
    }

    const projectTitle = projects.find(p => p.id === formData.projectId)?.title;
    
    alert(`견적이 성공적으로 발송되었습니다!\n\n프로젝트: ${projectTitle}\n견적 금액: ${new Intl.NumberFormat('ko-KR').format(parseInt(formData.totalPrice))}원\n\n마자영 캐시 ${QUOTE_COST.toLocaleString()}원이 차감되었습니다.\n남은 캐시: ${((currentUserCash?.balance || 0) - QUOTE_COST).toLocaleString()}원`);
    onClose();
  };

  const selectedProject = projects.find(p => p.id === formData.projectId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          프로젝트 선택 *
        </label>
        <select
          name="projectId"
          value={formData.projectId}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">프로젝트를 선택하세요</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title} - {project.businessName} ({new Intl.NumberFormat('ko-KR').format(project.budget)}원)
            </option>
          ))}
        </select>
      </div>

      {selectedProject && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">선택한 프로젝트 정보</h4>
          <p className="text-sm text-gray-600 mb-1">{selectedProject.description}</p>
          <p className="text-sm">
            <span className="font-medium">예산:</span> {new Intl.NumberFormat('ko-KR').format(selectedProject.budget)}원 |
            <span className="font-medium ml-2">기간:</span> {selectedProject.duration}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            견적 금액 (원) *
          </label>
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice}
            onChange={handleInputChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            예상 기간 *
          </label>
          <input
            type="text"
            name="estimatedDuration"
            value={formData.estimatedDuration}
            onChange={handleInputChange}
            required
            placeholder="예: 6주, 2개월"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          제안 메시지
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={3}
          placeholder="클라이언트에게 전달할 메시지를 작성하세요"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          포함 서비스
        </label>
        {formData.workScope.map((scope, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={scope}
              onChange={(e) => handleArrayChange('workScope', index, e.target.value)}
              placeholder="예: SNS 계정 최적화"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('workScope', index)}
              className="px-3 py-2 bg-red-500 text-white rounded-r-md hover:bg-red-600"
              disabled={formData.workScope.length === 1}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('workScope')}
          className="text-blue-600 text-sm hover:underline"
        >
          + 서비스 추가
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          납품물
        </label>
        {formData.deliverables.map((deliverable, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={deliverable}
              onChange={(e) => handleArrayChange('deliverables', index, e.target.value)}
              placeholder="예: 마케팅 전략서"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('deliverables', index)}
              className="px-3 py-2 bg-red-500 text-white rounded-r-md hover:bg-red-600"
              disabled={formData.deliverables.length === 1}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('deliverables')}
          className="text-blue-600 text-sm hover:underline"
        >
          + 납품물 추가
        </button>
      </div>

      <div className={`p-4 rounded-lg ${hasEnoughCash ? 'bg-yellow-50' : 'bg-red-50'}`}>
        <p className={`text-sm mb-2 ${hasEnoughCash ? 'text-yellow-800' : 'text-red-800'}`}>
          <strong>견적 발송 안내</strong>
        </p>
        <p className={`text-sm ${hasEnoughCash ? 'text-yellow-700' : 'text-red-700'}`}>
          견적 발송 시 <strong>마자영 캐시 {QUOTE_COST.toLocaleString()}원</strong>이 차감됩니다.
          <br />
          현재 보유 캐시: <strong>{(currentUserCash?.balance || 0).toLocaleString()}원</strong>
          {!hasEnoughCash && (
            <>
              <br />
              <span className="text-red-600 font-semibold">⚠️ 캐시가 부족합니다. 충전이 필요해요!</span>
            </>
          )}
        </p>
        {!hasEnoughCash && (
          <button
            type="button"
            onClick={() => window.open('/cash', '_blank')}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            캐시 충전하기 →
          </button>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!hasEnoughCash}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
            hasEnoughCash
              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {hasEnoughCash ? '견적 발송하기' : '캐시 부족 (충전 필요)'}
        </button>
      </div>
    </form>
  );
}
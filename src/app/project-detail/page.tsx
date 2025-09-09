'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { projects, quotes, experts } from '@/lib/data';
import { Project, Quote } from '@/types';

export default function ProjectDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [projectQuotes, setProjectQuotes] = useState<Quote[]>([]);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState('');

  useEffect(() => {
    const projectId = searchParams.get('id');
    if (projectId) {
      const foundProject = projects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        const relatedQuotes = quotes.filter(q => q.projectId === projectId);
        setProjectQuotes(relatedQuotes);
      }
    }
  }, [searchParams]);

  if (!project) {
    return <div className="min-h-screen bg-gray-50 p-8">프로젝트를 찾을 수 없습니다.</div>;
  }

  const handleRequestQuote = () => {
    setShowQuoteForm(true);
  };

  const handleSubmitQuoteRequest = () => {
    alert('견적 요청이 전송되었습니다!');
    setShowQuoteForm(false);
  };

  const handleViewQuotes = () => {
    router.push(`/quotes?projectId=${project.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/projects')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← 프로젝트 목록
            </button>
            <h1 className="text-xl font-bold text-gray-900">프로젝트 상세</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>사업자: {project.businessOwnerName}</span>
                <span>•</span>
                <span>업체: {project.businessName}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'open' ? 'bg-green-100 text-green-800' :
                  project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {project.status === 'open' ? '모집중' :
                   project.status === 'in_progress' ? '진행중' :
                   project.status === 'completed' ? '완료' : '취소됨'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {project.budget.toLocaleString()}원
              </div>
              <div className="text-sm text-gray-600">예상 기간: {project.duration}</div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-2">프로젝트 설명</h3>
            <p className="text-gray-700 mb-4">{project.description}</p>
            
            <h3 className="font-medium text-gray-900 mb-2">요구사항</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {project.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="text-sm text-gray-600">
              <span>등록일: {project.createdAt}</span>
              <span className="mx-2">•</span>
              <span>마감일: {project.deadline}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={handleRequestQuote}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              견적 요청하기
            </button>
            {projectQuotes.length > 0 && (
              <button
                onClick={handleViewQuotes}
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                받은 견적 보기 ({projectQuotes.length})
              </button>
            )}
          </div>
        </div>

        {/* Quote Form */}
        {showQuoteForm && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">견적 요청</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  전문가 선택
                </label>
                <select
                  value={selectedExpert}
                  onChange={(e) => setSelectedExpert(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">전문가를 선택하세요</option>
                  {experts.map(expert => (
                    <option key={expert.id} value={expert.id}>
                      {expert.name} - {expert.expertise.join(', ')} (평점: {expert.rating})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  추가 메시지
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                  placeholder="전문가에게 전달할 메시지를 입력하세요..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitQuoteRequest}
                  disabled={!selectedExpert}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                >
                  견적 요청 보내기
                </button>
                <button
                  onClick={() => setShowQuoteForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Quotes Summary */}
        {projectQuotes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">받은 견적 요약</h3>
            <div className="space-y-3">
              {projectQuotes.slice(0, 3).map(quote => (
                <div key={quote.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{quote.expertName}</h4>
                      <div className="text-sm text-gray-600">
                        평점: {quote.expertRating} | 경력: {quote.expertExperience}년
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {quote.totalPrice.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-600">{quote.estimatedDuration}</div>
                    </div>
                  </div>
                </div>
              ))}
              {projectQuotes.length > 3 && (
                <button
                  onClick={handleViewQuotes}
                  className="w-full text-center text-blue-600 hover:text-blue-800 py-2"
                >
                  전체 견적 보기 (+{projectQuotes.length - 3}개 더)
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
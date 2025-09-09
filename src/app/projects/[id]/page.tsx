'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { projects, quotes, experts } from '@/lib/data';
import { Project, Quote } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [projectQuotes, setProjectQuotes] = useState<Quote[]>([]);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState('');

  useEffect(() => {
    const projectId = params.id as string;
    const foundProject = projects.find(p => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
      const relatedQuotes = quotes.filter(q => q.projectId === projectId);
      setProjectQuotes(relatedQuotes);
    }
  }, [params.id]);

  const handleRequestQuote = () => {
    if (!selectedExpert) {
      alert('전문가를 선택해주세요.');
      return;
    }
    alert(`${selectedExpert}님에게 견적을 요청했습니다!`);
    setShowQuoteForm(false);
    setSelectedExpert('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { text: string; color: string } } = {
      open: { text: '모집중', color: 'bg-green-100 text-green-800' },
      in_progress: { text: '진행중', color: 'bg-blue-100 text-blue-800' },
      completed: { text: '완료', color: 'bg-gray-100 text-gray-800' },
    };
    
    const config = statusConfig[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
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
        ← 목록으로 돌아가기
      </button>

      {/* 프로젝트 기본 정보 */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              {getStatusBadge(project.status)}
            </div>
            <p className="text-gray-600 text-lg mb-4">{project.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-3">프로젝트 정보</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-gray-700">의뢰업체:</span> {project.businessName}</p>
              <p><span className="font-medium text-gray-700">담당자:</span> {project.businessOwnerName}</p>
              <p><span className="font-medium text-gray-700">예산:</span> {formatPrice(project.budget)}원</p>
              <p><span className="font-medium text-gray-700">진행 기간:</span> {project.duration}</p>
              <p><span className="font-medium text-gray-700">마감일:</span> {formatDate(project.deadline)}</p>
              <p><span className="font-medium text-gray-700">등록일:</span> {formatDate(project.createdAt)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">요구사항</h3>
            <div className="flex flex-wrap gap-2">
              {project.requirements.map((req, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        </div>

        {project.status === 'open' && (
          <div className="mt-8 pt-6 border-t">
            <div className="flex space-x-4">
              <button
                onClick={() => setShowQuoteForm(!showQuoteForm)}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                견적 요청하기
              </button>
              <button
                onClick={() => router.push(`/projects/${project.id}/quotes`)}
                className="border-2 border-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-border text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                style={{
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899) border-box',
                  border: '2px solid transparent'
                }}
              >
                받은 견적 보기 ({projectQuotes.length})
              </button>
            </div>
          </div>
        )}

        {project.status === 'in_progress' && project.expertName && (
          <div className="mt-8 pt-6 border-t">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">
                <span className="font-semibold">{project.expertName}</span>님이 이 프로젝트를 진행하고 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 견적 요청 폼 */}
      {showQuoteForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">견적 요청하기</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전문가 선택
              </label>
              <select
                value={selectedExpert}
                onChange={(e) => setSelectedExpert(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전문가를 선택해주세요</option>
                {experts.map((expert) => (
                  <option key={expert.id} value={expert.name}>
                    {expert.name} - {expert.expertise.join(', ')} (★{expert.rating})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRequestQuote}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                견적 요청
              </button>
              <button
                onClick={() => setShowQuoteForm(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 받은 견적 미리보기 */}
      {projectQuotes.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">받은 견적</h3>
            <button
              onClick={() => router.push(`/projects/${project.id}/quotes`)}
              className="text-blue-600 hover:underline"
            >
              전체 보기 →
            </button>
          </div>
          
          <div className="space-y-4">
            {projectQuotes.slice(0, 2).map((quote) => (
              <div key={quote.id} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{quote.expertName}</h4>
                    <p className="text-sm text-gray-600">
                      {getRatingStars(quote.expertRating)} ({quote.expertRating}) | {quote.expertExperience}년 경력
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">{formatPrice(quote.totalPrice)}원</p>
                    <p className="text-sm text-gray-600">{quote.estimatedDuration}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">{quote.message}</p>
                <div className="flex flex-wrap gap-2">
                  {quote.workScope.slice(0, 3).map((scope, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {scope}
                    </span>
                  ))}
                  {quote.workScope.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{quote.workScope.length - 3}개 더
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
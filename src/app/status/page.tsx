'use client';

import { projects, experts, applications } from '@/lib/data';

export default function StatusPage() {
  const totalProjects = projects.length;
  const openProjects = projects.filter(p => p.status === 'open').length;
  const inProgressProjects = projects.filter(p => p.status === 'in_progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  
  const totalExperts = experts.length;
  const activeExperts = experts.filter(e => e.completedProjects > 0).length;
  
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(a => a.status === 'pending').length;
  
  const averageProjectBudget = projects.reduce((sum, p) => sum + p.budget, 0) / projects.length;
  const averageExpertRate = experts.reduce((sum, e) => sum + e.hourlyRate, 0) / experts.length;
  const averageRating = experts.reduce((sum, e) => sum + e.rating, 0) / experts.length;

  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const topExperts = experts
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(num));
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">마자영 현황</h1>
      <p className="text-gray-600 mb-8">실시간 플랫폼 통계를 확인해보세요</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">전체 프로젝트</h3>
          <p className="text-3xl font-bold text-blue-600">{totalProjects}</p>
          <p className="text-sm text-gray-500 mt-1">등록된 총 프로젝트 수</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">모집중 프로젝트</h3>
          <p className="text-3xl font-bold text-green-600">{openProjects}</p>
          <p className="text-sm text-gray-500 mt-1">현재 지원 가능한 프로젝트</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">등록된 전문가</h3>
          <p className="text-3xl font-bold text-purple-600">{totalExperts}</p>
          <p className="text-sm text-gray-500 mt-1">활동 중인 마케팅 전문가</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">대기중 지원</h3>
          <p className="text-3xl font-bold text-orange-600">{pendingApplications}</p>
          <p className="text-sm text-gray-500 mt-1">검토 대기 중인 지원서</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">프로젝트 상태 분포</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">모집중</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(openProjects / totalProjects) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{openProjects}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">진행중</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(inProgressProjects / totalProjects) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{inProgressProjects}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">완료</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full" 
                    style={{ width: `${(completedProjects / totalProjects) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{completedProjects}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">평균 통계</h3>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">평균 프로젝트 예산</span>
              <p className="text-xl font-bold text-blue-600">{formatNumber(averageProjectBudget)}원</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">평균 시간당 요금</span>
              <p className="text-xl font-bold text-purple-600">{formatNumber(averageExpertRate)}원</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">전문가 평균 평점</span>
              <p className="text-xl font-bold text-yellow-600">{averageRating.toFixed(1)}점</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">상위 전문가</h3>
          <div className="space-y-3">
            {topExperts.map((expert, index) => (
              <div key={expert.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {expert.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{expert.name}</p>
                  <p className="text-xs text-gray-500">★ {expert.rating} | {expert.completedProjects}개 완료</p>
                </div>
                <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">최근 등록된 프로젝트</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">프로젝트명</th>
                <th className="text-left p-3">상태</th>
                <th className="text-left p-3">예산</th>
                <th className="text-left p-3">의뢰업체</th>
                <th className="text-left p-3">등록일</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project) => (
                <tr key={project.id} className="border-t">
                  <td className="p-3">
                    <p className="font-medium">{project.title}</p>
                    <p className="text-xs text-gray-500 truncate max-w-48">
                      {project.description}
                    </p>
                  </td>
                  <td className="p-3">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="p-3 font-medium">
                    {formatNumber(project.budget)}원
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{project.businessName}</p>
                    <p className="text-xs text-gray-500">{project.businessOwnerName}</p>
                  </td>
                  <td className="p-3 text-gray-500">
                    {formatDate(project.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
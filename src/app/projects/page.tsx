'use client';

import { useState } from 'react';
import Link from 'next/link';
import { projects } from '@/lib/data';
import { Project } from '@/types';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'budget'>('date');

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.budget - a.budget;
  });

  const getStatusBadge = (status: Project['status']) => {
    const statusConfig = {
      open: { text: '모집중', color: 'bg-green-100 text-green-800' },
      in_progress: { text: '진행중', color: 'bg-blue-100 text-blue-800' },
      completed: { text: '완료', color: 'bg-gray-100 text-gray-800' },
      cancelled: { text: '취소', color: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('ko-KR').format(budget);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl lg:text-3xl font-bold">프로젝트 목록</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="all">전체</option>
            <option value="open">모집중</option>
            <option value="in_progress">진행중</option>
            <option value="completed">완료</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="date">최신순</option>
            <option value="budget">예산순</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {sortedProjects.map((project) => (
          <div key={project.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 space-y-2 sm:space-y-0">
                  <Link 
                    href={`/project-detail?id=${project.id}`}
                    className="text-lg sm:text-xl font-semibold hover:text-blue-600 transition-colors"
                  >
                    {project.title}
                  </Link>
                  {getStatusBadge(project.status)}
                </div>
                <p className="text-gray-600 mb-3 text-sm sm:text-base">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs sm:text-sm rounded"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-1">
                <p><span className="font-medium">의뢰업체:</span> {project.businessName}</p>
                <p><span className="font-medium">담당자:</span> {project.businessOwnerName}</p>
                <p><span className="font-medium">예산:</span> <span className="text-blue-600 font-semibold">{formatBudget(project.budget)}원</span></p>
              </div>
              <div className="space-y-1">
                <p><span className="font-medium">기간:</span> {project.duration}</p>
                <p><span className="font-medium">마감일:</span> {formatDate(project.deadline)}</p>
                <p><span className="font-medium">등록일:</span> {formatDate(project.createdAt)}</p>
                {project.expertName && (
                  <p><span className="font-medium">담당 전문가:</span> {project.expertName}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 pt-4 border-t space-y-2 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-500">
                프로젝트 ID: {project.id}
              </div>
              <Link 
                href={`/project-detail?id=${project.id}`}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-2 rounded-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-block text-center text-sm sm:text-base"
              >
                {project.status === 'open' ? '상세보기 / 견적요청' : '프로젝트 상세보기'}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {sortedProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">해당 조건의 프로젝트가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
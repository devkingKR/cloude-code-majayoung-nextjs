import { Expert, Project, Quote } from '@/types';

// AI 추천 시스템을 위한 유틸리티 함수들

export interface ExpertScore {
  expertId: string;
  score: number;
  reasons: string[];
  matchPercentage: number;
  recommendationLevel: 'high' | 'medium' | 'low';
}

// 업종별 전문가 매칭 점수 계산
export function calculateIndustryMatch(expert: Expert, projectRequirements: string[], businessType?: string): number {
  let score = 0;
  const expertSkills = expert.expertise.map(skill => skill.toLowerCase());
  const requirements = projectRequirements.map(req => req.toLowerCase());
  
  // 전문 분야 일치도 체크
  requirements.forEach(req => {
    expertSkills.forEach(skill => {
      if (skill.includes(req) || req.includes(skill)) {
        score += 20;
      }
    });
  });
  
  // 업종별 가중치 적용
  if (businessType) {
    const industryMapping = {
      '카페/음료': ['sns', 'instagram', '인스타그램', '소셜', '브랜딩', '로컬'],
      '음식점': ['sns', '리뷰', '로컬', 'seo', '검색', '블로그'],
      '미용/뷰티': ['instagram', '인스타그램', '틱톡', '인플루언서', '뷰티'],
      '패션/의류': ['instagram', '인스타그램', '쇼핑몰', '온라인', '광고'],
      '헬스/피트니스': ['sns', '로컬', '이벤트', '회원', '커뮤니티'],
    };
    
    const industryKeywords = industryMapping[businessType as keyof typeof industryMapping] || [];
    industryKeywords.forEach(keyword => {
      expertSkills.forEach(skill => {
        if (skill.includes(keyword)) {
          score += 15;
        }
      });
    });
  }
  
  return Math.min(score, 100); // 최대 100점
}

// 경력 및 평점 기반 점수
export function calculateExperienceScore(expert: Expert, projectBudget: number): number {
  let score = 0;
  
  // 경력 점수 (0-30점)
  score += Math.min(expert.experience * 5, 30);
  
  // 평점 점수 (0-25점)
  score += (expert.rating - 3) * 12.5; // 3점 기준으로 0-25점
  
  // 완료 프로젝트 점수 (0-20점)
  score += Math.min(expert.completedProjects * 0.5, 20);
  
  // 예산 대비 적정성 (0-25점)
  const budgetRatio = projectBudget / (expert.hourlyRate * 40); // 40시간 기준
  if (budgetRatio >= 0.5 && budgetRatio <= 2) {
    score += 25; // 적정 범위
  } else if (budgetRatio >= 0.3 && budgetRatio <= 3) {
    score += 15; // 허용 범위
  } else {
    score += 5; // 부적정
  }
  
  return Math.min(score, 100);
}

// 프로젝트 유사도 기반 점수
export function calculateProjectSimilarity(expert: Expert, project: Project): number {
  let score = 0;
  
  // 포트폴리오 키워드 매칭
  const projectKeywords = [
    ...project.requirements.map(r => r.toLowerCase()),
    project.businessName.toLowerCase(),
    project.description.toLowerCase()
  ].join(' ');
  
  expert.portfolio.forEach(portfolioItem => {
    const portfolioKeywords = portfolioItem.toLowerCase();
    project.requirements.forEach(req => {
      if (portfolioKeywords.includes(req.toLowerCase())) {
        score += 15;
      }
    });
  });
  
  return Math.min(score, 100);
}

// 종합 추천 점수 계산
export function calculateOverallRecommendation(
  expert: Expert, 
  project: Project, 
  businessType?: string
): ExpertScore {
  const industryScore = calculateIndustryMatch(expert, project.requirements, businessType);
  const experienceScore = calculateExperienceScore(expert, project.budget);
  const similarityScore = calculateProjectSimilarity(expert, project);
  
  // 가중 평균 계산
  const totalScore = (industryScore * 0.4) + (experienceScore * 0.35) + (similarityScore * 0.25);
  const matchPercentage = Math.round(totalScore);
  
  // 경험 기반 개인화된 추천 이유 생성
  const reasons: string[] = [];
  
  // 업종별 특화 경험 분석
  if (industryScore > 80) {
    reasons.push(`${businessType || project.businessName} 업종에서 탁월한 성과를 보인 최고 수준의 전문가입니다`);
  } else if (industryScore > 60) {
    reasons.push(`${businessType || project.businessName}과 유사한 업종에서 풍부한 경험을 보유하고 있습니다`);
  }
  
  // 평점 기반 차별화 메시지
  if (expert.rating >= 4.8) {
    reasons.push(`최고 등급의 평점(${expert.rating}점)으로 모든 고객이 만족한 검증된 전문가입니다`);
  } else if (expert.rating >= 4.5) {
    reasons.push(`우수한 평점(${expert.rating}점)으로 고객 만족도가 뛰어납니다`);
  } else if (expert.rating >= 4.0) {
    reasons.push(`신뢰할 수 있는 평점(${expert.rating}점)을 유지하고 있습니다`);
  }
  
  // 경력별 차별화 메시지
  if (expert.experience >= 7) {
    reasons.push(`${expert.experience}년의 시니어 레벨 전문성으로 복잡한 마케팅 전략도 완벽하게 수행합니다`);
  } else if (expert.experience >= 5) {
    reasons.push(`${expert.experience}년의 전문 경력으로 다양한 마케팅 챌린지를 해결해 왔습니다`);
  } else if (expert.experience >= 3) {
    reasons.push(`${expert.experience}년의 실무 경험으로 실용적이고 효과적인 마케팅을 제공합니다`);
  } else if (expert.experience >= 1) {
    reasons.push(`${expert.experience}년의 경험으로 최신 마케팅 트렌드에 밝은 젊은 전문가입니다`);
  }
  
  // 프로젝트 완료 수에 따른 신뢰도 메시지
  if (expert.completedProjects >= 50) {
    reasons.push(`${expert.completedProjects}개의 대규모 프로젝트 완료로 어떤 규모의 작업도 안정적으로 처리 가능합니다`);
  } else if (expert.completedProjects >= 30) {
    reasons.push(`${expert.completedProjects}개의 다양한 프로젝트 완료로 폭넓은 경험을 보유하고 있습니다`);
  } else if (expert.completedProjects >= 20) {
    reasons.push(`${expert.completedProjects}개의 프로젝트 완료로 검증된 실력을 보유하고 있습니다`);
  } else if (expert.completedProjects >= 10) {
    reasons.push(`${expert.completedProjects}개의 성공적인 프로젝트로 실무 경험이 충분합니다`);
  }
  
  // 예산 최적화 메시지
  const budgetRatio = project.budget / (expert.hourlyRate * 40);
  if (budgetRatio >= 1.2 && budgetRatio <= 1.8) {
    reasons.push('예산 대비 최고의 품질을 제공할 수 있는 최적의 파트너입니다');
  } else if (budgetRatio >= 0.8 && budgetRatio <= 1.5) {
    reasons.push('프로젝트 예산에 최적화된 합리적인 서비스를 제공합니다');
  } else if (budgetRatio >= 0.5 && budgetRatio <= 1.0) {
    reasons.push('예산 효율성이 뛰어난 비용 대비 우수한 전문가입니다');
  }
  
  // 포트폴리오 기반 특화 메시지
  if (expert.portfolio.length > 0) {
    const relevantPortfolio = expert.portfolio.filter(p => 
      project.requirements.some(req => 
        p.toLowerCase().includes(req.toLowerCase())
      )
    );
    
    if (relevantPortfolio.length >= 3) {
      reasons.push('동일한 분야에서 다수의 성공 사례를 보유한 해당 분야 스페셜리스트입니다');
    } else if (relevantPortfolio.length >= 2) {
      reasons.push('유사한 프로젝트에서 검증된 성공 경험을 보유하고 있습니다');
    } else if (relevantPortfolio.length >= 1) {
      reasons.push('관련 분야의 실무 경험으로 프로젝트를 성공적으로 완수할 수 있습니다');
    }
  }
  
  // 전문 분야별 특화 메시지
  if (project.requirements.length > 0) {
    const matchingSkills = expert.expertise.filter(skill => 
      project.requirements.some(req => 
        skill.toLowerCase().includes(req.toLowerCase()) || 
        req.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    if (matchingSkills.length >= 3) {
      reasons.push(`${matchingSkills.slice(0,2).join(', ')} 등 프로젝트 핵심 요구사항에 완벽하게 부합합니다`);
    } else if (matchingSkills.length >= 2) {
      reasons.push(`${matchingSkills.join(', ')} 분야의 전문성으로 프로젝트를 성공으로 이끌 수 있습니다`);
    }
  }
  
  // 추천 레벨 결정
  let recommendationLevel: 'high' | 'medium' | 'low' = 'low';
  if (matchPercentage >= 80) {
    recommendationLevel = 'high';
  } else if (matchPercentage >= 60) {
    recommendationLevel = 'medium';
  }
  
  return {
    expertId: expert.id,
    score: totalScore,
    reasons,
    matchPercentage,
    recommendationLevel
  };
}

// 전문가 목록을 추천 점수순으로 정렬
export function rankExpertsByRecommendation(
  experts: Expert[], 
  project: Project, 
  businessType?: string
): ExpertScore[] {
  const scores = experts.map(expert => 
    calculateOverallRecommendation(expert, project, businessType)
  );
  
  return scores.sort((a, b) => b.score - a.score);
}

// 견적 목록을 추천 점수순으로 정렬
export function rankQuotesByRecommendation(
  quotes: Quote[], 
  experts: Expert[], 
  project: Project, 
  businessType?: string
): (Quote & { recommendationScore?: ExpertScore })[] {
  const expertScores = new Map<string, ExpertScore>();
  
  // 전문가별 추천 점수 계산
  experts.forEach(expert => {
    const score = calculateOverallRecommendation(expert, project, businessType);
    expertScores.set(expert.id, score);
  });
  
  // 견적에 추천 점수 추가하고 정렬
  const quotesWithScores = quotes.map(quote => ({
    ...quote,
    recommendationScore: expertScores.get(quote.expertId)
  }));
  
  return quotesWithScores.sort((a, b) => {
    const scoreA = a.recommendationScore?.score || 0;
    const scoreB = b.recommendationScore?.score || 0;
    
    // 추천 점수가 같으면 평점과 가격으로 2차 정렬
    if (Math.abs(scoreA - scoreB) < 5) {
      const ratingDiff = b.expertRating - a.expertRating;
      if (Math.abs(ratingDiff) < 0.2) {
        return a.totalPrice - b.totalPrice; // 가격 낮은 순
      }
      return ratingDiff; // 평점 높은 순
    }
    
    return scoreB - scoreA; // 추천 점수 높은 순
  });
}

// 업종별 추천 전문가 필터링
export function getRecommendedExpertsForIndustry(
  experts: Expert[], 
  businessType: string, 
  limit: number = 3
): Expert[] {
  const industryKeywords = {
    '카페/음료': ['sns', 'instagram', '인스타그램', '소셜', '브랜딩'],
    '음식점': ['sns', '리뷰', 'seo', '검색', '블로그'],
    '미용/뷰티': ['instagram', '인스타그램', '틱톡', '인플루언서'],
    '패션/의류': ['instagram', '인스타그램', '쇼핑몰', '온라인'],
    '헬스/피트니스': ['sns', '로컬', '이벤트', '커뮤니티'],
  };
  
  const keywords = industryKeywords[businessType as keyof typeof industryKeywords] || [];
  
  const scored = experts.map(expert => {
    let score = 0;
    const expertSkills = expert.expertise.map(skill => skill.toLowerCase());
    
    keywords.forEach(keyword => {
      expertSkills.forEach(skill => {
        if (skill.includes(keyword)) {
          score += expert.rating * expert.experience;
        }
      });
    });
    
    return { expert, score };
  });
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.expert);
}
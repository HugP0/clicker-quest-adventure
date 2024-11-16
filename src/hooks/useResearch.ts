import { useState } from 'react';
import { ResearchProject } from '@/types/powerPlant';
import { toast } from 'sonner';

const INITIAL_RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: "efficiency1",
    name: "Enhanced Efficiency",
    description: "Improve power plant efficiency by 10%",
    cost: 1000,
    requiredEnergy: 500,
    completed: false,
    unlocks: ["efficiency2"]
  }
];

export const useResearch = () => {
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>(INITIAL_RESEARCH_PROJECTS);

  const startResearch = (projectId: string) => {
    setResearchProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, completed: true }
        : project
    ));
    
    const project = researchProjects.find(p => p.id === projectId);
    if (project) {
      toast.success(`Research completed: ${project.name}`);
    }
  };

  return { researchProjects, startResearch };
};
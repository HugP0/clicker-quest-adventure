import { motion } from "framer-motion";
import { ResearchProject } from "@/types/powerPlant";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

interface ResearchLabProps {
  projects: ResearchProject[];
  currentEnergy: number;
  onStartResearch: (projectId: string) => void;
}

export const ResearchLab = ({ projects, currentEnergy, onStartResearch }: ResearchLabProps) => {
  const { t } = useTranslation();

  return (
    <div className="glass-card p-4 bg-amber-950/20">
      <h3 className="text-xl font-bold text-yellow-400 mb-4">{t('research.title')}</h3>
      
      <div className="space-y-4">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="glass-card p-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-yellow-300">{project.name}</h4>
                <p className="text-sm text-yellow-200">{project.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-yellow-300">{t('research.cost')}: {project.cost} MW</p>
              </div>
            </div>
            
            <Button
              onClick={() => onStartResearch(project.id)}
              disabled={currentEnergy < project.requiredEnergy || project.completed}
              variant="outline"
              className="w-full mt-2"
            >
              {project.completed ? t('research.completed') : t('research.start')}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};